import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let browserClient: SupabaseClient | null = null

export function getBrowserSupabaseClient() {
  if (browserClient) return browserClient

  const url = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    // Keep this safe for build-time; do not throw to avoid breaking static builds.
    console.warn('VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not defined')
  }

  browserClient = createClient(url ?? '', anonKey ?? '')

  return browserClient
}

export default getBrowserSupabaseClient
