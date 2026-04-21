import type { NFTRarity as Rarity } from '../../../shared/src/nft.ts'
import { getNftBlurhash } from '../../../shared/src/blurhashes.ts'
import { initHandler } from '../_shared/handlerInit.ts'
import { fetchOwned } from '../_shared/fetchOwned.ts'
import { randomType, randomName, rollStat, buildImageUrl } from '../_shared/nftHelpers.ts'
import { respondOk, respondError, type Warning } from '../_shared/responses.ts'
import { parseBody, z } from '../_shared/validation.ts'

const OpenMysteryBoxSchema = z.object({
  box_id: z.string().uuid('box_id must be a valid UUID'),
})

// ─── Edge Function entry point ─────────────────────────────────────────────

export async function handleOpenMysteryBox(req: Request): Promise<Response> {
  const init = await initHandler(req, 'open-mystery-box')
  if (init instanceof Response) return init
  const { origin, userId, supabase } = init

  try {
    console.log(`open-mystery-box: user ${userId}`)

    // ── Request body ─────────────────────────────────────────────────────────
    const bodyResult = await parseBody(req, OpenMysteryBoxSchema)
    if (bodyResult instanceof Response) return bodyResult
    const { box_id } = bodyResult

    // ── Fetch & ownership check ──────────────────────────────────────────────
    const box = await fetchOwned<{ id: string; rarity: string; opened: boolean; user_id: string }>(supabase, 'mystery_boxes', box_id, userId, 'id, rarity, opened, user_id', origin)
    if (box instanceof Response) return box

    if (box.opened) {
      return respondError(409, 'conflict', 'This mystery box has already been opened', undefined, origin)
    }

    // ── Roll the new NFT ─────────────────────────────────────────────────────
    const rarity = box.rarity as Rarity
    const type   = randomType()
    const name   = randomName(type)

    const newNFT = {
      user_id:    userId,
      name,
      type,
      rarity,
      image_url:  buildImageUrl(type, name, rarity),
      blurhash:   getNftBlurhash(type, name, rarity) ?? null,
      efficiency: rollStat(rarity),
      resilience: rollStat(rarity),
      comfort:    rollStat(rarity),
      luck:       rollStat(rarity),
      energy:     100,
      level:      1,
      xp:         0,
    }

    console.log(`open-mystery-box: minting ${rarity} ${type} "${name}" for user ${userId}`)

    // ── Insert new NFT ───────────────────────────────────────────────────────
    const { data: created, error: insertError } = await supabase
      .from('nfts')
      .insert(newNFT)
      .select()
      .single()

    if (insertError) {
      console.error('open-mystery-box: insert error', insertError)
      return respondError(500, 'internal_error', insertError.message, undefined, origin)
    }

    // ── Mark box as opened ───────────────────────────────────────────────────
    const warnings: Warning[] = []
    const { error: updateError } = await supabase
      .from('mystery_boxes')
      .update({ opened: true })
      .eq('id', box_id)

    if (updateError) {
      console.error('open-mystery-box: update box error', updateError)
      // NFT was already created — log but don't fail the request
      warnings.push({ code: 'box_update_failed', detail: updateError.message })
    }

    // ── Return the new NFT ───────────────────────────────────────────────────
    const result = {
      id:         created.id,
      name:       created.name,
      image_url:  created.image_url,
      blurhash:   created.blurhash,
      type:       created.type,
      rarity:     created.rarity,
      efficiency: created.efficiency,
      resilience: created.resilience,
      comfort:    created.comfort,
      luck:       created.luck,
      energy:     created.energy,
      level:      created.level,
      xp:         created.xp,
      created_at: created.created_at,
      updated_at: created.updated_at,
    }

    return respondOk({
      ...result,
      ...(warnings.length ? { warnings } : {}),
    }, origin)

  } catch (err) {
    console.error('open-mystery-box: unexpected error', err)
    return respondError(500, 'internal_error',
      err instanceof Error ? err.message : 'Unknown error',
      undefined, origin,
    )
  }
}
