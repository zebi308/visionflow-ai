import { useEffect } from 'react'
import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useApp } from '../context/AppContext'

export function ProtectedRoute() {
  const { authUser, practice, user } = useApp()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!authUser) {
      // Small delay to let Supabase session restore on page load
      const timer = setTimeout(() => {
        navigate('/login', { replace: true })
      }, 800)
      return () => clearTimeout(timer)
    }

    // If logged in but no practice set up yet, send to onboarding
    // But don't redirect if we're already on onboarding
    if (authUser && user && !practice && location.pathname !== '/onboarding') {
      navigate('/onboarding', { replace: true })
    }
  }, [authUser, practice, user, navigate, location.pathname])

  // Show spinner while session is loading
  if (authUser === null) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-page)' }}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading…</p>
        </div>
      </div>
    )
  }

  return <Outlet />
}

export function PublicRoute() {
  const { authUser } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    if (authUser) navigate('/app', { replace: true })
  }, [authUser, navigate])

  return <Outlet />
}
