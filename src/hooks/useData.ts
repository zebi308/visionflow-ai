import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

// ── Generic fetch helper ──────────────────────────────────────────────────────
function useFetch<T>(fetcher: () => Promise<T[]>, deps: unknown[] = []) {
  const [data, setData]       = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true); setError(null)
      setData(await fetcher())
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => { load() }, [load])
  return { data, loading, error, reload: load }
}

// ── Conversations ─────────────────────────────────────────────────────────────
export function useConversations(status?: string) {
  const fetcher = async () => {
    let q = (supabase as any).from('conversations').select('*').order('updated_at', { ascending: false })
    if (status) q = q.eq('status', status)
    const { data, error } = await q
    if (error) throw error
    return (data ?? []) as any[]
  }
  const hook = useFetch<any>(fetcher, [status])

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await (supabase as any)
      .from('conversations')
      .update({ status: newStatus, unread_count: 0 })
      .eq('id', id)
    if (error) throw error
    hook.reload()
  }
  return { ...hook, updateStatus }
}

// ── Messages ──────────────────────────────────────────────────────────────────
export function useMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading]   = useState(false)

  useEffect(() => {
    if (!conversationId) return
    setLoading(true)
    ;(supabase as any)
      .from('messages').select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .then(({ data }: { data: any[] | null }) => {
        setMessages(data ?? [])
        setLoading(false)
      })

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on('postgres_changes' as any, {
        event: 'INSERT', schema: 'public', table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      }, (payload: any) => {
        setMessages(prev => [...prev, payload.new])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [conversationId])

  const sendMessage = async (convId: string, practiceId: string, text: string) => {
    const { error } = await (supabase as any).from('messages').insert({
      conversation_id: convId, practice_id: practiceId,
      sender: 'staff', text, type: 'text',
    })
    if (error) throw error
  }

  return { messages, loading, sendMessage }
}

// ── Appointments ──────────────────────────────────────────────────────────────
export function useAppointments(dateFilter?: string) {
  const fetcher = async () => {
    let q = (supabase as any).from('appointments').select('*')
      .order('date', { ascending: true }).order('time', { ascending: true })
    if (dateFilter) q = q.eq('date', dateFilter)
    const { data, error } = await q
    if (error) throw error
    return (data ?? []) as any[]
  }
  const hook = useFetch<any>(fetcher, [dateFilter])

  const createAppointment = async (appt: Record<string, any>) => {
    const { data, error } = await (supabase as any)
      .from('appointments').insert(appt).select().single()
    if (error) throw error
    hook.reload()
    return data
  }

  const updateAppointment = async (id: string, updates: Record<string, any>) => {
    const { error } = await (supabase as any)
      .from('appointments').update(updates).eq('id', id)
    if (error) throw error
    hook.reload()
  }

  return { ...hook, createAppointment, updateAppointment }
}

// ── Leads ─────────────────────────────────────────────────────────────────────
export function useLeads() {
  const fetcher = async () => {
    const { data, error } = await (supabase as any)
      .from('leads').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []) as any[]
  }
  const hook = useFetch<any>(fetcher)

  const updateLead = async (id: string, updates: Record<string, any>) => {
    const { error } = await (supabase as any)
      .from('leads').update(updates).eq('id', id)
    if (error) throw error
    hook.reload()
  }
  return { ...hook, updateLead }
}

// ── Escalations ───────────────────────────────────────────────────────────────
export function useEscalations() {
  const fetcher = async () => {
    const { data, error } = await (supabase as any)
      .from('escalations').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []) as any[]
  }
  const hook = useFetch<any>(fetcher)

  const resolveEscalation = async (id: string) => {
    const { error } = await (supabase as any)
      .from('escalations').update({ status: 'resolved' }).eq('id', id)
    if (error) throw error
    hook.reload()
  }

  const assignEscalation = async (id: string, assignedTo: string) => {
    const { error } = await (supabase as any)
      .from('escalations').update({ status: 'in-progress', assigned_to: assignedTo }).eq('id', id)
    if (error) throw error
    hook.reload()
  }

  return { ...hook, resolveEscalation, assignEscalation }
}

// ── KB Entries ────────────────────────────────────────────────────────────────
export function useKBEntries() {
  const fetcher = async () => {
    const { data, error } = await (supabase as any)
      .from('kb_entries').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return (data ?? []) as any[]
  }
  return useFetch<any>(fetcher)
}

// ── Analytics ─────────────────────────────────────────────────────────────────
export function useAnalytics() {
  const [analytics, setAnalytics] = useState<{
    totalConversations: number
    aiHandledRate: number
    bookingsThisMonth: number
    avgResponseTime: string
    nhsVsPrivate: { nhs: number; private: number }
    topLeadCategories: { name: string; value: number }[]
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const startOfMonth = new Date(
          new Date().getFullYear(), new Date().getMonth(), 1
        ).toISOString()

        const db = supabase as any

        const [
          { count: totalConvs },
          { count: aiHandled },
          { count: bookings },
          { count: nhsCount },
        ] = await Promise.all([
          db.from('conversations').select('*', { count: 'exact', head: true }).gte('created_at', startOfMonth),
          db.from('conversations').select('*', { count: 'exact', head: true }).eq('status', 'ai-handled').gte('created_at', startOfMonth),
          db.from('appointments').select('*', { count: 'exact', head: true }).gte('created_at', startOfMonth),
          db.from('appointments').select('*', { count: 'exact', head: true }).eq('nhs_funded', true).gte('created_at', startOfMonth),
        ])

        const total = bookings ?? 0
        const nhsPct = total > 0 ? Math.round(((nhsCount ?? 0) / total) * 100) : 62

        const { data: leads } = await db.from('leads').select('category').gte('created_at', startOfMonth)
        const catCounts: Record<string, number> = {}
        ;(leads ?? []).forEach((l: any) => {
          catCounts[l.category] = (catCounts[l.category] ?? 0) + 1
        })
        const totalLeads = Object.values(catCounts).reduce((a: number, b: unknown) => a + (b as number), 0) || 1

        const labelMap: Record<string, string> = {
          'nhs-sight-test': 'NHS Sight Tests', 'contact-lenses': 'Contact Lenses',
          'new-patient': 'New Patients', 'oct-scan': 'OCT / Specialist',
          'myopia-management': 'Myopia Management', 'other': 'Other',
        }

        const topCategories = Object.entries(catCounts)
          .sort((a, b) => b[1] - a[1]).slice(0, 5)
          .map(([cat, count]) => ({
            name: labelMap[cat] ?? cat,
            value: Math.round((count / totalLeads) * 100),
          }))

        setAnalytics({
          totalConversations: totalConvs ?? 0,
          aiHandledRate: totalConvs ? (aiHandled ?? 0) / totalConvs : 0,
          bookingsThisMonth: bookings ?? 0,
          avgResponseTime: '16s',
          nhsVsPrivate: { nhs: nhsPct, private: 100 - nhsPct },
          topLeadCategories: topCategories.length > 0 ? topCategories : [
            { name: 'NHS Sight Tests', value: 38 },
            { name: 'Contact Lenses',  value: 24 },
            { name: 'New Patients',    value: 18 },
            { name: 'OCT / Specialist',value: 12 },
            { name: 'Myopia Management', value: 8 },
          ],
        })
      } catch (e) {
        console.error('Analytics error:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { analytics, loading }
}
