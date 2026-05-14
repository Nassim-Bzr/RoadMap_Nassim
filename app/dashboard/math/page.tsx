import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import MathPageClient from '@/components/math/math-page-client'

export const dynamic = 'force-dynamic'

export default async function MathPage() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== 'true') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')
  }
  return <MathPageClient />
}
