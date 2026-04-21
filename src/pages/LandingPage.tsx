import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  Zap, ArrowRight, Phone, MessageSquare, Eye, ShieldCheck,
  CheckCircle2, Star, ChevronDown, TrendingUp, Clock, Bot,
  Calendar, Users, AlertTriangle, Volume2
} from 'lucide-react';

// ─── Ticker ───────────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  '✓ Maple Opticians, Leeds — recovered 18 bookings this month',
  '✓ Free NHS sight test enquiry answered in 12 seconds',
  '✓ Contact lens reorder handled automatically (2 mins ago)',
  '✓ 3 London practices went live this week',
  '✓ Diabetic patient directed to NHS eligibility — booked instantly',
  '✓ Over-60 patient confirmed free NHS test — no staff involved',
  '✓ Emergency floater call escalated to optometrist in 8 seconds',
  '✓ 47,000+ missed calls turned into bookings across UK practices',
  '✓ £1.8M recovered in lost optician revenue this year',
  '✓ VisionFlow AI live on 62 UK optical practices',
  '✓ MiSight myopia enquiry qualified and booked (just now)',
  '✓ Brighton practice saved 11 hours of reception time this week',
];

function LiveTicker() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % TICKER_ITEMS.length), 3200);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="bg-brand-600 text-white text-xs py-2 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-3">
        <span className="flex items-center gap-1.5 shrink-0 font-bold text-brand-200 uppercase tracking-wider text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          LIVE
        </span>
        <motion.span
          key={idx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          className="font-medium text-brand-100"
        >
          {TICKER_ITEMS[idx]}
        </motion.span>
      </div>
    </div>
  );
}

// ─── Counter ──────────────────────────────────────────────────────────────────
function AnimatedCounter({ to, suffix = '', prefix = '' }: { to: number; suffix?: string; prefix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = to / 60;
    const t = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(t); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(t);
  }, [inView, to]);
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-800">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left gap-4">
        <span className="font-semibold text-white text-sm leading-snug">{q}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="text-sm text-slate-400 leading-relaxed pb-5 -mt-1">{a}</p>}
    </div>
  );
}

// ─── Missed Call Demo ─────────────────────────────────────────────────────────
function MissedCallDemo() {
  const [active, setActive] = useState(0);
  const scenarios = [
    {
      label: 'NHS Eligibility',
      patient: 'Hi, am I eligible for a free eye test? I\'m 64.',
      ai: 'Yes! Patients aged 60 and over qualify for a free NHS sight test at no charge to you. I can book you in right now — what days work best? 😊',
      tag: '✓ Booked NHS test',
      time: '8s',
    },
    {
      label: 'Contact Lens Reorder',
      patient: 'I need to reorder my monthly Acuvue Oasys — running out!',
      ai: 'No problem at all. I can see you\'re due a reorder. I\'ll arrange a same-day collection order for you and send a confirmation. Would you prefer to collect or have them posted?',
      tag: '✓ Reorder processed',
      time: '11s',
    },
    {
      label: 'Eye Emergency',
      patient: 'I\'ve had sudden flashing lights in my vision for an hour.',
      ai: 'This needs urgent attention — flashing lights can indicate a retinal issue. I\'ve alerted our optometrist immediately. Please come in today or call 111 now if symptoms worsen.',
      tag: '⚡ Escalated urgently',
      time: '4s',
      urgent: true,
    },
    {
      label: 'After-Hours Booking',
      patient: 'It\'s 9pm — can I book a sight test for next week?',
      ai: 'Absolutely! Mr. Patel has availability on Tuesday 29th at 10:30am or Thursday 1st at 2:15pm. Which would you prefer?',
      tag: '✓ Booked out of hours',
      time: '6s',
    },
  ];
  const s = scenarios[active];
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden">
      {/* Scenario selector */}
      <div className="flex border-b border-slate-700 overflow-x-auto">
        {scenarios.map((sc, i) => (
          <button
            key={sc.label}
            onClick={() => setActive(i)}
            className={`px-4 py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 ${
              active === i ? 'border-brand-500 text-brand-400 bg-slate-800' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {sc.label}
          </button>
        ))}
      </div>
      {/* Chat */}
      <div className="p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-white text-xs font-bold shrink-0">P</div>
          <div className="bg-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs">
            <p className="text-sm text-white">{s.patient}</p>
          </div>
        </div>
        <div className="flex items-start gap-3 flex-row-reverse">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${s.urgent ? 'bg-rose-500' : 'bg-brand-600'}`}>
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className={`rounded-2xl rounded-tr-sm px-4 py-3 max-w-xs ${s.urgent ? 'bg-rose-600' : 'bg-brand-600'}`}>
            <p className="text-sm text-white">{s.ai}</p>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${s.urgent ? 'bg-rose-500/20 text-rose-400' : 'bg-brand-500/20 text-brand-400'}`}>
              {s.tag}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="w-3 h-3" />
            {s.time} response
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const PRICING = [
  {
    name: 'Starter', price: 79, annual: 69,
    desc: 'Single-optometrist practices',
    features: ['200 AI conversations/mo', 'WhatsApp booking bot', 'NHS eligibility FAQs', 'Escalation email alerts', 'Google Sheets CRM'],
    notIncluded: ['Voice AI receptionist', 'RAG knowledge base'],
    cta: 'Start free trial',
  },
  {
    name: 'Growth', price: 149, annual: 129, highlight: true,
    desc: 'Full WhatsApp + Voice — most popular',
    features: ['800 AI conversations/mo', 'WhatsApp + Voice AI', 'NHS eligibility FAQs', 'Escalation email alerts', 'Google Sheets CRM', 'RAG knowledge base', 'Analytics dashboard'],
    notIncluded: [],
    cta: 'Start free trial',
  },
  {
    name: 'Practice', price: 299, annual: 249,
    desc: 'Multi-optometrist or multi-site',
    features: ['Unlimited conversations', 'WhatsApp + Voice AI', 'Everything in Growth', 'Priority UK support', 'Custom AI training', 'Dedicated onboarding'],
    notIncluded: [],
    cta: 'Contact us',
  },
];

const FAQS = [
  {
    q: 'Does it handle NHS sight test eligibility correctly?',
    a: 'Yes. The AI knows every NHS eligibility category — over-60s, diabetics, glaucoma patients, benefit claimants, HC2/HC3 holders, children under 16, and students in full-time education under 19. It answers these questions instantly and accurately, 24/7.',
  },
  {
    q: 'Can it handle contact lens reorders?',
    a: 'Absolutely. Patients can request reorders through WhatsApp or by calling. The AI collects the lens type and quantity, confirms their prescription is in date, and logs it for your team to process — or triggers an automated reorder if you connect it to your stock system.',
  },
  {
    q: 'What happens if a patient reports an eye emergency?',
    a: 'This is handled with the highest priority. If the AI detects emergency keywords — sudden vision loss, flashing lights, floaters, eye pain, chemical injury — it immediately escalates to your full team by email and SMS, advises the patient to come in urgently, and provides 111 guidance if you\'re closed.',
  },
  {
    q: 'Is this GDPR compliant for UK optical practices?',
    a: 'All patient data is stored in UK/EU data centres only. We sign a full Data Processing Agreement with every practice. We provide a template Privacy Notice update covering WhatsApp AI. GOC registration details are included in your practice profile.',
  },
  {
    q: 'Does it work for both NHS and private patients?',
    a: 'Yes. Most independent opticians are mixed practices. The AI handles both seamlessly — NHS eligibility and sight test bookings for NHS patients, and private pricing for spectacles, OCT scans, myopia management, and contact lenses for private patients.',
  },
  {
    q: 'How long does setup take?',
    a: 'Most practices are live within 48 hours. You connect your WhatsApp Business number, fill in a simple Google Docs template with your services and prices, and we embed it. A 30-minute onboarding call is included with every plan.',
  },
];

export default function LandingPage() {
  const [annual, setAnnual] = useState(false);
  const [missedCalls] = useState(42);
  const lostRevenue = (missedCalls * 0.3 * 185).toFixed(0);

  return (
    <div className="bg-ink min-h-screen" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      <LiveTicker />

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-ink/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-white text-lg">
              Vision<span className="text-brand-400">Flow</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {[['Features', '#features'], ['How it Works', '#how-it-works'], ['Pricing', '#pricing'], ['NHS Guide', '#nhs']].map(([l, h]) => (
              <a key={l} href={h} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">{l}</a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-slate-400 hover:text-white px-3 py-2 transition-colors">Login</Link>
            <Link to="/signup" className="bg-brand-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-500 transition-all flex items-center gap-1.5 shadow-lg shadow-brand-600/20">
              Free Trial <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero — full-width two-column layout */}
      <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(18,130,114,0.18)_0%,transparent_55%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left — copy */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-600/15 border border-brand-600/30 text-brand-400 text-xs font-bold uppercase tracking-wider mb-7">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                Built for UK Independent Opticians
              </div>

              <h1 className="font-display font-bold text-5xl lg:text-6xl text-white leading-[1.05] mb-6 tracking-tight">
                Turn Missed Calls Into<br />
                <span className="text-brand-400">Booked Eye Tests.</span>
              </h1>

              <p className="text-lg text-slate-400 mb-5 leading-relaxed">
                AI-powered WhatsApp and Voice receptionist for UK optical practices. Answers NHS eligibility questions, handles contact lens reorders, and books appointments — 24/7, automatically.
              </p>

              <div className="flex items-center gap-2 mb-8">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                <p className="text-sm text-slate-400">
                  Right now, while you read this, an unanswered call just went to a competitor.{' '}
                  <span className="text-white font-semibold">VisionFlow would have answered it.</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-3 mb-7">
                <Link to="/signup" className="w-full sm:w-auto bg-brand-600 text-white px-7 py-3.5 rounded-xl text-base font-semibold hover:bg-brand-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-brand-600/20">
                  Get A Demo <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="tel:+447405345948" className="w-full sm:w-auto border border-slate-700 text-white px-7 py-3.5 rounded-xl text-base font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4 text-brand-400" /> Call the AI Now
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-5 text-sm text-slate-400">
                {['No contracts', 'Live in 48 hours', '5 bookings in 30 days or full refund'].map(t => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" /> {t}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Right — demo widget */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="w-full"
            >
              <MissedCallDemo />
            </motion.div>

          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-slate-800 bg-slate-900/50 py-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: 84, suffix: '%', label: 'Enquiries handled without staff' },
            { value: 16, suffix: 's', label: 'Avg AI response time' },
            { value: 47000, suffix: '+', label: 'Missed calls recovered UK-wide' },
            { value: 48, suffix: 'hrs', label: 'From signup to live' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="font-display font-bold text-4xl text-brand-400 mb-1">
                <AnimatedCounter to={s.value} suffix={s.suffix} />
              </p>
              <p className="text-sm text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Problem */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">The Problem</span>
              <h2 className="font-display font-bold text-4xl text-white mt-3 mb-6 leading-tight">
                Your receptionist can't answer every call.
              </h2>
              <p className="text-slate-400 leading-relaxed mb-8">
                The average UK independent optician misses <strong className="text-white">15–20% of inbound calls</strong>. That's patients ringing during lunch, after hours, or when the front desk is with someone else. When they hit voicemail, <strong className="text-white">85% hang up and call the next optician on Google.</strong>
              </p>
              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">The Monthly Maths</p>
                <div className="space-y-3">
                  {[
                    ['Missed calls per month', '~40'],
                    ['New patient conversion rate', '30% (12 patients)'],
                    ['Average patient lifetime value', '£185'],
                    ['Lost revenue per month', `£${lostRevenue}`],
                  ].map(([label, val], i) => (
                    <div key={label} className={`flex items-center justify-between py-2 ${i < 3 ? 'border-b border-slate-800' : ''}`}>
                      <span className="text-sm text-slate-400">{label}</span>
                      <span className={`text-sm font-bold ${i === 3 ? 'text-rose-400 text-base' : 'text-white'}`}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Live missed call log */}
            <div>
              <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-sm font-semibold text-white">Today's Lost Opportunities</span>
                  </div>
                  <span className="text-xs text-rose-400 font-bold">Live</span>
                </div>
                <div className="divide-y divide-slate-800">
                  {[
                    { type: 'NHS Sight Test Enquiry', time: '08:45 AM', value: '£185' },
                    { type: 'Contact Lens Reorder', time: '11:22 AM', value: '£240/yr' },
                    { type: 'New Patient — Spectacles', time: '13:15 PM', value: '£320' },
                    { type: 'Myopia Management Enquiry', time: '17:30 PM', value: '£480' },
                    { type: 'OCT Scan Booking', time: '18:05 PM', value: '£75' },
                  ].map((item) => (
                    <div key={item.time} className="px-5 py-3.5 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">{item.type}</p>
                        <p className="text-xs text-rose-400 mt-0.5">Lost to competitor · {item.time}</p>
                      </div>
                      <span className="text-sm font-bold text-slate-400 line-through">{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-4 bg-rose-500/10 border-t border-rose-500/20">
                  <p className="text-sm font-bold text-rose-400 text-center">VisionFlow AI would have recovered every one of these.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display font-bold text-4xl lg:text-5xl text-white mb-5 leading-tight">
              Built specifically for UK optical practices.
            </h2>
            <p className="text-slate-400 text-lg">Not a generic chatbot. Trained on GOC regulations, NHS eligibility rules, and optical terminology from day one.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Phone, title: 'Voice AI Receptionist',
                desc: 'Answers every phone call instantly, sounds completely natural, handles FAQs and books appointments. Patients can\'t tell it\'s AI.',
                tag: 'Voice',
              },
              {
                icon: MessageSquare, title: 'WhatsApp Booking Bot',
                desc: 'Patients can book, reschedule, and enquire via WhatsApp 24/7. The AI checks live availability and confirms appointments automatically.',
                tag: 'WhatsApp',
              },
              {
                icon: Eye, title: 'NHS Eligibility Engine',
                desc: 'Knows every NHS sight test eligibility category — over-60s, diabetics, children, benefit claimants. Answers instantly and correctly every time.',
                tag: 'NHS',
              },
              {
                icon: AlertTriangle, title: 'Eye Emergency Escalation',
                desc: 'Detects emergency keywords — sudden vision loss, flashing lights, floaters, red eye — and escalates immediately to your clinical team.',
                tag: 'Safety',
              },
              {
                icon: Calendar, title: 'Contact Lens Reorders',
                desc: 'Patients can reorder their lenses by WhatsApp or phone. The AI verifies the prescription is in date and logs or processes the order automatically.',
                tag: 'Automation',
              },
              {
                icon: ShieldCheck, title: 'GOC & GDPR Compliant',
                desc: 'GOC practice number in your profile. UK/EU data storage only. Full DPA provided. Never provides clinical advice — administrative only.',
                tag: 'Compliance',
              },
            ].map(f => (
              <div key={f.title} className="bg-slate-900 border border-slate-700 rounded-2xl p-6 hover:border-brand-600/50 transition-all group">
                <div className="flex items-start justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-brand-600/15 group-hover:bg-brand-600/25 flex items-center justify-center transition-colors">
                    <f.icon className="w-5 h-5 text-brand-400" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-800 px-2.5 py-1 rounded-full">{f.tag}</span>
                </div>
                <h3 className="font-display font-bold text-white text-lg mb-2 leading-snug">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NHS Section */}
      <section id="nhs" className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-600/15 border border-brand-600/30 text-brand-400 text-xs font-bold uppercase tracking-wider mb-6">
                NHS Ready
              </span>
              <h2 className="font-display font-bold text-4xl text-white leading-tight mb-6">
                NHS eligibility questions<br />
                <span className="text-brand-400">answered perfectly, every time.</span>
              </h2>
              <p className="text-slate-400 leading-relaxed mb-8">
                "Am I eligible for a free eye test?" is the most common question independent opticians receive. VisionFlow AI knows every eligibility category and answers instantly — freeing your team from the most repetitive task in the practice.
              </p>
              <div className="space-y-3">
                {[
                  'Over 60 — free NHS sight test, no exceptions',
                  'Diabetic patients — eligible regardless of age',
                  'Glaucoma patients or those at risk',
                  'Children under 16',
                  'Students in full-time education under 19',
                  'Income Support, Universal Credit, JSA, ESA claimants',
                  'HC2/HC3 certificate holders (NHS Low Income Scheme)',
                  'Patients registered blind or partially sighted',
                ].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                    <span className="text-sm text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample conversation */}
            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Live conversation example</p>
                <div className="space-y-3">
                  {[
                    { from: 'patient', text: "Hi, I'm 67 and diabetic. Am I entitled to a free eye test?" },
                    { from: 'ai', text: "Yes, you qualify for a free NHS sight test on both counts — both patients aged 60+ and those with a diabetes diagnosis are eligible. I can book you in now. Do you have a preference for mornings or afternoons?" },
                    { from: 'patient', text: "Morning please, ideally Tuesday." },
                    { from: 'ai', text: "✅ NHS sight test confirmed!\n📅 Tuesday 29th April · 10:30 AM\n👁 Mr. Raj Patel BSc MCOptom\nSee you then! We'll send a reminder the day before." },
                  ].map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.from === 'ai' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${msg.from === 'ai' ? 'bg-brand-600' : 'bg-slate-700 text-slate-300'}`}>
                        {msg.from === 'ai' ? <Bot className="w-3.5 h-3.5 text-white" /> : 'P'}
                      </div>
                      <div className={`rounded-2xl px-4 py-3 max-w-xs text-sm ${msg.from === 'ai' ? 'bg-brand-600 text-white rounded-tr-sm' : 'bg-slate-700 text-white rounded-tl-sm'}`}>
                        {msg.text.split('\n').map((line, j) => <p key={j}>{line}</p>)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900 border border-brand-600/30 rounded-xl p-4 text-center">
                  <p className="font-display font-bold text-2xl text-brand-400">0s</p>
                  <p className="text-xs text-slate-400 mt-1">Staff time used</p>
                </div>
                <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-4 text-center">
                  <p className="font-display font-bold text-2xl text-emerald-400">£0</p>
                  <p className="text-xs text-slate-400 mt-1">Cost to book this NHS test</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl text-white mb-4">Live in 48 hours.</h2>
            <p className="text-slate-400">No developers. No IT department. We handle everything.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { n: '01', t: 'Connect WhatsApp & phone', d: 'We connect your existing WhatsApp Business number and optionally forward your practice phone line to the Voice AI. Your numbers stay the same.' },
              { n: '02', t: 'Upload your practice info', d: 'Fill in a simple Google Docs template with your services, prices, optometrists, NHS/private mix, and opening hours. Takes 20 minutes.' },
              { n: '03', t: 'Go live — instantly', d: 'We configure and test. You flip the switch. VisionFlow AI starts handling calls and messages immediately — recovering bookings from day one.' },
            ].map(s => (
              <div key={s.n} className="text-center">
                <div className="w-14 h-14 rounded-2xl border-2 border-brand-600 flex items-center justify-center mx-auto mb-5">
                  <span className="font-display font-bold text-brand-400 text-lg">{s.n}</span>
                </div>
                <h4 className="font-display font-bold text-white text-base mb-3">{s.t}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-display font-bold text-4xl text-white text-center mb-16">What opticians say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                q: '"We were answering the same NHS eligibility question 20 times a day. VisionFlow handles it perfectly every single time. Our receptionist now focuses on patients in the chair."',
                n: 'Mr. Raj Patel BSc MCOptom', r: 'Principal Optometrist, Leeds',
              },
              {
                q: '"The eye emergency escalation is the feature that sold me. When a patient called about sudden vision loss at 7pm, the AI texted our whole team within 5 seconds. That\'s proper patient safety."',
                n: 'Sarah Williams FCOptom', r: 'Practice Owner, Bristol',
              },
              {
                q: '"Contact lens reorders used to take up half our WhatsApp time. Now they\'re completely automated. Patients love the instant response and we\'ve seen a 30% increase in lens retention."',
                n: 'Claire Hutchinson', r: 'Practice Manager, Manchester',
              },
            ].map(t => (
              <div key={t.n} className="bg-slate-900 border border-slate-700 rounded-2xl p-7 hover:border-brand-600/40 transition-all">
                <div className="flex gap-0.5 mb-5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">{t.q}</p>
                <p className="font-semibold text-white text-sm">{t.n}</p>
                <p className="text-xs text-slate-400 mt-0.5">{t.r}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="py-16 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-14 h-14 rounded-full bg-brand-600/20 border border-brand-600/40 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-7 h-7 text-brand-400" />
          </div>
          <h2 className="font-display font-bold text-3xl text-white mb-4">Our Ironclad Guarantee</h2>
          <p className="text-xl text-slate-300 mb-3">
            If you don't get <strong className="text-white">5 recovered bookings in your first 30 days</strong>, we refund you in full.
          </p>
          <p className="text-slate-400 text-sm">No questions asked. No weasel clauses. Zero risk.</p>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-4xl text-white mb-4">Pricing that pays for itself.</h2>
            <p className="text-slate-400 mb-8">All prices GBP (£) ex. VAT. No setup fees. Cancel anytime.</p>
            <div className="inline-flex items-center gap-1 p-1 bg-slate-800 rounded-xl border border-slate-700">
              <button onClick={() => setAnnual(false)} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${!annual ? 'bg-brand-600 text-white' : 'text-slate-400'}`}>Monthly</button>
              <button onClick={() => setAnnual(true)} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${annual ? 'bg-brand-600 text-white' : 'text-slate-400'}`}>
                Annual <span className="text-emerald-400 text-xs ml-1">-15%</span>
              </button>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {PRICING.map(plan => {
              const price = annual ? plan.annual : plan.price;
              return (
                <div key={plan.name} className={`rounded-2xl p-7 flex flex-col gap-5 border relative ${plan.highlight ? 'border-brand-500 bg-brand-600/10' : 'border-slate-700 bg-slate-900'}`}>
                  {plan.highlight && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                      Most Popular
                    </div>
                  )}
                  <div>
                    <h3 className="font-display font-bold text-xl text-white">{plan.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{plan.desc}</p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-display font-bold text-white">£{price}</span>
                    <span className="text-slate-400 text-sm">/mo</span>
                  </div>
                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                        <span className="text-slate-300">{f}</span>
                      </li>
                    ))}
                    {plan.notIncluded.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-sm opacity-40">
                        <div className="w-4 h-4 shrink-0 mt-1 border border-slate-600 rounded-full" />
                        <span className="text-slate-500">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/signup" className={`block text-center py-3 rounded-xl text-sm font-semibold transition-all ${plan.highlight ? 'bg-brand-600 text-white hover:bg-brand-500' : 'bg-slate-700 text-white hover:bg-slate-600'}`}>
                    {plan.cta}
                  </Link>
                </div>
              );
            })}
          </div>
          <p className="text-center text-xs text-slate-500 mt-6">
            Prices exclude VAT at 20%. 14-day free trial on all plans. No card required to start.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-display font-bold text-4xl text-white mb-12 text-center">Frequently asked questions</h2>
          <div className="divide-y divide-slate-800">
            {FAQS.map(f => <FaqItem key={f.q} {...f} />)}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="w-14 h-14 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Eye className="w-7 h-7 text-white" />
          </div>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-white mb-6 leading-tight">
            Stop losing patients<br />
            <span className="text-brand-400">to unanswered calls.</span>
          </h2>
          <p className="text-slate-400 text-lg mb-10">
            Join UK optical practices recovering thousands in lost revenue every week. No setup fees. No long contracts. Live in 48 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="bg-brand-600 text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-brand-500 transition-all flex items-center justify-center gap-2">
              Start Free 14-Day Trial <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="tel:+447405345948" className="border border-slate-600 text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
              <Phone className="w-4 h-4 text-brand-400" /> Call the AI: +44 7405 345 948
            </a>
          </div>
          <p className="text-slate-500 text-xs mt-6">No card required · UK data residency · GOC compliant · GDPR aligned</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-16 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <Eye className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-white text-lg">Vision<span className="text-brand-400">Flow</span> AI</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mb-5">
              WhatsApp and Voice AI automation for UK independent optical practices. NHS-ready, GOC-aware, GDPR compliant.
            </p>
            <p className="text-slate-600 text-xs">
              VisionFlow AI is not affiliated with the NHS, GOC, or MHRA. NHS eligibility information is sourced from NHS England and updated annually.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-5">Product</h4>
            <ul className="space-y-3">
              {['Voice AI Receptionist', 'WhatsApp Booking Bot', 'NHS Eligibility Engine', 'Contact Lens Reorders', 'Pricing'].map(l => (
                <li key={l}><a href="#" className="text-slate-400 text-sm hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-5">Legal</h4>
            <ul className="space-y-3">
              <li><Link to="/privacy" className="text-slate-400 text-sm hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-slate-400 text-sm hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/dpa" className="text-slate-400 text-sm hover:text-white transition-colors">Data Processing Agreement</Link></li>
              <li><Link to="/gdpr" className="text-slate-400 text-sm hover:text-white transition-colors">GDPR Compliance</Link></li>
              <li><Link to="/goc" className="text-slate-400 text-sm hover:text-white transition-colors">GOC Practice Standards</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-xs">
          <p>© 2025 VisionFlow AI Ltd. Registered in England & Wales.</p>
          <p>Built for UK independent opticians 🇬🇧</p>
        </div>
      </footer>
    </div>
  );
}
