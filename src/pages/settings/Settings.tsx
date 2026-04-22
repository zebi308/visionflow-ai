import { useState } from 'react';
import { Save, Zap, MessageSquare, Bell, Shield, Building2, Phone, Server, CheckCircle2, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';

type Tab = 'practice' | 'ai' | 'whatsapp' | 'voice' | 'notifications' | 'infrastructure' | 'security';

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: 'practice',       label: 'Practice',       icon: Building2 },
  { id: 'ai',             label: 'AI Settings',    icon: Zap },
  { id: 'whatsapp',       label: 'WhatsApp',       icon: MessageSquare },
  { id: 'voice',          label: 'Voice AI',       icon: Phone },
  { id: 'notifications',  label: 'Notifications',  icon: Bell },
  { id: 'infrastructure', label: 'Infrastructure', icon: Server },
  { id: 'security',       label: 'Security',       icon: Shield },
];

// Safe env var reader — avoids TypeScript ImportMeta errors
function getEnv(key: string): string {
  const env = import.meta.env as Record<string, string | undefined>;
  return env[key] ?? '';
}

// Read-only masked display for API keys
function EnvKeyField({ envKey, label, hint }: { envKey: string; label: string; hint?: string }) {
  const [show, setShow] = useState(false);
  const value = getEnv(envKey);
  const masked = value ? value.slice(0, 8) + '••••••••••••••••••••' : '';

  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        <input
          readOnly
          type={show ? 'text' : 'password'}
          className="input pr-20 font-mono text-xs cursor-default"
          style={{ background: 'var(--bg-surface)' }}
          value={show ? value : masked}
          placeholder="Not set — add to .env.local and Vercel"
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-brand-600 font-semibold flex items-center gap-1"
        >
          {show ? <><EyeOff className="w-3.5 h-3.5" /> Hide</> : <><Eye className="w-3.5 h-3.5" /> Show</>}
        </button>
      </div>
      {!value && (
        <p className="text-xs text-rose-500 mt-1">
          Missing — add <code className="bg-rose-50 px-1 rounded">{envKey}</code> to your .env.local and Vercel environment variables.
        </p>
      )}
      {hint && value && <p className="text-xs text-muted mt-1.5">{hint}</p>}
    </div>
  );
}

// Voice samples — backtick strings prevent apostrophe parse errors
const VOICE_SAMPLES = [
  {
    name: 'Sophie',
    desc: 'British Female · Warm and professional',
    recommended: true,
    script: `"Hi there! Thanks for calling. I'm Sophie, the AI assistant. I can help with NHS eye test eligibility, booking appointments, and contact lens queries. How can I help you today?"`,
  },
  {
    name: 'James',
    desc: 'British Male · Clear and formal',
    recommended: false,
    script: `"Good morning. You've reached the practice. This is James, the automated assistant. I can assist with appointment bookings, NHS eligibility checks, and general enquiries."`,
  },
  {
    name: 'Emma',
    desc: 'British Female · Friendly and approachable',
    recommended: false,
    script: `"Hello! Welcome. I'm Emma, here to help. Whether you'd like to book a sight test, ask about NHS eligibility, or enquire about contact lenses, I'm happy to assist!"`,
  },
];

export default function Settings() {
  const { practice } = useApp();
  const [tab, setTab]                   = useState<Tab>('practice');
  const [saved, setSaved]               = useState(false);
  const [showWaToken, setShowWaToken]   = useState(false);
  const [aiActive, setAiActive]         = useState(true);
  const [voiceActive, setVoiceActive]   = useState(true);
  const [personality, setPersonality]   = useState(1);
  const [selectedVoice, setSelectedVoice] = useState(0);
  const [notifications, setNotifications] = useState({
    emergency:  true,
    escalation: true,
    booking:    false,
    dna:        true,
    digest:     true,
    syncErrors: true,
  });

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const toggleNotif = (key: keyof typeof notifications) =>
    setNotifications(n => ({ ...n, [key]: !n[key] }));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Configure your practice and AI assistant</p>
        </div>
        <button onClick={handleSave} className="btn-primary flex items-center gap-2">
          <Save className="w-4 h-4" />{saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-48 shrink-0 space-y-0.5">
          {TABS.map(t => (
            <button
              key={t.id} type="button"
              onClick={() => setTab(t.id)}
              style={{ color: tab === t.id ? undefined : 'var(--text-muted)' }}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left',
                tab === t.id ? 'bg-brand-600 text-white' : 'hover:bg-[var(--bg-surface)]'
              )}
            >
              <t.icon className="w-4 h-4" />{t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 card p-6 space-y-6">

          {/* ── Practice ──────────────────────────────────────────────── */}
          {tab === 'practice' && (
            <>
              <h3 className="font-display font-semibold" style={{ color: 'var(--text-primary)' }}>Practice Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Practice Name</label>
                  <input className="input" defaultValue={practice?.name ?? ''} />
                </div>
                <div>
                  <label className="label">Practice Type</label>
                  <select className="input" defaultValue={practice?.type ?? 'NHS & Private'}>
                    <option>NHS & Private</option>
                    <option>Independent</option>
                    <option>Private Only</option>
                    <option>Domiciliary</option>
                  </select>
                </div>
                <div>
                  <label className="label">Address</label>
                  <input className="input" defaultValue={practice?.address ?? ''} />
                </div>
                <div>
                  <label className="label">City</label>
                  <input className="input" defaultValue={practice?.city ?? ''} />
                </div>
                <div>
                  <label className="label">Postcode</label>
                  <input className="input" defaultValue={practice?.postcode ?? ''} />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input className="input" defaultValue={practice?.phone ?? ''} />
                </div>
                <div>
                  <label className="label">GOC Practice Number</label>
                  <input className="input" defaultValue={practice?.goc_number ?? ''} placeholder="GOC-01-XXXXX" />
                  <p className="text-xs text-muted mt-1">Required for GOC-regulated practice identification.</p>
                </div>
                <div>
                  <label className="label">NHS England Region</label>
                  <select className="input" defaultValue="Yorkshire & Humber">
                    <option>Yorkshire & Humber</option>
                    <option>London</option>
                    <option>Midlands</option>
                    <option>North West</option>
                    <option>North East</option>
                    <option>South East</option>
                    <option>South West</option>
                    <option>East of England</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Opening Hours</label>
                <textarea
                  className="input resize-none" rows={3}
                  defaultValue={'Mon\u2013Fri: 09:00\u201317:30\nSaturday: 09:00\u201313:00\nSunday: Closed'}
                />
                <p className="text-xs text-muted mt-1.5">
                  The AI uses these to answer availability questions and direct emergencies to 111 when closed.
                </p>
              </div>
            </>
          )}

          {/* ── AI Settings ───────────────────────────────────────────── */}
          {tab === 'ai' && (
            <>
              <h3 className="font-display font-semibold" style={{ color: 'var(--text-primary)' }}>AI Behaviour</h3>
              <div className="space-y-5">
                <div>
                  <label className="label">AI Personality</label>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    {[
                      { label: 'Professional', desc: 'Formal, clear' },
                      { label: 'Friendly',     desc: 'Warm, approachable' },
                      { label: 'Empathetic',   desc: 'Caring, patient' },
                    ].map((p, i) => (
                      <button
                        key={p.label} type="button"
                        onClick={() => setPersonality(i)}
                        className={cn(
                          'px-4 py-3 rounded-xl border-2 text-center transition-all',
                          personality === i
                            ? 'border-brand-400 bg-brand-50 text-brand-700'
                            : 'border-border text-muted hover:border-brand-200'
                        )}
                      >
                        <p className="text-sm font-semibold">{p.label}</p>
                        <p className="text-xs font-normal mt-0.5 opacity-70">{p.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label">Primary Language</label>
                  <select className="input">
                    <option>English (UK)</option>
                    <option>Welsh (Cymraeg)</option>
                    <option>English + Welsh bilingual</option>
                  </select>
                </div>

                <div>
                  <label className="label">Custom AI Instructions</label>
                  <textarea
                    className="input resize-none" rows={4}
                    defaultValue="Always mention that we accept both NHS and private patients. For eye emergencies (sudden vision loss, flashing lights, floaters), immediately escalate to the clinical team and advise the patient to attend urgently or call 111."
                  />
                  <p className="text-xs text-muted mt-1.5">
                    Appended to the AI system prompt. The AI refuses clinical questions by default regardless of these instructions.
                  </p>
                </div>

                <div>
                  <label className="label">Services the AI can book</label>
                  <div className="space-y-1.5 mt-2">
                    {[
                      'NHS Sight Test',
                      'Private Sight Test',
                      'Contact Lens Consultation',
                      'Contact Lens Aftercare',
                      'OCT Scan',
                      "Children's Eye Test",
                      'Dry Eye Clinic',
                      'Myopia Management Appointment',
                      'Spectacle Collection / Adjustment',
                    ].map(s => (
                      <label key={s} className="flex items-center gap-3 cursor-pointer p-1.5 rounded-lg hover:bg-[var(--bg-surface)] transition-colors">
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-brand-600 rounded" />
                        <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{s}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div
                  className="flex items-center justify-between p-4 rounded-xl border"
                  style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-col)' }}
                >
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>AI Active</p>
                    <p className="text-xs mt-0.5 text-muted">Pause AI and switch to manual-only mode</p>
                  </div>
                  <button
                    type="button" onClick={() => setAiActive(a => !a)}
                    className={cn('w-11 h-6 rounded-full relative transition-all', aiActive ? 'bg-brand-600' : 'bg-border')}
                  >
                    <div className={cn('w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all', aiActive ? 'left-[26px]' : 'left-0.5')} />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ── WhatsApp ──────────────────────────────────────────────── */}
          {tab === 'whatsapp' && (
            <>
              <h3 className="font-display font-semibold" style={{ color: 'var(--text-primary)' }}>WhatsApp Integration</h3>
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-800">WhatsApp Business API</p>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      {practice?.whatsapp_number ? `${practice.whatsapp_number} · Connected` : 'Not yet configured'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="label">WhatsApp Business Number</label>
                  <input className="input" defaultValue={practice?.whatsapp_number ?? ''} placeholder="+44 7XXX XXXXXX" />
                </div>
                <div>
                  <label className="label">Meta Phone Number ID</label>
                  <input className="input" defaultValue="" placeholder="From Meta → WhatsApp → API Setup" />
                </div>
                <div>
                  <label className="label">Permanent Access Token</label>
                  <div className="relative">
                    <input
                      type={showWaToken ? 'text' : 'password'}
                      className="input pr-16"
                      defaultValue=""
                      placeholder="EAAxxxxxx — generate via System User"
                    />
                    <button
                      type="button" onClick={() => setShowWaToken(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-brand-600 font-semibold"
                    >
                      {showWaToken ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <p className="text-xs text-muted mt-1.5">
                    Must be a permanent System User token — temporary tokens expire in 24h.{' '}
                    <a
                      href="https://developers.facebook.com/docs/whatsapp/cloud-api/get-started"
                      target="_blank" rel="noreferrer"
                      className="text-brand-600 hover:underline"
                    >
                      Setup guide →
                    </a>
                  </p>
                </div>
                <div>
                  <label className="label">Webhook Verify Token</label>
                  <input className="input font-mono text-xs" defaultValue="" placeholder="Your custom verify token" />
                  <p className="text-xs text-muted mt-1">Must match exactly what you set in Meta Developer Console → Webhooks.</p>
                </div>
              </div>
            </>
          )}

          {/* ── Voice AI ──────────────────────────────────────────────── */}
          {tab === 'voice' && (
            <>
              <h3 className="font-display font-semibold" style={{ color: 'var(--text-primary)' }}>Voice AI — ElevenLabs</h3>
              <div className="space-y-4">
                <div className="p-4 bg-violet-50 border border-violet-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
                    <p className="text-sm font-semibold text-violet-800">Powered by ElevenLabs Conversational AI</p>
                  </div>
                  <p className="text-xs text-violet-700">
                    VisionFlow manages ElevenLabs centrally — practices choose a voice and configure call forwarding below.
                  </p>
                </div>

                <div>
                  <label className="label">AI Voice</label>
                  <div className="space-y-2 mt-2">
                    {VOICE_SAMPLES.map((v, i) => (
                      <label
                        key={v.name}
                        className={cn(
                          'flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all',
                          selectedVoice === i ? 'border-brand-400 bg-brand-50' : 'border-border hover:border-brand-200'
                        )}
                      >
                        <input
                          type="radio" name="voice"
                          checked={selectedVoice === i}
                          onChange={() => setSelectedVoice(i)}
                          className="accent-brand-600"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-ink">{v.name}</span>
                            {v.recommended && (
                              <span className="text-[10px] font-bold text-brand-600 bg-brand-100 px-2 py-0.5 rounded-full">Recommended</span>
                            )}
                          </div>
                          <p className="text-xs text-muted mt-0.5">{v.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label">Voice Sample Scripts</label>
                  <div className="space-y-2 mt-2">
                    {VOICE_SAMPLES.map(v => (
                      <div
                        key={v.name}
                        className="flex items-start gap-3 p-3 rounded-xl border"
                        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-col)' }}
                      >
                        <div className="flex-1">
                          <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{v.name}</p>
                          <p className="text-xs italic leading-relaxed" style={{ color: 'var(--text-muted)' }}>{v.script}</p>
                        </div>
                        <div className="flex flex-col items-center gap-1 shrink-0">
                          <div
                            className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center cursor-pointer hover:bg-brand-100 transition-colors"
                            title="Preview (active after ElevenLabs setup)"
                          >
                            <span className="text-sm">▶</span>
                          </div>
                          <p className="text-[9px] text-muted">~30s</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted mt-2">Live audio previews activate after your ElevenLabs Agent ID is configured in Infrastructure.</p>
                </div>

                <div>
                  <label className="label">Call Forwarding Number</label>
                  <input className="input" defaultValue="" placeholder="+44 7XXX XXXXXX — your practice line or dedicated number" />
                  <p className="text-xs text-muted mt-1.5">Forward your existing practice phone to this number, or use it directly as your practice number.</p>
                </div>

                <div>
                  <label className="label">After-Hours Handling</label>
                  <select className="input" defaultValue="continue">
                    <option value="continue">Continue booking via AI 24/7 (recommended)</option>
                    <option value="message">Take message — call back next working day</option>
                    <option value="emergency">Emergency escalation only when closed</option>
                  </select>
                </div>

                <div
                  className="flex items-center justify-between p-4 rounded-xl border"
                  style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-col)' }}
                >
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Voice AI Active</p>
                    <p className="text-xs mt-0.5 text-muted">Available on Growth and Practice plans</p>
                  </div>
                  <button
                    type="button" onClick={() => setVoiceActive(a => !a)}
                    className={cn('w-11 h-6 rounded-full relative transition-all', voiceActive ? 'bg-brand-600' : 'bg-border')}
                  >
                    <div className={cn('w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all', voiceActive ? 'left-[26px]' : 'left-0.5')} />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ── Notifications ─────────────────────────────────────────── */}
          {tab === 'notifications' && (
            <>
              <h3 className="font-display font-semibold" style={{ color: 'var(--text-primary)' }}>Notification Preferences</h3>
              <div className="space-y-4">
                {([
                  { key: 'emergency',  label: 'Eye emergency escalation',   desc: 'Immediate email + SMS when patient reports sudden vision loss, floaters, or trauma' },
                  { key: 'escalation', label: 'New escalation',             desc: 'Patient requested to speak with an optometrist or practice manager' },
                  { key: 'booking',    label: 'New booking via AI',         desc: 'Email summary of each WhatsApp or Voice AI booking' },
                  { key: 'dna',        label: 'DNA alert',                  desc: 'Patient missed their AI-booked appointment' },
                  { key: 'digest',     label: 'Weekly analytics digest',    desc: 'Every Monday morning summary email' },
                  { key: 'syncErrors', label: 'Knowledge base sync errors', desc: 'Alert if Pinecone embedding sync fails' },
                ] as const).map(n => (
                  <div
                    key={n.key}
                    className="flex items-center justify-between p-4 rounded-xl border"
                    style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-col)' }}
                  >
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{n.label}</p>
                      <p className="text-xs mt-0.5 text-muted">{n.desc}</p>
                    </div>
                    <button
                      type="button" onClick={() => toggleNotif(n.key)}
                      className={cn('w-11 h-6 rounded-full relative transition-all', notifications[n.key] ? 'bg-brand-600' : 'bg-border')}
                    >
                      <div className={cn('w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all', notifications[n.key] ? 'left-[26px]' : 'left-0.5')} />
                    </button>
                  </div>
                ))}

                <div>
                  <label className="label">Escalation Email Recipients</label>
                  <textarea
                    className="input resize-none" rows={2}
                    placeholder={'raj@yourpractice.co.uk\nreception@yourpractice.co.uk'}
                  />
                  <p className="text-xs text-muted mt-1.5">One email per line. All recipients get an instant alert with patient name, phone, and conversation summary.</p>
                </div>

                <div>
                  <label className="label">Emergency SMS Number <span className="font-normal text-muted">(optional)</span></label>
                  <input className="input" placeholder="+44 7XXX XXXXXX — on-call optometrist mobile" />
                  <p className="text-xs text-muted mt-1.5">Eye emergencies only — gets an SMS within 5 seconds of AI detection.</p>
                </div>
              </div>
            </>
          )}

          {/* ── Infrastructure ────────────────────────────────────────── */}
          {tab === 'infrastructure' && (
            <>
              <h3 className="font-display font-semibold" style={{ color: 'var(--text-primary)' }}>Infrastructure & API Keys</h3>
              <p className="text-sm -mt-2 text-muted">
                Your platform API keys — owned by you, shared across all practices. Read from environment variables only, never stored in the codebase.
              </p>

              {/* Status panel */}
              <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border-col)' }}>
                <div className="px-4 py-3 bg-ink">
                  <p className="text-xs font-bold text-white">Platform Infrastructure Status</p>
                </div>
                <div className="divide-y" style={{ borderColor: 'var(--border-col)' }}>
                  {[
                    { name: 'OpenAI GPT-4o-mini',           desc: 'AI conversation engine',              envKey: 'VITE_OPENAI_API_KEY'      },
                    { name: 'OpenAI Whisper',                desc: 'Voice note transcription',            envKey: 'VITE_OPENAI_API_KEY'      },
                    { name: 'OpenAI text-embedding-ada-002', desc: 'Knowledge base embeddings',           envKey: 'VITE_OPENAI_API_KEY'      },
                    { name: 'Pinecone',                      desc: 'Vector DB — per-practice namespaces', envKey: 'VITE_PINECONE_API_KEY'    },
                    { name: 'ElevenLabs Conversational AI',  desc: 'Voice receptionist',                  envKey: 'VITE_ELEVENLABS_API_KEY'  },
                  ].map(item => {
                    const isSet = !!getEnv(item.envKey);
                    return (
                      <div
                        key={item.name}
                        className="px-4 py-3.5 flex items-center gap-3"
                        style={{ background: 'var(--bg-card)' }}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
                            {isSet
                              ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              : <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
                            }
                          </div>
                          <p className="text-xs mt-0.5 text-muted">{item.desc}</p>
                        </div>
                        <span className={cn(
                          'text-[10px] font-bold px-2.5 py-1 rounded-full',
                          isSet ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
                        )}>
                          {isSet ? 'configured' : 'missing'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <EnvKeyField
                envKey="VITE_OPENAI_API_KEY"
                label="OpenAI API Key"
                hint="Used for GPT-4o-mini responses, Whisper transcription, and text-embedding-ada-002. All practices share this key — usage billed to you."
              />
              <EnvKeyField
                envKey="VITE_PINECONE_API_KEY"
                label="Pinecone API Key"
                hint="Each practice gets an isolated namespace within your shared index."
              />
              <div>
                <label className="label">Pinecone Index Name</label>
                <input
                  readOnly
                  className="input font-mono text-xs cursor-default"
                  style={{ background: 'var(--bg-surface)' }}
                  value={getEnv('VITE_PINECONE_INDEX')}
                  placeholder="Not set — add VITE_PINECONE_INDEX to .env.local"
                />
              </div>
              <EnvKeyField
                envKey="VITE_ELEVENLABS_API_KEY"
                label="ElevenLabs API Key"
                hint="Used for voice synthesis and Conversational AI. Practices choose a voice style — you control the underlying agent."
              />
              <div>
                <label className="label">ElevenLabs Agent ID</label>
                <input
                  readOnly
                  className="input font-mono text-xs cursor-default"
                  style={{ background: 'var(--bg-surface)' }}
                  value={getEnv('VITE_ELEVENLABS_AGENT_ID')}
                  placeholder="Not set — add VITE_ELEVENLABS_AGENT_ID to .env.local"
                />
                <p className="text-xs text-muted mt-1.5">
                  Create your agent at{' '}
                  <a
                    href="https://elevenlabs.io/conversational-ai"
                    target="_blank" rel="noreferrer"
                    className="text-brand-600 hover:underline inline-flex items-center gap-0.5"
                  >
                    elevenlabs.io/conversational-ai <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm font-semibold text-amber-800 mb-1">Keys are read-only here</p>
                <p className="text-xs text-amber-700">
                  API keys are loaded from environment variables only — never stored in the database or codebase.
                  To update a key, change it in <code className="bg-amber-100 px-1 rounded">.env.local</code> and
                  in Vercel → Settings → Environment Variables, then redeploy.
                </p>
              </div>
            </>
          )}

          {/* ── Security ──────────────────────────────────────────────── */}
          {tab === 'security' && (
            <>
              <h3 className="font-display font-semibold" style={{ color: 'var(--text-primary)' }}>Security & Compliance</h3>
              <div className="space-y-5">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-sm font-semibold text-amber-800 mb-1">UK Data Protection & GOC Compliance</p>
                  <p className="text-xs text-amber-700">
                    This platform processes patient contact information. Ensure your Privacy Notice covers WhatsApp and Voice AI
                    communications per UK GDPR. GOC-regulated practices must consider GOS contract obligations.
                    All patient data is stored in UK/EU data centres only. We sign a{' '}
                    <a href="/dpa" className="underline font-semibold">Data Processing Agreement</a>{' '}
                    with every practice.
                  </p>
                </div>

                <div>
                  <label className="label">Current Password</label>
                  <input type="password" className="input" placeholder="••••••••" />
                </div>
                <div>
                  <label className="label">New Password</label>
                  <input type="password" className="input" placeholder="At least 8 characters" />
                </div>

                <div
                  className="flex items-center justify-between p-4 rounded-xl border"
                  style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-col)' }}
                >
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Two-Factor Authentication</p>
                    <p className="text-xs mt-0.5 text-muted">Strongly recommended for Owner and Admin accounts</p>
                  </div>
                  <button className="btn-secondary text-xs py-2">Enable 2FA</button>
                </div>

                <div
                  className="p-4 rounded-xl border space-y-2.5"
                  style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-col)' }}
                >
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Data residency</p>
                  {[
                    'All data stored in EU/UK data centres only',
                    'No data transferred to the United States',
                    'Data Processing Agreement provided to every practice',
                    'Practice data isolated via Supabase RLS + Pinecone namespaces',
                    'API keys stored in environment variables — never in database',
                  ].map(item => (
                    <div key={item} className="flex items-center gap-2 text-xs text-muted">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> {item}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
