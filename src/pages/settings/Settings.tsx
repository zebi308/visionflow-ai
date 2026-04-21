import { useState } from 'react';
import { Save, Zap, MessageSquare, Bell, Shield, Building2, Key, Phone, Server, CheckCircle2, ExternalLink } from 'lucide-react';
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

export default function Settings() {
  const { practice } = useApp();
  const [tab, setTab] = useState<Tab>('practice');
  const [saved, setSaved] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="page-header">
        <div><h1 className="page-title">Settings</h1><p className="page-subtitle">Configure your practice and AI assistant</p></div>
        <button onClick={handleSave} className="btn-primary flex items-center gap-2">
          <Save className="w-4 h-4" />{saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-48 shrink-0 space-y-0.5">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={cn('w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left',
                tab === t.id ? 'bg-brand-600 text-white' : 'text-muted hover:bg-surface hover:text-ink')}>
              <t.icon className="w-4 h-4" />{t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 card p-6 space-y-6">

          {/* ── Practice ── */}
          {tab === 'practice' && (
            <>
              <h3 className="font-display font-semibold text-ink">Practice Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="label">Practice Name</label><input className="input" defaultValue={practice?.name} /></div>
                <div>
                  <label className="label">Practice Type</label>
                  <select className="input" defaultValue={practice?.type}>
                    <option>NHS & Private</option><option>Independent</option><option>Private Only</option><option>Domiciliary</option>
                  </select>
                </div>
                <div><label className="label">Address</label><input className="input" defaultValue={practice?.address} /></div>
                <div><label className="label">City</label><input className="input" defaultValue={practice?.city} /></div>
                <div><label className="label">Postcode</label><input className="input" defaultValue={practice?.postcode} /></div>
                <div><label className="label">Phone</label><input className="input" defaultValue={practice?.phone} /></div>
                <div>
                  <label className="label">GOC Practice Number</label>
                  <input className="input" defaultValue={practice?.gocNumber} placeholder="GOC-01-XXXXX" />
                  <p className="text-xs text-muted mt-1">Required for GOC-regulated practice identification.</p>
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
                <p className="text-xs text-muted mt-1.5">The AI uses these to answer availability questions and direct emergencies to 111 when closed.</p>
              </div>
            </>
          )}

          {/* ── AI Settings ── */}
          {tab === 'ai' && (
            <>
              <h3 className="font-display font-semibold text-ink">AI Behaviour</h3>
              <div className="space-y-5">
                <div>
                  <label className="label">AI Personality</label>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    {[
                      { label: 'Professional', desc: 'Formal, clear' },
                      { label: 'Friendly', desc: 'Warm, approachable' },
                      { label: 'Empathetic', desc: 'Caring, patient' },
                    ].map((p, i) => (
                      <button key={p.label} type="button" className={cn('px-4 py-3 rounded-xl border-2 text-sm font-semibold text-center transition-all',
                        i === 0 ? 'border-brand-400 bg-brand-50 text-brand-700' : 'border-border text-muted hover:border-brand-200')}>
                        <p>{p.label}</p>
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
                  <textarea className="input resize-none" rows={4}
                    defaultValue="Always mention that we accept both NHS and private patients. For eye emergencies (sudden vision loss, flashing lights, floaters), immediately escalate to the clinical team and advise the patient to attend urgently or call 111." />
                  <p className="text-xs text-muted mt-1.5">Appended to the AI system prompt. Never include clinical advice — the AI refuses clinical questions by default.</p>
                </div>
                <div>
                  <label className="label">Services the AI can book</label>
                  <div className="space-y-2 mt-2">
                    {['NHS Sight Test', 'Private Sight Test', 'Contact Lens Consultation', 'Contact Lens Aftercare', 'OCT Scan', "Children's Eye Test", 'Dry Eye Clinic', 'Myopia Management Appointment', 'Spectacle Collection / Adjustment'].map(s => (
                      <label key={s} className="flex items-center gap-3 cursor-pointer p-1.5 rounded-lg hover:bg-surface transition-colors">
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-brand-600 rounded" />
                        <span className="text-sm text-ink">{s}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border">
                  <div><p className="text-sm font-semibold text-ink">AI Active</p><p className="text-xs text-muted mt-0.5">Pause AI and switch to manual-only mode</p></div>
                  <div className="w-11 h-6 bg-brand-600 rounded-full relative cursor-pointer">
                    <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm" />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── WhatsApp ── */}
          {tab === 'whatsapp' && (
            <>
              <h3 className="font-display font-semibold text-ink">WhatsApp Integration</h3>
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-800">WhatsApp Business API connected</p>
                    <p className="text-xs text-emerald-700 mt-0.5">+44 7700 900000 · Meta Cloud API v22.0</p>
                  </div>
                </div>
                <div>
                  <label className="label">WhatsApp Business Number</label>
                  <input className="input" defaultValue="+44 7700 900000" />
                </div>
                <div>
                  <label className="label">Meta Phone Number ID</label>
                  <input className="input" defaultValue="YOUR_PHONE_NUMBER_ID" />
                </div>
                <div>
                  <label className="label">Permanent Access Token</label>
                  <div className="relative">
                    <input type={showToken ? 'text' : 'password'} className="input pr-16" defaultValue="EAABsbCS..." />
                    <button type="button" onClick={() => setShowToken(!showToken)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-brand-600 font-semibold">
                      {showToken ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <p className="text-xs text-muted mt-1.5">
                    Must be a permanent System User token — temporary tokens expire in 24h.{' '}
                    <a href="https://developers.facebook.com/docs/whatsapp/cloud-api/get-started" target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">
                      Setup guide →
                    </a>
                  </p>
                </div>
                <div>
                  <label className="label">Webhook Verify Token</label>
                  <input className="input font-mono text-xs" defaultValue="optician_vf_abc123" />
                  <p className="text-xs text-muted mt-1">Must match the value set in Meta Developer Console → Webhooks.</p>
                </div>
              </div>
            </>
          )}

          {/* ── Voice AI (ElevenLabs) ── */}
          {tab === 'voice' && (
            <>
              <h3 className="font-display font-semibold text-ink">Voice AI — ElevenLabs</h3>
              <div className="space-y-4">
                <div className="p-4 bg-violet-50 border border-violet-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
                    <p className="text-sm font-semibold text-violet-800">Voice AI Active · Powered by ElevenLabs Conversational AI</p>
                  </div>
                  <p className="text-xs text-violet-700">
                    VisionFlow manages ElevenLabs centrally — no separate ElevenLabs account needed. Your practice uses our shared agent infrastructure with an isolated conversation context.
                  </p>
                </div>

                <div>
                  <label className="label">AI Voice</label>
                  <div className="space-y-2 mt-2">
                    {[
                      { name: 'Sophie', desc: 'British Female · Warm and professional', recommended: true },
                      { name: 'James',  desc: 'British Male · Clear and formal' },
                      { name: 'Emma',   desc: 'British Female · Friendly and approachable' },
                    ].map((v, i) => (
                      <label key={v.name} className={cn('flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all',
                        i === 0 ? 'border-brand-400 bg-brand-50' : 'border-border hover:border-brand-200')}>
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

                <div>
                  <label className="label">Voice Sample Scripts</label>
                  <div className="space-y-2 mt-2">
                    {[
                      { name: 'Sophie', script: `"Hi there! Thanks for calling ClearView Opticians. I'm Sophie, the AI assistant. I can help with NHS eye test bookings, contact lens queries, and general enquiries."` },
                      { name: 'James',  script: `"Good morning. You've reached ClearView Opticians. This is James, the automated assistant. I can assist with appointment bookings and NHS eligibility checks."` },
                      { name: 'Emma',   script: `"Hello! Welcome to ClearView Opticians. I'm Emma! Whether you'd like to book a sight test or ask about contact lenses, I'm happy to help."` },
                      ].map(v => (
                      <div key={v.name} className="flex items-start gap-3 p-3 bg-surface rounded-xl border border-border">
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-ink mb-1">{v.name}</p>
                          <p className="text-xs text-muted italic leading-relaxed">{v.script}</p>
                        </div>
                        <div className="flex flex-col items-center gap-1 shrink-0">
                          <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center cursor-pointer hover:bg-brand-100 transition-colors" title="Preview">
                            <span className="text-sm">▶</span>
                          </div>
                          <p className="text-[9px] text-muted">~30s</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted mt-2">Live audio previews are available once your ElevenLabs integration is active in the Infrastructure tab.</p>
                </div>

                <div>
                  <label className="label">Call Forwarding Number</label>
                  <input className="input" defaultValue="+44 7405 345948" />
                  <p className="text-xs text-muted mt-1.5">Forward your practice line to this number, or share it directly as your practice number. We provide a dedicated UK number.</p>
                </div>

                <div>
                  <label className="label">After-Hours Handling</label>
                  <select className="input">
                    <option>Continue booking via AI 24/7 (recommended)</option>
                    <option>Take message — call back next working day</option>
                    <option>Emergency escalation only when closed</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border">
                  <div>
                    <p className="text-sm font-semibold text-ink">Voice AI Active</p>
                    <p className="text-xs text-muted mt-0.5">Available on Growth and Practice plans</p>
                  </div>
                  <div className="w-11 h-6 bg-brand-600 rounded-full relative cursor-pointer">
                    <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm" />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── Notifications ── */}
          {tab === 'notifications' && (
            <>
              <h3 className="font-display font-semibold text-ink">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { label: 'Eye emergency escalation',    desc: 'Immediate email + SMS when patient reports sudden vision loss, floaters, or trauma', on: true },
                  { label: 'New escalation',              desc: 'Patient requested to speak with an optometrist or practice manager', on: true },
                  { label: 'New booking via AI',          desc: 'Email summary of each WhatsApp or Voice AI booking', on: false },
                  { label: 'DNA alert',                   desc: 'Patient missed their AI-booked appointment', on: true },
                  { label: 'Weekly analytics digest',     desc: 'Every Monday morning summary email', on: true },
                  { label: 'Knowledge base sync errors',  desc: 'Alert if Pinecone embedding sync fails', on: true },
                ].map(n => (
                  <div key={n.label} className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border">
                    <div>
                      <p className="text-sm font-semibold text-ink">{n.label}</p>
                      <p className="text-xs text-muted mt-0.5">{n.desc}</p>
                    </div>
                    <div className={cn('w-11 h-6 rounded-full relative cursor-pointer transition-all', n.on ? 'bg-brand-600' : 'bg-border')}>
                      <div className={cn('w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all', n.on ? 'left-[26px]' : 'left-0.5')} />
                    </div>
                  </div>
                ))}
                <div>
                  <label className="label">Escalation Email Recipients</label>
                  <textarea className="input resize-none" rows={2} defaultValue={"raj@clearviewopticians.co.uk\nreception@clearviewopticians.co.uk"} />
                  <p className="text-xs text-muted mt-1.5">One email per line. All recipients receive escalation alerts with patient name, phone, and conversation summary.</p>
                </div>
                <div>
                  <label className="label">Emergency SMS Number <span className="font-normal text-muted">(optional)</span></label>
                  <input className="input" placeholder="+44 7XXX XXXXXX — on-call optometrist mobile" />
                  <p className="text-xs text-muted mt-1.5">Eye emergencies only — gets an SMS within 5 seconds of AI detection.</p>
                </div>
              </div>
            </>
          )}

          {/* ── Infrastructure ── */}
          {tab === 'infrastructure' && (
            <>
              <h3 className="font-display font-semibold text-ink">Infrastructure & API Keys</h3>
              <p className="text-sm text-muted -mt-4">
                VisionFlow manages all AI infrastructure centrally. Your practice only needs to connect WhatsApp. The keys below are yours (as the VisionFlow operator) — practices never see or touch these.
              </p>

              {/* Managed infra status */}
              <div className="rounded-2xl border border-border overflow-hidden">
                <div className="px-4 py-3 bg-ink">
                  <p className="text-xs font-bold text-white">Platform Infrastructure Status</p>
                </div>
                <div className="divide-y divide-border">
                  {[
                    { name: 'OpenAI GPT-4o-mini',           desc: 'AI conversation engine', status: 'operational', detail: 'Your API key — shared across all practices' },
                    { name: 'OpenAI Whisper',                desc: 'Voice note transcription', status: 'operational', detail: 'Same key as GPT' },
                    { name: 'OpenAI text-embedding-ada-002', desc: 'Knowledge base embeddings', status: 'operational', detail: 'Used for Pinecone ingestion' },
                    { name: 'Pinecone',                      desc: 'Vector database — practice namespaces', status: 'operational', detail: 'Your index: visionflow-prod · dim: 1536' },
                    { name: 'ElevenLabs Conversational AI',  desc: 'Voice receptionist', status: 'operational', detail: 'Your ElevenLabs account — shared agent' },
                  ].map(item => (
                    <div key={item.name} className="px-4 py-3.5 flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-ink">{item.name}</p>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        </div>
                        <p className="text-xs text-muted mt-0.5">{item.desc} · <span className="text-ink/60">{item.detail}</span></p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Your API keys */}
              <div>
                <label className="label">OpenAI API Key <span className="font-normal text-muted normal-case">(your key)</span></label>
                <div className="relative">
                  <input type="password" className="input pr-16 font-mono text-xs" placeholder="sk-proj-..." />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-brand-600 font-semibold">Show</button>
                </div>
                <p className="text-xs text-muted mt-1.5">Used for GPT-4o-mini responses, Whisper transcription, and text-embedding-ada-002. All practices share this key — usage billed to you.</p>
              </div>

              <div>
                <label className="label">Pinecone API Key <span className="font-normal text-muted normal-case">(your key)</span></label>
                <div className="relative">
                  <input type="password" className="input pr-16 font-mono text-xs" placeholder="pcsk_..." />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-brand-600 font-semibold">Show</button>
                </div>
              </div>

              <div>
                <label className="label">Pinecone Index Name</label>
                <input className="input font-mono text-xs" defaultValue="visionflow-prod" />
                <p className="text-xs text-muted mt-1.5">Each practice gets an isolated namespace within this shared index. Format: <code className="bg-surface px-1 rounded">practice_{'{id}'}</code></p>
              </div>

              <div>
                <label className="label">ElevenLabs API Key <span className="font-normal text-muted normal-case">(your key)</span></label>
                <div className="relative">
                  <input type="password" className="input pr-16 font-mono text-xs" placeholder="sk_..." />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-brand-600 font-semibold">Show</button>
                </div>
                <p className="text-xs text-muted mt-1.5">Used for voice synthesis and Conversational AI. Practices select a voice style — you control the underlying agent.</p>
              </div>

              <div>
                <label className="label">ElevenLabs Agent ID</label>
                <input className="input font-mono text-xs" placeholder="agent_..." />
                <p className="text-xs text-muted mt-1.5">
                  Create a Conversational AI agent in your{' '}
                  <a href="https://elevenlabs.io/conversational-ai" target="_blank" rel="noreferrer" className="text-brand-600 hover:underline inline-flex items-center gap-1">
                    ElevenLabs dashboard <ExternalLink className="w-3 h-3" />
                  </a>
                  {' '}and paste the Agent ID here. Each practice call uses this shared agent with their practice context injected.
                </p>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm font-semibold text-amber-800 mb-1">Important — keep these keys private</p>
                <p className="text-xs text-amber-700">These are your platform API keys — never expose them to practices or clients. They are stored encrypted in Supabase using row-level security. Practices only ever see their WhatsApp credentials.</p>
              </div>
            </>
          )}

          {/* ── Security ── */}
          {tab === 'security' && (
            <>
              <h3 className="font-display font-semibold text-ink">Security & Compliance</h3>
              <div className="space-y-5">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-sm font-semibold text-amber-800 mb-1">UK Data Protection & GOC Compliance</p>
                  <p className="text-xs text-amber-700">
                    This platform processes patient contact information. Ensure your Privacy Notice covers WhatsApp and Voice AI communications per UK GDPR.
                    GOC-regulated practices must consider GOS contract obligations. All patient data is stored in UK/EU data centres only.
                    We sign a Data Processing Agreement (DPA) with every practice.
                  </p>
                </div>

                <div>
                  <label className="label">Current Password</label>
                  <input type="password" className="input" placeholder="••••••••" />
                </div>
                <div>
                  <label className="label">New Password</label>
                  <input type="password" className="input" placeholder="••••••••" />
                </div>

                <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border">
                  <div>
                    <p className="text-sm font-semibold text-ink">Two-Factor Authentication</p>
                    <p className="text-xs text-muted mt-0.5">Strongly recommended for Owner and Admin accounts</p>
                  </div>
                  <button className="btn-secondary text-xs py-2">Enable 2FA</button>
                </div>

                <div className="p-4 bg-surface rounded-xl border border-border space-y-2">
                  <p className="text-sm font-semibold text-ink">Data residency</p>
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> All data stored in EU/UK data centres
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> No data transferred to the United States
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> DPA provided to every practice
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Practice data isolated per Supabase tenant + Pinecone namespace
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
