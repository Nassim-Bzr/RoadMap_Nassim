import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { OCR_PHASES } from '@/lib/data/ocr-phases'
import LearnPageClient from '@/components/learn/learn-page-client'

export const dynamic = 'force-dynamic'

export default async function LearnPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: progress } = await supabase
    .from('task_progress')
    .select('task_id')
    .eq('user_id', user.id)
    .eq('completed', true)

  const completedIds = new Set(progress?.map(p => p.task_id) || [])

  let nextTaskId: string | null = null
  outer: for (const phase of OCR_PHASES) {
    for (const week of phase.weeks) {
      for (const task of week.tasks) {
        if (!completedIds.has(task.id)) {
          nextTaskId = task.id
          break outer
        }
      }
    }
  }

  return <LearnPageClient nextTaskId={nextTaskId} />
}
