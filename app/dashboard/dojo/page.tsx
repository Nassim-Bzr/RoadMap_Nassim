import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DojoPageClient } from '@/components/dojo/dojo-page-client'

export const dynamic = 'force-dynamic'

export default async function DojoPage() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    return (
      <DojoPageClient
        initialSessions={[]}
        initialBests={[]}
        globalStats={{ totalSessions: 0, bestWpm: 0, avgAccuracy: 0 }}
      />
    )
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: sessions }, { data: bests }] = await Promise.all([
    supabase
      .from('dojo_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('dojo_bests')
      .select('*')
      .eq('user_id', user.id),
  ])

  const allSessions = sessions ?? []
  const bestWpm = bests ? Math.max(...bests.map((b: { best_wpm: number }) => b.best_wpm), 0) : 0
  const avgAccuracy = allSessions.length > 0
    ? Math.round(allSessions.reduce((s: number, sess: { accuracy: number }) => s + sess.accuracy, 0) / allSessions.length)
    : 0

  return (
    <DojoPageClient
      initialSessions={allSessions}
      initialBests={bests ?? []}
      globalStats={{ totalSessions: allSessions.length, bestWpm, avgAccuracy }}
    />
  )
}
