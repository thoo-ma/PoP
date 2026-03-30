import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

/**
 * Supabase client — safe to import at module level.
 * During SSG/build the env vars are empty; `supabase` will be `null` and
 * callers must guard against it. The Zustand store surfaces the error in the UI.
 */
export const supabase: ReturnType<typeof createClient> | null = supabaseUrl
  ? createClient(supabaseUrl, supabaseAnon)
  : null
