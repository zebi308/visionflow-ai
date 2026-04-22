import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Practice } from '../context/AppContext'

export function usePractice() {
  const [practice, setPractice] = useState<Practice | null>(null)
  const [profile, setProfile]   = useState<Record<string, any> | null>(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)

  useEffect(() => { loadPractice() }, [])

  const loadPractice = async () => {
    try {
      setLoading(true)
      const { data: prof, error: profError } = await supabase
        .from('profiles').select('*').single()
      if (profError) throw profError
      setProfile(prof as Record<string, any>)

      const profRow = prof as any
      if (profRow?.practice_id) {
        const { data: prac, error: pracError } = await supabase
          .from('practices').select('*').eq('id', profRow.practice_id).single()
        if (pracError) throw pracError
        const p = prac as any
        setPractice({
          ...p,
          whatsappNumber: p.whatsapp_number,
          gocNumber: p.goc_number,
          cqcRegistered: false,
          createdAt: p.created_at,
        })
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const updatePractice = async (updates: Partial<Practice>) => {
    if (!practice) return
    const { data, error } = await supabase
      .from('practices').update(updates).eq('id', practice.id).select().single()
    if (error) throw error
    const p = data as any
    setPractice({ ...p, whatsappNumber: p.whatsapp_number, gocNumber: p.goc_number })
    return data
  }

  const createPractice = async (
    name: string,
    type: Practice['type'],
    extra?: Partial<Practice>
  ) => {
    const { data: prac, error: pracError } = await supabase
      .from('practices')
      .insert({ name, type, kb_namespace: `practice_${Date.now()}`, ...extra })
      .select().single()
    if (pracError) throw pracError

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No authenticated user')

    const { error: profError } = await supabase
      .from('profiles')
      .update({ practice_id: (prac as any).id, role: 'Owner' })
      .eq('id', user.id)
    if (profError) throw profError

    const p = prac as any
    setPractice({ ...p, whatsappNumber: p.whatsapp_number, gocNumber: p.goc_number })
    return prac
  }

  return { practice, profile, loading, error, updatePractice, createPractice, reload: loadPractice }
}
