import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye, ArrowRight, ArrowLeft, CheckCircle2, Building2,
  Stethoscope, Globe, Bot, Plus, Trash2, X, ExternalLink,
  Copy, Check, Shield, Zap, Phone, MessageSquare, Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';

const STEPS = [
  { id: 1, title: 'Practice details', icon: Building2 },
  { id: 2, title: 'Services & prices', icon: Stethoscope },
  { id: 3, title: 'Connections', icon: Globe },
  { id: 4, title: 'AI setup', icon: Bot },
];

// ─── Configure Modal ──────────────────────────────────────────────────────────
function ConfigureModal({ id, onClose, onSave }: { id: string; onClose: () => void; onSave: (id: string) => void }) {
  const [waToken, setWaToken] = useState('');
  const [waPhoneId, setWaPhoneId] = useState('');
  const [waVerifyToken] = useState('optician_vf_' + Math.random().toString(36).slice(2, 10));
  const [kbDocUrl, setKbDocUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const webhookUrl = 'https://your-backend.visionflow.ai/webhook/whatsapp';

  const copyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const titles: Record<string, { title: string; sub: string }> = {
    whatsapp:   { title: 'Connect WhatsApp Business', sub: 'Connect your practice WhatsApp number via Meta' },
    kb:         { title: 'Set Up Your Knowledge Base', sub: 'Add your practice info — we handle the AI embedding' },
    elevenlabs: { title: 'Voice AI — ElevenLabs', sub: 'Configure your voice receptionist style and call forwarding' },
    escalation: { title: 'Escalation Alert Recipients', sub: 'Who gets notified when the AI escalates a call or message' },
  };
  const t = titles[id] || { title: 'Configure', sub: '' };

  return (
    <div className="fixed inset-0 bg-ink/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <h2 className="font-display font-bold text-lg text-ink">{t.title}</h2>
            <p className="text-xs text-muted mt-0.5">{t.sub}</p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-surface flex items-center justify-center text-muted hover:text-ink transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">

          {id === 'whatsapp' && (
            <>
              <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 text-xs text-brand-800 leading-relaxed">
                <p className="font-semibold mb-2">Setup steps in Meta Developer Console:</p>
                <ol className="list-decimal list-inside space-y-1 text-brand-700">
                  <li>Go to <a href="https://developers.facebook.com" target="_blank" rel="noreferrer" className="underline font-semibold">developers.facebook.com</a> → Create App → Business</li>
                  <li>Add WhatsApp product → Configuration → Webhooks</li>
                  <li>Paste the webhook URL below into Callback URL</li>
                  <li>Enter the verify token below, click Verify &amp; Save</li>
                  <li>Copy your Phone Number ID and generate a permanent System User token</li>
                </ol>
              </div>

              <div>
                <label className="label">Webhook URL <span className="font-normal text-muted">(paste into Meta)</span></label>
                <div className="flex gap-2">
                  <input readOnly value={webhookUrl} className="input text-xs bg-surface flex-1 font-mono" />
                  <button type="button" onClick={copyWebhook} className={cn('btn-secondary px-3 text-xs flex items-center gap-1.5 shrink-0 transition-all', copied && 'border-brand-400 text-brand-600')}>
                    {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                  </button>
                </div>
              </div>

              <div>
                <label className="label">Verify Token <span className="font-normal text-muted">(paste into Meta)</span></label>
                <input readOnly value={waVerifyToken} className="input text-xs font-mono bg-surface" />
                <p className="text-xs text-muted mt-1">Copy this exactly into Meta's Verify Token field before clicking Verify.</p>
              </div>

              <div>
                <label className="label">Phone Number ID</label>
                <input value={waPhoneId} onChange={e => setWaPhoneId(e.target.value)} className="input" placeholder="From Meta → WhatsApp → API Setup" />
              </div>

              <div>
                <label className="label">Permanent Access Token</label>
                <input type="password" value={waToken} onChange={e => setWaToken(e.target.value)} className="input" placeholder="EAAxxxxxx — generate via System User" />
                <p className="text-xs text-muted mt-1.5">
                  ⚠ The temporary token expires in 24h. In{' '}
                  <a href="https://business.facebook.com" target="_blank" rel="noreferrer" className="text-brand-600 underline">Meta Business Manager</a>
                  {' '}create a System User → generate token → select <code className="bg-surface px-1 rounded text-[10px]">whatsapp_business_messaging</code>.
                </p>
              </div>

              <a href="https://developers.facebook.com/docs/whatsapp/cloud-api/get-started" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-brand-600 font-semibold hover:underline">
                <ExternalLink className="w-3.5 h-3.5" /> Open Meta WhatsApp setup guide
              </a>
            </>
          )}

          {id === 'kb' && (
            <>
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-xs text-emerald-800 leading-relaxed">
                <p className="font-semibold mb-1">How it works</p>
                <p className="text-emerald-700">You fill in a Google Docs template with your practice info. We automatically chunk and embed it into our Pinecone index in your practice's isolated namespace. No Pinecone account needed on your end.</p>
              </div>

              {[
                { n: '1', title: 'Open the KB template', desc: 'Pre-filled with sections for services, prices, optometrists, NHS eligibility, and opening hours', action: <a href="https://docs.google.com/document/d/TEMPLATE_ID/copy" target="_blank" rel="noreferrer" className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 shrink-0 no-underline"><ExternalLink className="w-3.5 h-3.5" /> Open</a> },
                { n: '2', title: 'Fill in your practice details', desc: 'Services, prices, optometrist GOC numbers and bios, opening hours, any special policies' },
                { n: '3', title: 'Paste the URL below', desc: 'We embed it automatically — takes about 2 minutes' },
              ].map(step => (
                <div key={step.n} className="flex items-center gap-3 p-3 bg-surface rounded-xl border border-border">
                  <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm shrink-0">{step.n}</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-ink">{step.title}</p>
                    <p className="text-xs text-muted">{step.desc}</p>
                  </div>
                  {step.action}
                </div>
              ))}

              <div>
                <label className="label">Your Google Doc URL</label>
                <input value={kbDocUrl} onChange={e => setKbDocUrl(e.target.value)} className="input" placeholder="https://docs.google.com/document/d/..." />
              </div>

              <div className="p-3 bg-surface rounded-xl border border-border text-xs text-muted">
                <span className="font-semibold text-ink">Data isolation: </span>
                Your practice is assigned a unique Pinecone namespace. No other practice can access your knowledge base. You can update it anytime by editing the Google Doc and clicking Re-sync in the Knowledge Base section.
              </div>
            </>
          )}

          {id === 'elevenlabs' && (
            <>
              <div className="bg-violet-50 border border-violet-100 rounded-xl p-4 text-xs text-violet-800 leading-relaxed">
                <p className="font-semibold mb-1">Managed by VisionFlow</p>
                <p className="text-violet-700">Voice AI is powered by our ElevenLabs Conversational AI integration. You don't need your own ElevenLabs account — just choose a voice and configure your call forwarding below.</p>
              </div>

              <div>
                <label className="label">Voice Style</label>
                <div className="space-y-2 mt-2">
                  {[
                    { id: 'sophie', name: 'Sophie', desc: 'British Female · Warm and professional', recommended: true },
                    { id: 'james',  name: 'James',  desc: 'British Male · Clear and formal' },
                    { id: 'emma',   name: 'Emma',   desc: 'British Female · Friendly and approachable' },
                  ].map((v, i) => (
                    <label key={v.id} className={cn('flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all', i === 0 ? 'border-brand-400 bg-brand-50' : 'border-border hover:border-brand-200')}>
                      <input type="radio" name="voice" defaultChecked={i === 0} className="accent-brand-600" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-ink">{v.name}</span>
                          {v.recommended && <span className="text-[10px] font-bold text-brand-600 bg-brand-100 px-2 py-0.5 rounded-full">Recommended</span>}
                        </div>
                        <p className="text-xs text-muted mt-0.5">{v.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-2 space-y-2">
                <p className="label">Listen to voice samples</p>
                  {[
                    { name: 'Sophie', text: `"Hi there! Thanks for calling ClearView Opticians. I'm Sophie, the AI assistant. I can help with NHS eye test bookings, contact lens queries, and general enquiries. How can I help you today?"` },
                    { name: 'James',  text: `"Good morning. You've reached ClearView Opticians. This is James, the automated assistant. I can assist with appointment bookings, NHS eligibility checks, and pricing information."` },
                    { name: 'Emma',   text: `"Hello! Welcome to ClearView Opticians. I'm Emma, here to help! Whether you'd like to book a sight test, ask about NHS eligibility, or enquire about contact lenses, I'm happy to assist."` },
                  ].map((v) => (
                  <div key={v.name} className="flex items-start gap-3 p-3 bg-surface rounded-xl border border-border">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-ink mb-1">{v.name} — sample script</p>
                      <p className="text-xs text-muted italic leading-relaxed">"{v.text}"</p>
                    </div>
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center cursor-pointer hover:bg-brand-100 transition-colors" title="Audio preview coming soon">
                        <span className="text-base">▶</span>
                      </div>
                      <p className="text-[9px] text-muted">~30s</p>
                    </div>
                  </div>
                ))}
                <p className="text-xs text-muted">Live audio previews via ElevenLabs are enabled after your account is activated. The scripts above show what each voice says.</p>
              </div>

              <div>
                <label className="label">Call Forwarding Number</label>
                <input className="input" placeholder="+44 7XXX XXXXXX — your practice line or a new dedicated number" />
                <p className="text-xs text-muted mt-1.5">Forward your existing practice phone to this number, or use it as your new practice number. We provide a dedicated UK number with your plan.</p>
              </div>

              <div>
                <label className="label">After-Hours Handling</label>
                <select className="input">
                  <option>Continue booking via AI 24/7 (recommended)</option>
                  <option>Take message — call back next working day</option>
                  <option>Emergency escalation only when closed</option>
                </select>
              </div>
            </>
          )}

          {id === 'escalation' && (
            <>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
                <p className="font-semibold mb-1">When the AI sends an escalation alert:</p>
                <ul className="text-amber-700 space-y-1 mt-1">
                  <li>• Patient reports sudden vision loss, flashing lights, floaters, or eye trauma</li>
                  <li>• Patient explicitly asks to speak with an optometrist or manager</li>
                  <li>• Signs of frustration, complaint, or distress</li>
                  <li>• Clinical question requiring professional judgement</li>
                </ul>
              </div>

              <div>
                <label className="label">Alert Email Recipients</label>
                <textarea className="input resize-none" rows={3} placeholder={"raj@yourpractice.co.uk\nreception@yourpractice.co.uk"} />
                <p className="text-xs text-muted mt-1.5">One email per line. Each recipient gets an instant email with the patient's name, phone number, and full conversation summary.</p>
              </div>

              <div>
                <label className="label">Eye Emergency SMS Number <span className="font-normal text-muted">(optional)</span></label>
                <input className="input" placeholder="+44 7XXX XXXXXX — on-call optometrist mobile" />
                <p className="text-xs text-muted mt-1.5">For eye emergencies only (sudden vision loss, floaters, trauma). Gets an SMS within 5 seconds of detection.</p>
              </div>

              <div>
                <label className="label">Out-of-Hours Emergency Message</label>
                <textarea className="input resize-none" rows={3}
                  defaultValue="Our practice is currently closed. For a suspected eye emergency, please call NHS 111 or attend your nearest A&E. We reopen at 09:00 on [next_working_day]." />
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3 px-6 py-5 border-t border-border">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button type="button" onClick={() => { onSave(id); onClose(); }} className="btn-primary flex-1 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Step 1 ───────────────────────────────────────────────────────────────────
function StepPractice({ data, onChange }: { data: Record<string, string>; onChange: (key: string, val: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-brand-50 border border-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><Building2 className="w-6 h-6 text-brand-600" /></div>
        <h2 className="font-display font-bold text-2xl text-ink mb-1">Tell us about your practice</h2>
        <p className="text-sm text-muted">We'll use this to configure your AI's context and answers</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="label">Practice Name</label><input className="input" placeholder="e.g. ClearView Opticians" /></div>
        <div>
          <label className="label">Practice Type</label>
          <select className="input"><option>NHS & Private</option><option>Independent</option><option>Private Only</option><option>Domiciliary</option></select>
        </div>
        <div><label className="label">City / Town</label><input className="input" placeholder="e.g. Leeds" /></div>
        <div><label className="label">Postcode</label><input className="input" placeholder="e.g. LS1 6DT" /></div>
        <div>
          <label className="label">GOC Practice Number</label>
          <input className="input" placeholder="e.g. GOC-01-12345" />
          <p className="text-xs text-muted mt-1">Found on your GOC registration certificate.</p>
        </div>
        <div>
          <label className="label">NHS England Region</label>
          <select className="input">
            <option>Yorkshire & Humber</option><option>London</option><option>Midlands</option>
            <option>North West</option><option>North East</option><option>South East</option>
            <option>South West</option><option>East of England</option>
          </select>
        </div>
      </div>
      <div>
        <label className="label">Opening Hours</label>
        <textarea className="input resize-none" rows={3} defaultValue={"Mon–Fri: 09:00–17:30\nSaturday: 09:00–13:00\nSunday: Closed"} />
        <p className="text-xs text-muted mt-1.5">The AI uses these to answer availability questions and direct eye emergencies to 111 when you're closed.</p>
      </div>
    </div>
  );
}

// ─── Step 2 ───────────────────────────────────────────────────────────────────
function StepServices() {
  const [services, setServices] = useState([
    { name: 'NHS Sight Test', funded: 'NHS', price: '£0 (patient-funded)', duration: '30' },
    { name: 'Private Sight Test', funded: 'Private', price: '£65', duration: '45' },
    { name: 'Contact Lens Consultation', funded: 'Private', price: '£85', duration: '45' },
    { name: 'OCT Scan', funded: 'Private', price: '£35', duration: '20' },
  ]);
  const remove = (i: number) => setServices(s => s.filter((_, idx) => idx !== i));
  const add = () => setServices(s => [...s, { name: '', funded: 'Private', price: '', duration: '30' }]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><Eye className="w-6 h-6 text-emerald-600" /></div>
        <h2 className="font-display font-bold text-2xl text-ink mb-1">Add your services</h2>
        <p className="text-sm text-muted">What can patients book via WhatsApp or Voice AI?</p>
      </div>
      <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 text-xs text-brand-800">
        <strong>NHS sight tests are free to eligible patients</strong> — over 60s, diabetics, glaucoma patients, children under 16, students under 19, and benefit claimants. Your AI handles eligibility questions automatically.
      </div>
      <div className="space-y-2.5">
        {services.map((s, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-surface rounded-xl border border-border">
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2">
              <input className="input col-span-2 md:col-span-1 text-xs py-2" placeholder="Service name" defaultValue={s.name} />
              <select className="input text-xs py-2" defaultValue={s.funded}><option>NHS</option><option>Private</option><option>Both</option></select>
              <input className="input text-xs py-2" placeholder="Price" defaultValue={s.price} />
              <input className="input text-xs py-2" placeholder="Duration (min)" defaultValue={s.duration} />
            </div>
            <button type="button" onClick={() => remove(i)} className="text-muted hover:text-rose-500 transition-colors shrink-0"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
        <button type="button" onClick={add} className="w-full p-3 border-2 border-dashed border-border rounded-xl text-sm font-semibold text-muted hover:border-brand-300 hover:text-brand-600 flex items-center justify-center gap-2 transition-all">
          <Plus className="w-4 h-4" /> Add service
        </button>
      </div>
    </div>
  );
}

// ─── Step 3 ───────────────────────────────────────────────────────────────────
function StepConnections() {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [configured, setConfigured] = useState<Set<string>>(new Set());

  const handleSave = (id: string) => setConfigured(prev => new Set([...prev, id]));

  const connections = [
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      desc: 'Connect your practice WhatsApp number via Meta Business API',
      status: 'required',
      icon: <MessageSquare className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50',
    },
    {
      id: 'kb',
      name: 'Knowledge Base',
      desc: 'Add your services, prices & team info — we embed it into AI automatically',
      status: 'required',
      icon: <span className="text-xl leading-none">📄</span>,
      bg: 'bg-brand-50',
    },
    {
      id: 'elevenlabs',
      name: 'Voice AI (ElevenLabs)',
      desc: 'Choose voice style and configure your call forwarding number',
      status: 'optional',
      icon: <Phone className="w-5 h-5 text-violet-600" />,
      bg: 'bg-violet-50',
    },
    {
      id: 'escalation',
      name: 'Escalation Alerts',
      desc: 'Who gets emailed/SMS when the AI escalates an eye emergency or complaint',
      status: 'optional',
      icon: <span className="text-xl leading-none">🔔</span>,
      bg: 'bg-amber-50',
    },
  ];

  const managedInfra = [
    { name: 'OpenAI GPT-4o', desc: 'Powers AI conversation intelligence', icon: '🤖' },
    { name: 'Pinecone Vector DB', desc: 'Stores your knowledge base in an isolated practice namespace', icon: '🗄️' },
    { name: 'ElevenLabs Conversational AI', desc: 'Natural voice synthesis for phone calls', icon: '🎙' },
    { name: 'Whisper Transcription', desc: 'Voice note and phone call transcription', icon: '🎤' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-violet-50 border border-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><Globe className="w-6 h-6 text-violet-600" /></div>
        <h2 className="font-display font-bold text-2xl text-ink mb-1">Connect your practice</h2>
        <p className="text-sm text-muted">WhatsApp and Knowledge Base are required. Everything else can be set up later.</p>
      </div>

      {/* Practice-configured connections */}
      <div className="space-y-3">
        {connections.map(c => {
          const isDone = configured.has(c.id);
          return (
            <div key={c.id} className={cn('flex items-center gap-4 p-4 rounded-xl border transition-all', isDone ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-border hover:border-brand-200')}>
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', c.bg)}>
                {c.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <p className="text-sm font-semibold text-ink">{c.name}</p>
                  <span className={cn('text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full', c.status === 'required' ? 'bg-brand-50 text-brand-600' : 'bg-slate-100 text-slate-400')}>
                    {c.status}
                  </span>
                  {isDone && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                      <CheckCircle2 className="w-3 h-3" /> Configured
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted">{c.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpenModal(c.id)}
                className={cn(
                  'shrink-0 text-xs font-semibold px-4 py-2 rounded-xl border transition-all cursor-pointer',
                  isDone
                    ? 'border-emerald-300 text-emerald-700 bg-white hover:bg-emerald-50'
                    : 'border-border text-ink bg-white hover:bg-surface hover:border-brand-300'
                )}
              >
                {isDone ? 'Edit' : 'Configure'}
              </button>
            </div>
          );
        })}
      </div>

      {/* VisionFlow-managed infrastructure */}
      <div className="rounded-2xl border border-border overflow-hidden">
        <div className="px-4 py-3 bg-ink flex items-center gap-2">
          <Shield className="w-4 h-4 text-brand-400" />
          <span className="text-xs font-bold text-white">Managed by VisionFlow — no setup needed on your end</span>
        </div>
        <div className="divide-y divide-border">
          {managedInfra.map(item => (
            <div key={item.name} className="px-4 py-3 flex items-center gap-3 bg-surface/50">
              <span className="text-base shrink-0">{item.icon}</span>
              <div className="flex-1">
                <p className="text-xs font-semibold text-ink">{item.name}</p>
                <p className="text-[11px] text-muted">{item.desc}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-emerald-600">Active</span>
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 py-3 bg-white border-t border-border">
          <p className="text-[11px] text-muted leading-relaxed">
            VisionFlow provides all AI infrastructure. Your practice data is stored in an isolated Pinecone namespace — no other practice can access your knowledge base or patient conversations.
          </p>
        </div>
      </div>

      {openModal && (
        <ConfigureModal id={openModal} onClose={() => setOpenModal(null)} onSave={handleSave} />
      )}
    </div>
  );
}

// ─── Step 4 ───────────────────────────────────────────────────────────────────
function StepAI() {
  const [personality, setPersonality] = useState(1);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-brand-50 border border-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><Bot className="w-6 h-6 text-brand-600" /></div>
        <h2 className="font-display font-bold text-2xl text-ink mb-1">Fine-tune your AI</h2>
        <p className="text-sm text-muted">How should your AI communicate with patients?</p>
      </div>

      <div>
        <label className="label">AI Personality</label>
        <div className="grid grid-cols-3 gap-3 mt-2">
          {[{ label: 'Professional', desc: 'Formal, clear, precise' }, { label: 'Friendly', desc: 'Warm, approachable' }, { label: 'Empathetic', desc: 'Caring, patient' }].map((p, i) => (
            <button key={p.label} type="button" onClick={() => setPersonality(i)}
              className={cn('px-4 py-4 rounded-xl border-2 text-center transition-all', personality === i ? 'border-brand-400 bg-brand-50' : 'border-border hover:border-brand-200 bg-white')}>
              <p className={cn('text-sm font-bold', personality === i ? 'text-brand-700' : 'text-ink')}>{p.label}</p>
              <p className={cn('text-xs mt-1', personality === i ? 'text-brand-500' : 'text-muted')}>{p.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label">AI Greeting Message</label>
        <input className="input" defaultValue="Hi! 👋 I'm the assistant at [Practice Name]. I can help with NHS eye test eligibility, appointments, and contact lens questions. How can I help?" />
        <p className="text-xs text-muted mt-1.5">[Practice Name] is replaced automatically with your practice name from step 1.</p>
      </div>

      <div>
        <label className="label">Custom Instructions <span className="font-normal text-muted normal-case">(optional)</span></label>
        <textarea className="input resize-none" rows={4}
          placeholder="e.g. Always mention our Myopia Management programme for children. For clinical questions, always escalate to the optometrist — never attempt to answer clinical queries." />
        <p className="text-xs text-muted mt-1.5">Appended to the AI system prompt. The AI will refuse clinical questions by default regardless of these instructions.</p>
      </div>

      <div>
        <label className="label">Services the AI can book</label>
        <div className="space-y-1.5 mt-2">
          {['NHS Sight Test', 'Private Sight Test', 'Contact Lens Consultation', 'Contact Lens Aftercare', 'OCT Scan', "Children's Eye Test", 'Dry Eye Clinic', 'Myopia Management', 'Spectacle Collection / Adjustment'].map(s => (
            <label key={s} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-surface transition-colors">
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-brand-600 rounded" />
              <span className="text-sm text-ink">{s}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-4 h-4 text-brand-600" />
          <p className="text-xs font-semibold text-brand-800">Built-in — no setup needed</p>
        </div>
        {['NHS sight test eligibility — all 8 categories (over-60s, diabetics, children, benefit claimants…)', 'GOC compliance — admin and booking only, clinical advice refused by default', 'Eye emergency detection — instant escalation for vision loss, floaters, trauma', 'Contact lens reorder flow with prescription currency check', 'Out-of-hours emergency guidance — 111 referral when closed', 'All UK optical terminology and regulatory context'].map(item => (
          <div key={item} className="flex items-start gap-2 text-xs text-brand-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />{item}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { practice } = useApp();
  const isLast = step === STEPS.length;

  const [practiceData, setPracticeData] = useState({
    name: practice?.name ?? '',
    type: practice?.type ?? 'NHS & Private',
    city: practice?.city ?? '',
    postcode: practice?.postcode ?? '',
    goc_number: practice?.goc_number ?? '',
    nhs_region: 'Yorkshire & Humber',
    opening_hours: 'Mon\u2013Fri: 09:00\u201317:30\nSaturday: 09:00\u201313:00\nSunday: Closed',
  });

  const handlePracticeChange = (key: string, val: string) => {
    setPracticeData(d => ({ ...d, [key]: val }));
  };

  const savePracticeData = async () => {
    if (!practice?.id) return;
    try {
      await (supabase as any)
        .from('practices')
        .update({
          name: practiceData.name || practice.name,
          type: practiceData.type,
          city: practiceData.city,
          postcode: practiceData.postcode,
          goc_number: practiceData.goc_number,
          nhs_region: practiceData.nhs_region,
          opening_hours: practiceData.opening_hours,
        })
        .eq('id', practice.id);
    } catch (e) {
      console.error('Error saving practice:', e);
    }
  };

  // Mark onboarding as done and navigate to app
  const finishOnboarding = async () => {
    setSaving(true);
    await savePracticeData();
    localStorage.setItem('vf-onboarding-done', 'true');
    setSaving(false);
    navigate('/app', { replace: true });
  };

  const handleContinue = async () => {
    if (step === 1) await savePracticeData();
    if (isLast) { finishOnboarding(); return; }
    setStep(s => s + 1);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="h-16 border-b border-border flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center"><Eye className="w-4 h-4 text-white" /></div>
          <span className="font-display font-bold text-ink">Vision<span className="text-brand-600">Flow</span></span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-3">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3">
                <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
                  step === s.id ? 'bg-brand-600 text-white' : step > s.id ? 'bg-brand-50 text-brand-600' : 'text-muted')}>
                  {step > s.id ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span>{s.id}</span>}
                  <span className="hidden lg:inline">{s.title}</span>
                </div>
                {i < STEPS.length - 1 && <div className="w-6 h-px bg-border" />}
              </div>
            ))}
          </div>
          <span className="md:hidden text-xs font-semibold text-muted">Step {step} of {STEPS.length}</span>
          <button type="button" onClick={finishOnboarding} className="btn-ghost text-xs py-1.5">Skip for now</button>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center py-12 px-4 overflow-y-auto">
        <div className="w-full max-w-2xl">
          {step === 1 && <StepPractice data={practiceData} onChange={handlePracticeChange} />}
          {step === 2 && <StepServices />}
          {step === 3 && <StepConnections />}
          {step === 4 && <StepAI />}

          <div className="flex items-center justify-between mt-10 pt-8 border-t border-border">
            <button type="button" onClick={() => setStep(s => s - 1)} disabled={step === 1}
              className="btn-secondary flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button type="button" onClick={handleContinue} disabled={saving}
              className="btn-primary flex items-center gap-2">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : isLast ? 'Launch my AI receptionist' : 'Continue'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
