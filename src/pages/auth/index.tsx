import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, ArrowRight, EyeOff, AlertCircle, Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-page)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex w-[44%] bg-ink flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="absolute rounded-full border border-white"
              style={{ width: `${(i+1)*120}px`, height: `${(i+1)*120}px`, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
          ))}
        </div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-white text-xl">
              Vision<span className="text-brand-400">Flow</span>
            </span>
          </div>
          <h2 className="font-display font-bold text-4xl text-white leading-tight mb-6">
            Your AI receptionist,<br />
            <span className="text-brand-400">answering every call.</span>
          </h2>
          <p className="text-slate-400 text-base leading-relaxed max-w-xs">
            WhatsApp and Voice AI for UK independent optical practices. NHS-ready, GOC-aware, live in 48 hours.
          </p>
        </div>
        <div className="relative space-y-4">
          {[
            { stat: '84%', label: 'of enquiries handled without staff' },
            { stat: '16s',  label: 'average AI response time' },
            { stat: 'Free', label: 'NHS sight test questions answered instantly' },
          ].map(s => (
            <div key={s.stat} className="flex items-center gap-4">
              <span className="font-display font-bold text-brand-400 text-2xl w-20 shrink-0">{s.stat}</span>
              <span className="text-slate-400 text-sm">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold" style={{ color: 'var(--text-primary)' }}>VisionFlow</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

function ErrorMsg({ msg }: { msg: string }) {
  return (
    <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">
      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
      <span>{msg}</span>
    </div>
  )
}

// ─── Login ────────────────────────────────────────────────────────────────────
export function Login() {
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow]         = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      navigate('/app', { replace: true })
    } catch (e: any) {
      setError(e.message === 'Invalid login credentials'
        ? 'Incorrect email or password. Please try again.'
        : e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell>
      <h1 className="font-display font-bold text-2xl mb-1" style={{ color: 'var(--text-primary)' }}>Welcome back</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>Sign in to your practice dashboard</p>

      <form onSubmit={handleLogin} className="space-y-4">
        {error && <ErrorMsg msg={error} />}
        <div>
          <label className="label">Email</label>
          <input
            type="email" required autoComplete="email"
            className="input" placeholder="you@yourpractice.co.uk"
            value={email} onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="label mb-0">Password</label>
            <Link to="/forgot-password" className="text-xs text-brand-600 hover:underline">Forgot password?</Link>
          </div>
          <div className="relative">
            <input
              type={show ? 'text' : 'password'} required autoComplete="current-password"
              className="input pr-10" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
            />
            <button type="button" onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign in <ArrowRight className="w-4 h-4" /></>}
        </button>
      </form>

      <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
        No account?{' '}
        <Link to="/signup" className="text-brand-600 font-semibold hover:underline">Start free trial</Link>
      </p>
    </AuthShell>
  )
}

// ─── Signup ───────────────────────────────────────────────────────────────────
export function Signup() {
  const navigate = useNavigate()
  const [step, setStep]           = useState(1)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')

  // Step 1 fields
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName]   = useState('')
  const [email, setEmail]         = useState('')
  const [practiceName, setPracticeName] = useState('')
  const [password, setPassword]   = useState('')

  // Step 2 fields
  const [practiceType, setPracticeType] = useState<'NHS & Private' | 'Independent' | 'Private Only' | 'Domiciliary'>('NHS & Private')
  const [city, setCity]           = useState('')

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    setError('')
    setStep(2)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const fullName = `${firstName} ${lastName}`.trim()

      // 1. Create Supabase auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name: fullName } },
      })
      if (authError) throw authError
      if (!authData.user) throw new Error('Signup failed — no user returned')

      // 2. Create practice
      const { data: prac, error: pracError } = await supabase
        .from('practices')
        .insert({
          name: practiceName,
          type: practiceType,
          city,
          kb_namespace: `practice_${authData.user.id.slice(0, 8)}`,
          trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .select()
        .single()
      if (pracError) throw pracError

      // 3. Update profile with practice_id and role
      const { error: profError } = await supabase
        .from('profiles')
        .update({ practice_id: prac.id, role: 'Owner', name: fullName })
        .eq('id', authData.user.id)
      if (profError) throw profError

      navigate('/onboarding', { replace: true })
    } catch (e: any) {
      if (e.message.includes('already registered')) {
        setError('This email is already registered. Please sign in instead.')
      } else {
        setError(e.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell>
      {step === 1 ? (
        <>
          <h1 className="font-display font-bold text-2xl mb-1" style={{ color: 'var(--text-primary)' }}>Start your free trial</h1>
          <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>14 days free · No card required · Cancel anytime</p>

          <form onSubmit={handleStep1} className="space-y-4">
            {error && <ErrorMsg msg={error} />}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">First Name</label>
                <input className="input" placeholder="Raj" required value={firstName} onChange={e => setFirstName(e.target.value)} />
              </div>
              <div>
                <label className="label">Last Name</label>
                <input className="input" placeholder="Patel" required value={lastName} onChange={e => setLastName(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="label">Work Email</label>
              <input type="email" className="input" placeholder="you@yourpractice.co.uk" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="label">Practice Name</label>
              <input className="input" placeholder="ClearView Opticians" required value={practiceName} onChange={e => setPracticeName(e.target.value)} />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" className="input" placeholder="At least 8 characters" required value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[11px] text-center mt-4" style={{ color: 'var(--text-muted)' }}>GDPR compliant · UK data residency · GOC-aware</p>
          <p className="text-center text-sm mt-4" style={{ color: 'var(--text-muted)' }}>
            Have an account?{' '}
            <Link to="/login" className="text-brand-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </>
      ) : (
        <>
          <h1 className="font-display font-bold text-2xl mb-1" style={{ color: 'var(--text-primary)' }}>About your practice</h1>
          <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>30 seconds — helps us configure your AI</p>

          <form onSubmit={handleSignup} className="space-y-4">
            {error && <ErrorMsg msg={error} />}
            <div>
              <label className="label">Practice Type</label>
              <select className="input" value={practiceType} onChange={e => setPracticeType(e.target.value as any)}>
                <option>NHS & Private</option>
                <option>Independent</option>
                <option>Private Only</option>
                <option>Domiciliary</option>
              </select>
            </div>
            <div>
              <label className="label">City / Town</label>
              <input className="input" placeholder="e.g. Leeds, West Yorkshire" required value={city} onChange={e => setCity(e.target.value)} />
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating your account…</>
                : <>Set up my practice <ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>
          <button type="button" onClick={() => setStep(1)}
            className="w-full text-center text-sm mt-4" style={{ color: 'var(--text-muted)' }}>
            ← Back
          </button>
        </>
      )}
    </AuthShell>
  )
}

// ─── Forgot Password ──────────────────────────────────────────────────────────
export function ForgotPassword() {
  const [email, setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]     = useState(false)
  const [error, setError]   = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      setSent(true)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell>
      <h1 className="font-display font-bold text-2xl mb-1" style={{ color: 'var(--text-primary)' }}>Reset your password</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>We'll send a reset link to your email</p>

      {sent ? (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
          ✓ Reset link sent to <strong>{email}</strong>. Check your inbox (and spam folder).
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <ErrorMsg msg={error} />}
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" placeholder="you@yourpractice.co.uk"
              required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <button type="submit" disabled={loading}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send reset link'}
          </button>
        </form>
      )}

      <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
        <Link to="/login" className="text-brand-600 font-semibold hover:underline">← Back to login</Link>
      </p>
    </AuthShell>
  )
}
