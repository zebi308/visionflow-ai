import { useEffect } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useApp } from '../context/AppContext'

export function ProtectedRoute() {
  const { authUser, authLoading } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && !authUser) {
      navigate('/login', { replace: true })
    }
  }, [authUser, authLoading, navigate])

  if (authLoading) {
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
  const { authUser, authLoading } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && authUser) {
      navigate('/app', { replace: true })
    }
  }, [authUser, authLoading, navigate])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-page)' }}>
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
      </div>
    )
  }

  return <Outlet />
}
