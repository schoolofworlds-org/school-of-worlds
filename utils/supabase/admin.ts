import 'server-only'
import { createClient } from '@supabase/supabase-js'

// Service-role client: bypasses RLS and can manage auth users.
// SUPABASE_SECRET_KEY must NEVER be prefixed with NEXT_PUBLIC_.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  )
}
