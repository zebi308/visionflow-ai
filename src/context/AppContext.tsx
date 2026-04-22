import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { Database } from '../lib/database.types'

type Practice = Database['public']['Tables']['practices']['Row']
type Profile  = Database['public']['Tables']['profiles']['Row']

interface AppContextType {
  // Auth
  authUser: User | null
  authLoading: boolean
  // Profile & practice
  profile: Profile | null
  practice: Practice | null
  practiceLoading: boolean
  setPractice: (p: Practice | null) => void
  reloadPractice: () => void
  // UI
  sidebarCollapsed: boolean
  setSidebarCollapsed: (v: boolean) => void
  darkMode: boolean
  toggleDarkMode: () => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [authUser, setAuthUser]         = useState<User | null>(null)
  const [authLoading, setAuthLoading]   = useState(true)
  const [profile, setProfile]           = useState<Profile | null>(null)
  const [practice, setPractice]         = useState<Practice | null>(null)
  const [practiceLoading, setPracticeLoading] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [darkMode, setDarkMode]         = useState(() => {
    try { return localStorage.getItem('vf-theme') === 'dark' } catch { return false }
  })

  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthUser(session?.user ?? null)
      setAuthLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user ?? null)
      if (!session) {
        setProfile(null)
        setPractice(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Load profile + practice when auth user changes
  useEffect(() => {
    if (authUser) {
      loadPracticeData()
    }
  }, [authUser?.id])

  const loadPracticeData = async () => {
    if (!authUser) return
    setPracticeLoading(true)
    try {
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      setProfile(prof)

      if (prof?.practice_id) {
        const { data: prac } = await supabase
          .from('practices')
          .select('*')
          .eq('id', prof.practice_id)
          .single()

        setPractice(prac)
      }
    } catch (e) {
      console.error('Error loading practice:', e)
    } finally {
      setPracticeLoading(false)
    }
  }

  // Dark mode
  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.classList.add('dark')
      localStorage.setItem('vf-theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('vf-theme', 'light')
    }
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(d => !d)

  return (
    <AppContext.Provider value={{
      authUser, authLoading,
      profile, practice, practiceLoading, setPractice,
      reloadPractice: loadPracticeData,
      sidebarCollapsed, setSidebarCollapsed,
      darkMode, toggleDarkMode,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
