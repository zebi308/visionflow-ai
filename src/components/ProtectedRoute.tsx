import { useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useApp } from '../context/AppContext'

export function ProtectedRoute() {
  const { authUser } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    // Only redirect if we're sure there's no user
    // authUser null on first load is handled by Supabase session check
    if (authUser === null) {
      const timer = setTimeout(() => {
        if (!authUser) navigate('/login', { replace: true })
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [authUser, navigate])

  if (authUser === undefined) {
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
