import { useState } from 'react';
import { Eye, Copy, Check, Download, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const TEMPLATE_SECTIONS = [
  {
    id: 'practice',
    title: '1. Practice Overview',
    color: 'brand',
    fields: [
      { label: 'Practice Name', placeholder: 'e.g. ClearView Opticians' },
      { label: 'Address (full)', placeholder: 'e.g. 24 Market Street, Leeds, LS1 6DT' },
      { label: 'Phone Number', placeholder: 'e.g. 0113 456 7890' },
      { label: 'WhatsApp Number', placeholder: 'e.g. +44 7700 900000' },
      { label: 'Email', placeholder: 'e.g. info@clearviewopticians.co.uk' },
      { label: 'Website', placeholder: 'e.g. www.clearviewopticians.co.uk' },
      { label: 'GOC Practice Number', placeholder: 'e.g. GOC-01-12345' },
      { label: 'Practice Type', placeholder: 'e.g. Independent — NHS & Private' },
      { label: 'NHS England Region', placeholder: 'e.g. Yorkshire & Humber' },
      { label: 'Parking / Access Information', placeholder: 'e.g. Free parking on Market Street. Fully accessible — step-free entry, hearing loop available.' },
      { label: 'Nearest Bus / Train', placeholder: 'e.g. 2-minute walk from Leeds City Station. Bus routes 1, 5, 12 stop outside.' },
    ]
  },
  {
    id: 'hours',
    title: '2. Opening Hours',
    color: 'emerald',
    fields: [
      { label: 'Monday', placeholder: 'e.g. 09:00 – 17:30' },
      { label: 'Tuesday', placeholder: 'e.g. 09:00 – 17:30' },
      { label: 'Wednesday', placeholder: 'e.g. 09:00 – 17:30' },
      { label: 'Thursday', placeholder: 'e.g. 09:00 – 19:00 (late night)' },
      { label: 'Friday', placeholder: 'e.g. 09:00 – 17:30' },
      { label: 'Saturday', placeholder: 'e.g. 09:00 – 13:00' },
      { label: 'Sunday', placeholder: 'e.g. Closed' },
      { label: 'Bank Holidays', placeholder: 'e.g. Closed on all UK bank holidays' },
      { label: 'Out-of-hours emergency guidance', placeholder: 'e.g. For urgent eye concerns outside opening hours, please call NHS 111 or attend your nearest A&E.' },
    ]
  },
  {
    id: 'team',
    title: '3. Optometrists & Staff',
    color: 'violet',
    note: 'Add one entry per optometrist/dispensing optician. Copy the block for each team member.',
    fields: [
      { label: 'Optometrist 1 — Full Name', placeholder: 'e.g. Mr. Raj Patel' },
      { label: 'Optometrist 1 — Qualifications', placeholder: 'e.g. BSc (Hons) Optometry, MCOptom' },
      { label: 'Optometrist 1 — GOC Registration Number', placeholder: 'e.g. 01-12345' },
      { label: 'Optometrist 1 — Specialisms', placeholder: 'e.g. Myopia management, dry eye, complex contact lens fitting' },
      { label: 'Optometrist 1 — Available Days', placeholder: 'e.g. Monday, Tuesday, Thursday, Friday' },
      { label: 'Optometrist 2 — Full Name', placeholder: 'e.g. Ms. Sarah Williams' },
      { label: 'Optometrist 2 — Qualifications', placeholder: 'e.g. BSc (Hons) Optometry, FCOptom' },
      { label: 'Optometrist 2 — GOC Registration Number', placeholder: 'e.g. 01-67890' },
      { label: 'Optometrist 2 — Specialisms', placeholder: 'e.g. Paediatric optometry, low vision, orthokeratology' },
      { label: 'Optometrist 2 — Available Days', placeholder: 'e.g. Wednesday, Thursday, Saturday' },
      { label: 'Dispensing Optician (if applicable)', placeholder: 'e.g. Claire Hutchinson FBDO — spectacle dispensing, lens recommendations' },
    ]
  },
  {
    id: 'services',
    title: '4. Services & Pricing',
    color: 'amber',
    note: 'Include all services, both NHS and private. Be specific about what is included in each.',
    fields: [
      { label: 'NHS Sight Test — Price', placeholder: 'Free for eligible patients (NHS-funded)' },
      { label: 'NHS Sight Test — Duration', placeholder: 'e.g. 30 minutes' },
      { label: 'NHS Sight Test — What is included', placeholder: 'e.g. Full eye health check, refraction, eye pressure, visual fields, retinal assessment, spectacle prescription if needed' },
      { label: 'Private Sight Test — Price', placeholder: 'e.g. £65' },
      { label: 'Private Sight Test — Duration', placeholder: 'e.g. 45 minutes' },
      { label: 'Private Sight Test — What is included', placeholder: 'e.g. Everything in NHS test plus extended consultation time and advanced diagnostic imaging' },
      { label: 'OCT Scan — Price', placeholder: 'e.g. £35 (standalone) or £20 when combined with sight test' },
      { label: 'OCT Scan — What it is', placeholder: 'e.g. 3D scan of the retina to detect early signs of glaucoma, macular degeneration, and diabetic eye disease' },
      { label: 'Contact Lens Consultation — Price', placeholder: 'e.g. £85 (includes fitting and aftercare)' },
      { label: 'Contact Lens Aftercare — Price', placeholder: 'e.g. £40 per visit, or included in annual plan' },
      { label: 'Dry Eye Clinic — Price', placeholder: 'e.g. £75 initial assessment, £50 follow-up' },
      { label: 'Myopia Management — Price', placeholder: 'e.g. £150 initial assessment, then £120/month for MiSight lenses' },
      { label: "Children's Eye Test (NHS) — Age range", placeholder: 'e.g. Free for all children under 16, and students in full-time education under 19' },
      { label: 'Spectacle Collection / Adjustment — Price', placeholder: 'e.g. Free for spectacles purchased from us. Adjustment of spectacles bought elsewhere: £15.' },
      { label: 'Repair service', placeholder: 'e.g. Minor repairs free of charge. Lens replacement from £25 per lens.' },
      { label: 'Domiciliary visits (if offered)', placeholder: 'e.g. We offer home visits for patients unable to attend the practice. Please call to arrange. No additional charge for NHS eligible patients.' },
    ]
  },
  {
    id: 'nhs',
    title: '5. NHS Eligibility (important — review carefully)',
    color: 'rose',
    note: 'This section is pre-filled with standard England eligibility. Edit only if your practice is in Wales, Scotland, or Northern Ireland, or if you have local variations.',
    fields: [
      { label: 'Are you accepting new NHS patients?', placeholder: 'e.g. Yes, we are currently accepting new NHS patients.' },
      { label: 'Age eligibility — Children', placeholder: 'Pre-filled: All children under 16 qualify for a free NHS sight test.' },
      { label: 'Age eligibility — Students', placeholder: 'Pre-filled: Students in full-time education under 19 qualify for a free NHS sight test.' },
      { label: 'Age eligibility — Elderly', placeholder: 'Pre-filled: All patients aged 60 and over qualify for a free NHS sight test.' },
      { label: 'Medical eligibility — Diabetes', placeholder: 'Pre-filled: All patients with a confirmed diabetes diagnosis qualify for a free NHS sight test, regardless of age.' },
      { label: 'Medical eligibility — Glaucoma', placeholder: 'Pre-filled: Patients diagnosed with glaucoma, or those considered at risk of glaucoma by an ophthalmologist, qualify for a free NHS sight test.' },
      { label: 'Benefits eligibility', placeholder: 'Pre-filled: Patients receiving Income Support, Universal Credit, JSA, ESA, or Pension Credit qualify.' },
      { label: 'HC2/HC3 certificate holders', placeholder: 'Pre-filled: Patients holding a valid HC2 or HC3 certificate (NHS Low Income Scheme) qualify.' },
      { label: 'Sight-impaired patients', placeholder: 'Pre-filled: Patients registered as blind or partially sighted qualify.' },
      { label: 'NHS voucher information', placeholder: 'e.g. NHS optical vouchers are available to eligible patients to help with the cost of spectacles. We accept all NHS voucher values.' },
      { label: 'Region-specific notes', placeholder: 'e.g. Leave blank if in England. For Wales: [enter Welsh NHS rules]. For Scotland: [enter Scottish NHS rules].' },
    ]
  },
  {
    id: 'cl',
    title: '6. Contact Lenses',
    color: 'brand',
    fields: [
      { label: 'Contact lens brands stocked', placeholder: 'e.g. Acuvue (1-Day Moist, Oasys), CooperVision (MyDay, Biofinity), Alcon (Dailies, Air Optix), Bausch + Lomb (Ultra, SofLens)' },
      { label: 'Daily disposable lenses — price range', placeholder: 'e.g. From £25/month for standard dailies' },
      { label: 'Monthly disposable lenses — price range', placeholder: 'e.g. From £18/month for standard monthlies' },
      { label: 'Toric lenses (for astigmatism) — price range', placeholder: 'e.g. From £35/month' },
      { label: 'Multifocal lenses (for presbyopia) — price range', placeholder: 'e.g. From £45/month' },
      { label: 'Contact lens reorder process', placeholder: 'e.g. Patients can reorder by WhatsApp, phone, or in-person. We require a valid prescription (within 2 years). Lenses available same-day or posted next day.' },
      { label: 'Prescription requirement for reorders', placeholder: 'e.g. A valid contact lens prescription from within the last 2 years is required for all reorders. If your prescription has expired, you will need a contact lens aftercare appointment first.' },
      { label: 'Myopia management lenses (MiSight, etc.)', placeholder: 'e.g. We are a certified MiSight practice. MiSight 1-day lenses for children aged 8-15 showing myopia progression: £120/month including all aftercare appointments.' },
    ]
  },
  {
    id: 'frames',
    title: '7. Spectacle Frames & Lenses',
    color: 'violet',
    fields: [
      { label: 'Frame brands stocked', placeholder: 'e.g. Ray-Ban, Oakley, Tom Ford, Lindberg, Silhouette, Maui Jim, plus our own independent range' },
      { label: 'Frame price range', placeholder: 'e.g. From £49 for budget frames to £450+ for premium designer frames. Most popular range: £85–£180.' },
      { label: 'Single vision lenses — price range', placeholder: 'e.g. From £35 per pair for standard single vision' },
      { label: 'Varifocal lenses — price range', placeholder: 'e.g. From £95 per pair for standard varifocals, up to £320 for premium digital varifocals' },
      { label: 'Lens coatings available', placeholder: 'e.g. Anti-reflection, blue light filter, transitions (photochromic), scratch-resistant, UV400 protection' },
      { label: 'Spectacle turnaround time', placeholder: 'e.g. Standard spectacles ready within 5–7 working days. Express service (2 days) available for an additional £25.' },
      { label: 'Finance options', placeholder: 'e.g. 0% interest-free credit available on purchases over £200. Monthly instalments over 12 months. Subject to status.' },
    ]
  },
  {
    id: 'policies',
    title: '8. Policies',
    color: 'amber',
    fields: [
      { label: 'Cancellation policy', placeholder: 'e.g. We ask for at least 24 hours notice to cancel or reschedule an appointment. This allows us to offer the slot to another patient.' },
      { label: 'DNA (Did Not Attend) policy', placeholder: 'e.g. Patients who miss appointments without notice may be asked to prepay for future bookings.' },
      { label: 'Prescription release policy', placeholder: 'e.g. We will always provide a copy of your spectacle or contact lens prescription at no charge following a sight test.' },
      { label: 'Children — consent requirements', placeholder: 'e.g. Children under 16 must be accompanied by a parent or guardian, or have written consent for the appointment.' },
      { label: 'Waiting times', placeholder: 'e.g. We aim to see all patients within 5 minutes of their appointment time. If we are running late, we will let you know via WhatsApp.' },
      { label: 'Complaints procedure', placeholder: 'e.g. Please speak to the practice manager in the first instance. If you are not satisfied, you can contact the GOC at optical.org or the NHS complaints procedure.' },
      { label: 'Payment methods accepted', placeholder: 'e.g. Cash, all major debit and credit cards, Apple Pay, Google Pay, NHS vouchers. Interest-free finance available.' },
    ]
  },
  {
    id: 'faq',
    title: '9. Frequently Asked Questions',
    color: 'emerald',
    note: 'Add your most common patient questions here. The more you add, the better your AI will answer them.',
    fields: [
      { label: 'How do I know if I need glasses?', placeholder: 'e.g. Common signs include blurred vision at distance or close up, headaches, eye strain, squinting, or difficulty reading. A sight test will confirm whether you need correction.' },
      { label: 'How often should I have a sight test?', placeholder: 'e.g. We recommend every 2 years for most adults, and annually for children, those with diabetes or glaucoma, or anyone over 70.' },
      { label: 'Can I drive after having my eyes dilated?', placeholder: 'e.g. If your pupils are dilated during an examination, you should not drive for at least 4 hours afterwards. Please arrange a lift or use public transport.' },
      { label: 'Do I need a referral for a sight test?', placeholder: 'e.g. No referral is needed. Simply book an appointment with us directly.' },
      { label: 'What should I bring to my appointment?', placeholder: 'e.g. Your current spectacles or contact lenses, your NHS exemption card if applicable, and a list of any medications you take.' },
      { label: 'Can you see me as an emergency?', placeholder: 'e.g. We keep emergency slots available each day. Contact us by WhatsApp or phone as early as possible. For severe symptoms, please call NHS 111 or attend A&E.' },
      { label: 'Do you offer home visits?', placeholder: 'e.g. Yes, we offer domiciliary eye tests for patients who are unable to attend the practice due to disability or illness. Please call to arrange.' },
    ]
  },
];

const COLOR_MAP: Record<string, { bg: string; border: string; badge: string; badgeText: string; num: string; numText: string }> = {
  brand:   { bg: 'bg-brand-50/50',   border: 'border-brand-100',   badge: 'bg-brand-100',   badgeText: 'text-brand-700',   num: 'bg-brand-600',   numText: 'text-white' },
  emerald: { bg: 'bg-emerald-50/50', border: 'border-emerald-100', badge: 'bg-emerald-100', badgeText: 'text-emerald-700', num: 'bg-emerald-600', numText: 'text-white' },
  violet:  { bg: 'bg-violet-50/50',  border: 'border-violet-100',  badge: 'bg-violet-100',  badgeText: 'text-violet-700',  num: 'bg-violet-600',  numText: 'text-white' },
  amber:   { bg: 'bg-amber-50/50',   border: 'border-amber-100',   badge: 'bg-amber-100',   badgeText: 'text-amber-700',   num: 'bg-amber-600',   numText: 'text-white' },
  rose:    { bg: 'bg-rose-50/50',    border: 'border-rose-100',    badge: 'bg-rose-100',    badgeText: 'text-rose-700',    num: 'bg-rose-600',    numText: 'text-white' },
};

export default function KBTemplate() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['practice']));
  const [copied, setCopied] = useState(false);

  const toggle = (id: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleChange = (key: string, val: string) => {
    setValues(prev => ({ ...prev, [key]: val }));
  };

  const generateText = () => {
    let text = 'VISIONFLOW AI — PRACTICE KNOWLEDGE BASE\n';
    text += '='.repeat(50) + '\n\n';
    TEMPLATE_SECTIONS.forEach(section => {
      text += section.title.toUpperCase() + '\n' + '-'.repeat(40) + '\n';
      section.fields.forEach(field => {
        const key = `${section.id}__${field.label}`;
        const val = values[key] || field.placeholder;
        text += `${field.label}: ${val}\n`;
      });
      text += '\n';
    });
    return text;
  };

  const copyAll = () => {
    navigator.clipboard.writeText(generateText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const download = () => {
    const blob = new Blob([generateText()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'VisionFlow_Knowledge_Base_Template.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filledCount = Object.values(values).filter(v => v.trim().length > 0).length;
  const totalFields = TEMPLATE_SECTIONS.reduce((a, s) => a + s.fields.length, 0);

  return (
    <div className="min-h-screen bg-surface" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      {/* Header */}
      <div className="bg-ink border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-white text-base">VisionFlow</span>
              <span className="text-slate-400 text-sm ml-2">· Knowledge Base Template</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
              <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${(filledCount / totalFields) * 100}%` }} />
              </div>
              <span>{filledCount}/{totalFields} fields filled</span>
            </div>
            <button onClick={copyAll} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-all border border-slate-700">
              {copied ? <><Check className="w-3.5 h-3.5 text-brand-400" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy all</>}
            </button>
            <button onClick={download} className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold transition-all">
              <Download className="w-3.5 h-3.5" /> Download .txt
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Instructions */}
        <div className="bg-brand-600/10 border border-brand-600/30 rounded-2xl p-6 mb-8">
          <h1 className="font-display font-bold text-2xl text-ink mb-2">Practice Knowledge Base Template</h1>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            Fill in your practice details below. The more you add, the better your AI will answer patient questions.
            When done, <strong>download the .txt file</strong>, then upload it to the VisionFlow Google Drive folder and paste the file URL into your Knowledge Base setup.
          </p>

          {/* Google Drive folder link */}
          <a
            href="https://drive.google.com/drive/folders/1Wr0C3VLz6gRJS8pctYOUUyaEIq_NV1v8?usp=sharing"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 bg-white border-2 border-brand-200 rounded-xl p-4 mb-4 hover:border-brand-400 transition-all group"
          >
            <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center shrink-0">
              <span className="text-xl">📁</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink group-hover:text-brand-600 transition-colors">Open VisionFlow Knowledge Base Folder</p>
              <p className="text-xs text-muted">Google Drive · Upload your completed template here</p>
            </div>
            <svg className="w-4 h-4 text-muted group-hover:text-brand-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          <div className="grid grid-cols-3 gap-3">
            {[
              { n: '1', t: 'Fill in this form', d: 'Complete as many fields as possible' },
              { n: '2', t: 'Download the .txt file', d: 'Click Download at top or bottom' },
              { n: '3', t: 'Upload to Drive folder', d: 'Paste the file link into KB setup' },
            ].map(s => (
              <div key={s.n} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-border">
                <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0">{s.n}</div>
                <div>
                  <p className="text-xs font-semibold text-ink">{s.t}</p>
                  <p className="text-[11px] text-muted">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {TEMPLATE_SECTIONS.map(section => {
            const c = COLOR_MAP[section.color];
            const isOpen = openSections.has(section.id);
            const sectionFilled = section.fields.filter(f => values[`${section.id}__${f.label}`]?.trim()).length;

            return (
              <div key={section.id} className={`rounded-2xl border overflow-hidden ${c.bg} ${c.border}`}>
                <button
                  type="button"
                  onClick={() => toggle(section.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:brightness-95 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <h2 className="font-display font-bold text-ink text-base">{section.title}</h2>
                    {sectionFilled > 0 && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.badge} ${c.badgeText}`}>
                        {sectionFilled}/{section.fields.length} filled
                      </span>
                    )}
                  </div>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 space-y-4 border-t border-border/50">
                    {section.note && (
                      <div className={`mt-4 p-3 rounded-xl ${c.badge} text-xs ${c.badgeText} leading-relaxed`}>
                        <strong>Note:</strong> {section.note}
                      </div>
                    )}
                    {section.fields.map(field => {
                      const key = `${section.id}__${field.label}`;
                      const isLong = field.placeholder.length > 60;
                      return (
                        <div key={field.label} className="mt-4">
                          <label className="label">{field.label}</label>
                          {isLong ? (
                            <textarea
                              className="input resize-none"
                              rows={3}
                              placeholder={field.placeholder}
                              value={values[key] || ''}
                              onChange={e => handleChange(key, e.target.value)}
                            />
                          ) : (
                            <input
                              className="input"
                              placeholder={field.placeholder}
                              value={values[key] || ''}
                              onChange={e => handleChange(key, e.target.value)}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 bg-ink rounded-2xl p-6 flex items-center justify-between gap-4">
          <div>
            <p className="font-display font-bold text-white">Ready to upload to Google Drive?</p>
            <p className="text-sm text-slate-400 mt-1">
              Download the file, then upload it to the{' '}
              <a href="https://drive.google.com/drive/folders/1Wr0C3VLz6gRJS8pctYOUUyaEIq_NV1v8?usp=sharing"
                target="_blank" rel="noreferrer" className="text-brand-400 underline">
                VisionFlow KB folder
              </a>
              {' '}and paste the file's shareable link into your Knowledge Base setup.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button onClick={copyAll} className="flex items-center gap-2 px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-semibold transition-all">
              {copied ? <><Check className="w-4 h-4 text-brand-400" /> Copied</> : <><Copy className="w-4 h-4" /> Copy</>}
            </button>
            <button onClick={download} className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-semibold transition-all">
              <Download className="w-4 h-4" /> Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
