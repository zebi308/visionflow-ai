import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export interface Practice {
  id: string
  name: string
  type: 'Independent' | 'NHS & Private' | 'Private Only' | 'Domiciliary'
  address: string | null
  city: string | null
  postcode: string | null
  phone: string | null
  // camelCase aliases for UI components
  whatsappNumber?: string | null
  gocNumber?: string | null
  // snake_case from Supabase
  whatsapp_number?: string | null
  goc_number?: string | null
  nhs_region?: string | null
  opening_hours?: string | null
  ai_custom_instructions?: string | null
  wa_phone_number_id?: string | null
  wa_access_token?: string | null
  wa_verify_token?: string | null
  voice_forwarding_number?: string | null
  after_hours_handling?: string | null
  escalation_emails?: string[] | null
  escalation_sms?: string | null
  kb_namespace?: string | null
  plan: 'starter' | 'growth' | 'practice' | 'enterprise'
  trial_ends_at?: string | null
  cqcRegistered?: boolean
  createdAt?: string
  created_at?: string
}

export interface AppUser {
  id: string
  name: string
  email: string
  role: string
  practiceId: string
  createdAt: string
}

interface AppContextType {
  user: AppUser | null
  authUser: User | null
  practice: Practice | null
  setPractice: (p: Practice | null) => void
  sidebarCollapsed: boolean
  setSidebarCollapsed: (v: boolean) => void
  darkMode: boolean
  toggleDarkMode: () => void
}

const AppContext = createContext<AppContextType | null>(null)

// Shape of data returned from profiles table
interface ProfileRow {
  id: string
  name: string | null
  role: string
  practice_id: string | null
  created_at: string
}

// Shape of data returned from practices table
interface PracticeRow {
  id: string
  name: string
  type: 'Independent' | 'NHS & Private' | 'Private Only' | 'Domiciliary'
  address: string | null
  city: string | null
  postcode: string | null
  phone: string | null
  whatsapp_number: string | null
  goc_number: string | null
  nhs_region: string | null
  opening_hours: string | null
  ai_custom_instructions: string | null
  wa_phone_number_id: string | null
  wa_access_token: string | null
  wa_verify_token: string | null
  voice_forwarding_number: string | null
  after_hours_handling: string | null
  escalation_emails: string[] | null
  escalation_sms: string | null
  kb_namespace: string | null
  plan: 'starter' | 'growth' | 'practice' | 'enterprise'
  trial_ends_at: string | null
  created_at: string
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [authUser, setAuthUser] = useState<User | null>(null)
  const [user, setUser]         = useState<AppUser | null>(null)
  const [practice, setPractice] = useState<Practice | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem('vf-theme') === 'dark' } catch { return false }
  })

  useEffect(() => {
    // Check existing session on mount
    supabase.auth.getSession().then(({ data }) => {
      const u = data?.session?.user ?? null
      setAuthUser(u)
      if (u) loadProfile(u)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: string, session) => {
        const u = session?.user ?? null
        setAuthUser(u)
        if (u) loadProfile(u)
        else { setUser(null); setPractice(null) }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadProfile = async (authU: User) => {
    try {
      const { data: profData } = await supabase
        .from('profiles')
        .select('id, name, role, practice_id, created_at')
        .eq('id', authU.id)
        .single()

      const prof = profData as ProfileRow | null
      if (!prof) return

      setUser({
        id: authU.id,
        name: prof.name ?? (authU.user_metadata?.name as string) ?? 'User',
        email: authU.email ?? '',
        role: prof.role ?? 'Owner',
        practiceId: prof.practice_id ?? '',
        createdAt: prof.created_at ?? '',
      })

      if (prof.practice_id) {
        const { data: pracData } = await supabase
          .from('practices')
          .select('*')
          .eq('id', prof.practice_id)
          .single()

        const prac = pracData as PracticeRow | null
        if (!prac) return

        setPractice({
          ...prac,
          // camelCase aliases so old UI components work without changes
          whatsappNumber: prac.whatsapp_number,
          gocNumber: prac.goc_number,
          cqcRegistered: false,
          createdAt: prac.created_at,
        })
      }
    } catch (e) {
      console.error('Error loading profile:', e)
    }
  }

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

  return (
    <AppContext.Provider value={{
      user, authUser, practice, setPractice,
      sidebarCollapsed, setSidebarCollapsed,
      darkMode, toggleDarkMode: () => setDarkMode(d => !d),
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
