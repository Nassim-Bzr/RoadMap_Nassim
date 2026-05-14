import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EnglishPageClient from '@/components/english/english-page-client'

export const dynamic = 'force-dynamic'

export default async function EnglishPage() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== 'true') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')
  }
  return <EnglishPageClient />
}
