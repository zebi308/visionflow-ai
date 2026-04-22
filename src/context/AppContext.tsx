import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

// Practice type that works with both old camelCase UI code and new Supabase snake_case
export interface Practice {
  id: string
  name: string
  type: 'Independent' | 'NHS & Private' | 'Private Only' | 'Domiciliary'
  address: string | null
  city: string | null
  postcode: string | null
  phone: string | null
  // camelCase aliases (used by UI components)
  whatsappNumber?: string | null
  gocNumber?: string | null
  // snake_case (from Supabase)
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
  created_at?: string
  createdAt?: string
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
  // Keep 'user' name so existing components don't break
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

export function AppProvider({ children }: { children: ReactNode }) {
  const [authUser, setAuthUser]   = useState<User | null>(null)
  const [user, setUser]           = useState<AppUser | null>(null)
  const [practice, setPractice]   = useState<Practice | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [darkMode, setDarkMode]   = useState(() => {
    try { return localStorage.getItem('vf-theme') === 'dark' } catch { return false }
  })

  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null
      setAuthUser(u)
      if (u) loadProfile(u)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setAuthUser(u)
      if (u) loadProfile(u)
      else { setUser(null); setPractice(null) }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadProfile = async (authU: User) => {
    try {
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authU.id)
        .single()

      if (prof) {
        setUser({
          id: authU.id,
          name: prof.name ?? authU.user_metadata?.name ?? 'User',
          email: authU.email ?? '',
          role: prof.role ?? 'Owner',
          practiceId: prof.practice_id ?? '',
          createdAt: prof.created_at ?? '',
        })

        if (prof.practice_id) {
          const { data: prac } = await supabase
            .from('practices')
            .select('*')
            .eq('id', prof.practice_id)
            .single()

          if (prac) {
            // Add camelCase aliases so old UI code works
            setPractice({
              ...prac,
              whatsappNumber: prac.whatsapp_number,
              gocNumber: prac.goc_number,
              cqcRegistered: false,
              createdAt: prac.created_at,
            })
          }
        }
      }
    } catch (e) {
      console.error('Error loading profile:', e)
    }
  }

  // Dark mode
  useEffect(() => {
    const root = document.documentElement
    if (darkMode) { root.classList.add('dark'); localStorage.setItem('vf-theme', 'dark') }
    else { root.classList.remove('dark'); localStorage.setItem('vf-theme', 'light') }
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
