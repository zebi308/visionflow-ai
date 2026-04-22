import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/database.types'

type Practice = Database['public']['Tables']['practices']['Row']
type Profile  = Database['public']['Tables']['profiles']['Row']

export function usePractice() {
  const [practice, setPractice] = useState<Practice | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPractice()
  }, [])

  const loadPractice = async () => {
    try {
      setLoading(true)
      // Load profile first to get practice_id
      const { data: prof, error: profError } = await supabase
        .from('profiles')
        .select('*')
        .single()

      if (profError) throw profError
      setProfile(prof)

      if (prof.practice_id) {
        const { data: prac, error: pracError } = await supabase
          .from('practices')
          .select('*')
          .eq('id', prof.practice_id)
          .single()

        if (pracError) throw pracError
        setPractice(prac)
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
      .from('practices')
      .update(updates)
      .eq('id', practice.id)
      .select()
      .single()

    if (error) throw error
    setPractice(data)
    return data
  }

  const createPractice = async (
    name: string,
    type: Practice['type'],
    extra?: Partial<Practice>
  ) => {
    // Create the practice
    const { data: prac, error: pracError } = await supabase
      .from('practices')
      .insert({
        name,
        type,
        kb_namespace: `practice_${Date.now()}`,
        ...extra,
      })
      .select()
      .single()

    if (pracError) throw pracError

    // Link the profile to the practice and set as Owner
    const { error: profError } = await supabase
      .from('profiles')
      .update({ practice_id: prac.id, role: 'Owner' })
      .eq('id', (await supabase.auth.getUser()).data.user!.id)

    if (profError) throw profError

    setPractice(prac)
    return prac
  }

  return { practice, profile, loading, error, updatePractice, createPractice, reload: loadPractice }
}
