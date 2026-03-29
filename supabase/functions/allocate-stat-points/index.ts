import { serve } from "std/http/server"
import { requireAuth, getCorsHeaders } from '../_shared/auth.ts'
import { respondOk, respondError } from '../_shared/responses.ts'
import { parseBody, z } from '../_shared/validation.ts'

const AllocateSchema = z.object({
  nft_id:     z.string().uuid('nft_id must be a valid UUID'),
  efficiency: z.number().int().nonnegative().optional().default(0),
  resilience: z.number().int().nonnegative().optional().default(0),
  comfort:    z.number().int().nonnegative().optional().default(0),
  luck:       z.number().int().nonnegative().optional().default(0),
}).refine((d) => d.efficiency + d.resilience + d.comfort + d.luck > 0, {
  message: 'At least one point must be allocated',
})

// ─── Edge Function entry point ────────────────────────────────────────────────

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: getCorsHeaders(req.headers.get('origin')) })
  }

  try {
    // ── Auth ──────────────────────────────────────────────────────────────────
    const auth = await requireAuth(req, 'allocate-stat-points')
    if (auth instanceof Response) return auth
    const { userId, supabase } = auth

    // ── Request body ──────────────────────────────────────────────────────────
    const bodyResult = await parseBody(req, AllocateSchema)
    if (bodyResult instanceof Response) return bodyResult
    const { nft_id, efficiency, resilience, comfort, luck } = bodyResult

    const totalSpend = efficiency + resilience + comfort + luck

    // ── Fetch NFT & ownership check ───────────────────────────────────────────
    const { data: nft, error: fetchError } = await supabase
      .from('nfts')
      .select('id, efficiency, resilience, comfort, luck, stat_points')
      .eq('id', nft_id)
      .eq('user_id', userId)
      .single()

    if (fetchError || !nft) {
      return respondError(404, 'not_found', 'NFT not found or not owned by you')
    }

    // ── Validation ────────────────────────────────────────────────────────────
    if (totalSpend > nft.stat_points) {
      return respondError(422, 'insufficient_points',
        `You only have ${nft.stat_points} stat point(s) but tried to spend ${totalSpend}`,
      )
    }

    // Each stat is capped at 100
    const newEfficiency = nft.efficiency + efficiency
    const newResilience = nft.resilience + resilience
    const newComfort    = nft.comfort    + comfort
    const newLuck       = nft.luck       + luck

    if (newEfficiency > 100 || newResilience > 100 || newComfort > 100 || newLuck > 100) {
      return respondError(422, 'stat_cap_exceeded', 'A stat cannot exceed 100')
    }

    // ── Persist ───────────────────────────────────────────────────────────────
    const { data: updated, error: updateError } = await supabase
      .from('nfts')
      .update({
        efficiency:  newEfficiency,
        resilience:  newResilience,
        comfort:     newComfort,
        luck:        newLuck,
        stat_points: nft.stat_points - totalSpend,
      })
      .eq('id', nft_id)
      .eq('user_id', userId)   // defence-in-depth ownership check
      .select('id, efficiency, resilience, comfort, luck, stat_points')
      .single()

    if (updateError) {
      console.error('allocate-stat-points: update error', updateError)
      return respondError(500, 'internal_error', updateError.message)
    }

    console.log(
      `allocate-stat-points: nft=${nft_id} spent=${totalSpend} ` +
      `eff ${nft.efficiency}→${updated.efficiency} ` +
      `res ${nft.resilience}→${updated.resilience} ` +
      `com ${nft.comfort}→${updated.comfort} ` +
      `luck ${nft.luck}→${updated.luck} ` +
      `pts_remaining=${updated.stat_points}`
    )

    // ── Return result ─────────────────────────────────────────────────────────
    return respondOk({
      id:          updated.id,
      efficiency:  updated.efficiency,
      resilience:  updated.resilience,
      comfort:     updated.comfort,
      luck:        updated.luck,
      stat_points: updated.stat_points,
    })

  } catch (err) {
    console.error('allocate-stat-points: unexpected error', err)
    return respondError(500, 'internal_error',
      err instanceof Error ? err.message : 'Unknown error',
    )
  }
})
