import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, ArrowRight, EyeOff } from 'lucide-react';

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface flex">
      <div className="hidden lg:flex w-[44%] bg-ink flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          {Array.from({length:8}).map((_,i)=>(
            <div key={i} className="absolute rounded-full border border-white" style={{width:`${(i+1)*120}px`,height:`${(i+1)*120}px`,top:'50%',left:'50%',transform:'translate(-50%,-50%)'}} />
          ))}
        </div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center"><Eye className="w-5 h-5 text-white" /></div>
            <span className="font-display font-bold text-white text-xl">Vision<span className="text-brand-400">Flow</span></span>
          </div>
          <h2 className="font-display font-bold text-4xl text-white leading-tight mb-6">Your AI receptionist,<br /><span className="text-brand-400">answering every call.</span></h2>
          <p className="text-slate-400 text-base leading-relaxed max-w-xs">WhatsApp and Voice AI for UK independent optical practices. NHS-ready, GOC-aware, live in 48 hours.</p>
        </div>
        <div className="relative space-y-4">
          {[{stat:'84%',label:'of enquiries handled without staff'},{stat:'16s',label:'average AI response time'},{stat:'Free',label:'NHS sight test questions answered instantly'}].map(s=>(
            <div key={s.stat} className="flex items-center gap-4">
              <span className="font-display font-bold text-brand-400 text-2xl w-20 shrink-0">{s.stat}</span>
              <span className="text-slate-400 text-sm">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center"><Eye className="w-4 h-4 text-white" /></div>
            <span className="font-display font-bold text-ink">VisionFlow</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export function Login() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  return (
    <AuthShell>
      <h1 className="font-display font-bold text-2xl text-ink mb-1">Welcome back</h1>
      <p className="text-sm text-muted mb-8">Sign in to your practice dashboard</p>
      <div className="space-y-4">
        <div><label className="label">Email</label><input type="email" className="input" placeholder="you@yourpractice.co.uk" defaultValue="raj@clearviewopticians.co.uk" /></div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="label mb-0">Password</label>
            <a href="#" className="text-xs text-brand-600 hover:underline">Forgot password?</a>
          </div>
          <div className="relative">
            <input type={show?'text':'password'} className="input pr-10" placeholder="••••••••" defaultValue="password" />
            <button onClick={()=>setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink">
              {show?<EyeOff className="w-4 h-4" />:<Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <button onClick={()=>navigate('/app')} className="btn-primary w-full flex items-center justify-center gap-2 py-3">Sign in <ArrowRight className="w-4 h-4" /></button>
      </div>
      <p className="text-center text-sm text-muted mt-6">No account? <Link to="/signup" className="text-brand-600 font-semibold hover:underline">Start free trial</Link></p>
    </AuthShell>
  );
}

export function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  return (
    <AuthShell>
      {step===1 ? (
        <>
          <h1 className="font-display font-bold text-2xl text-ink mb-1">Start your free trial</h1>
          <p className="text-sm text-muted mb-8">14 days free · No card required · Cancel anytime</p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label">First Name</label><input className="input" placeholder="Raj" /></div>
              <div><label className="label">Last Name</label><input className="input" placeholder="Patel" /></div>
            </div>
            <div><label className="label">Work Email</label><input type="email" className="input" placeholder="you@yourpractice.co.uk" /></div>
            <div><label className="label">Practice Name</label><input className="input" placeholder="ClearView Opticians" /></div>
            <div><label className="label">Password</label><input type="password" className="input" placeholder="At least 8 characters" /></div>
            <button onClick={()=>setStep(2)} className="btn-primary w-full py-3 flex items-center justify-center gap-2">Continue <ArrowRight className="w-4 h-4" /></button>
          </div>
          <p className="text-[11px] text-center text-muted mt-4">GDPR compliant · UK data residency guaranteed · GOC-aware</p>
        </>
      ) : (
        <>
          <h1 className="font-display font-bold text-2xl text-ink mb-1">About your practice</h1>
          <p className="text-sm text-muted mb-8">30 seconds — helps us configure your AI</p>
          <div className="space-y-4">
            <div><label className="label">Practice Type</label>
              <select className="input"><option>NHS & Private</option><option>Independent</option><option>Private Only</option><option>Domiciliary</option></select>
            </div>
            <div><label className="label">Location</label><input className="input" placeholder="e.g. Leeds, West Yorkshire" /></div>
            <div><label className="label">Number of Optometrists</label>
              <select className="input"><option>1</option><option>2–3</option><option>4–6</option><option>7+</option></select>
            </div>
            <div><label className="label">Patient messages per week (approx)</label>
              <select className="input"><option>Under 50</option><option>50–150</option><option>150–400</option><option>400+</option></select>
            </div>
            <button onClick={()=>navigate('/onboarding')} className="btn-primary w-full py-3 flex items-center justify-center gap-2">Set up my practice <ArrowRight className="w-4 h-4" /></button>
          </div>
        </>
      )}
      {step===1&&<p className="text-center text-sm text-muted mt-6">Have an account? <Link to="/login" className="text-brand-600 font-semibold hover:underline">Sign in</Link></p>}
    </AuthShell>
  );
}
