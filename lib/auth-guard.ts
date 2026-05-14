import { createClient } from '@/lib/supabase/server'

export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

// Fake user id used in demo mode — stable so localStorage keys are consistent
export const DEMO_USER_ID = 'demo-local'

/**
 * Returns the current user id, or DEMO_USER_ID in demo mode.
 * Returns null if not authenticated (non-demo mode only).
 */
export async function getUserId(): Promise<string | null> {
  if (DEMO_MODE) return DEMO_USER_ID

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}
