import { useEffect, useState } from 'react'
import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useApp } from '../context/AppContext'

export function ProtectedRoute() {
  const { authUser, practice } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    // Give Supabase session 1 second to restore before making any redirect decisions
    const timer = setTimeout(() => setChecked(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!checked) return

    // Not logged in → go to login
    if (!authUser) {
      navigate('/login', { replace: true })
      return
    }

    // Logged in, no practice, not already on onboarding → go to onboarding
    // Use localStorage flag so "Skip for now" works permanently
    const onboardingDone = localStorage.getItem('vf-onboarding-done')
    if (authUser && !practice && !onboardingDone && location.pathname !== '/onboarding') {
      navigate('/onboarding', { replace: true })
    }
  }, [checked, authUser, practice, navigate, location.pathname])

  // Show spinner during initial session check
  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-page)' }}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading your dashboard…</p>
        </div>
      </div>
    )
  }

  if (!authUser) return null

  return <Outlet />
}

export function PublicRoute() {
  const { authUser } = useApp()
  const navigate = useNavigate()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setChecked(true), 800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (checked && authUser) navigate('/app', { replace: true })
  }, [checked, authUser, navigate])

  if (!checked) return null

  return <Outlet />
}
