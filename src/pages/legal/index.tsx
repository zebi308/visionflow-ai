import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, ArrowLeft, ChevronDown } from 'lucide-react';

// ─── Shared Shell ─────────────────────────────────────────────────────────────
function LegalShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      <nav className="border-b border-slate-800 px-4 h-16 flex items-center justify-between max-w-5xl mx-auto">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <Eye className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-white text-lg">
            Vision<span className="text-brand-400">Flow</span>
          </span>
        </Link>
        <Link to="/" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
      </nav>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-12">
          <p className="text-brand-400 text-xs font-bold uppercase tracking-wider mb-3">Legal</p>
          <h1 className="font-display font-bold text-4xl text-white mb-3">{title}</h1>
          <p className="text-slate-400">{subtitle}</p>
        </div>
        <div className="prose-legal">{children}</div>
      </div>
      <footer className="border-t border-slate-800 py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-xs">
          <p>© 2025 VisionFlow AI Ltd. Registered in England & Wales.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/dpa" className="hover:text-white transition-colors">DPA</Link>
            <Link to="/gdpr" className="hover:text-white transition-colors">GDPR</Link>
            <Link to="/goc" className="hover:text-white transition-colors">GOC Standards</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="font-display font-bold text-xl text-white mb-4 pb-3 border-b border-slate-800">{title}</h2>
      <div className="space-y-3 text-slate-300 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p>{children}</p>;
}

function UL({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 ml-4">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="text-brand-400 mt-1 shrink-0">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Meta({ date, version }: { date: string; version: string }) {
  return (
    <div className="flex gap-6 mb-8 text-xs text-slate-500">
      <span>Last updated: <span className="text-slate-300">{date}</span></span>
      <span>Version: <span className="text-slate-300">{version}</span></span>
    </div>
  );
}

// ─── Privacy Policy ───────────────────────────────────────────────────────────
export function PrivacyPolicy() {
  return (
    <LegalShell
      title="Privacy Policy"
      subtitle="How VisionFlow AI Ltd collects, uses, and protects your data"
    >
      <Meta date="1 April 2025" version="1.2" />

      <Section title="1. Who We Are">
        <P>VisionFlow AI Ltd ("VisionFlow", "we", "us", or "our") is a company registered in England and Wales. We operate the VisionFlow AI platform, which provides AI-powered WhatsApp and voice receptionist services to independent optical practices in the United Kingdom.</P>
        <P>We are a data controller under the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018 for data we process about practice owners, staff, and administrators. In relation to patient data processed on behalf of practices, we act as a data processor.</P>
        <P>Contact: privacy@visionflow.ai · VisionFlow AI Ltd, Leeds, England</P>
      </Section>

      <Section title="2. Data We Collect">
        <P><strong className="text-white">Practice and account data:</strong></P>
        <UL items={[
          'Practice name, address, postcode, GOC practice number, NHS region',
          'Owner and staff names, email addresses, phone numbers',
          'WhatsApp Business API credentials (Phone Number ID, access tokens)',
          'Billing information (processed by Stripe — we do not store card details)',
          'Account login credentials (passwords are hashed, never stored in plain text)',
        ]} />
        <P><strong className="text-white">Patient interaction data (processed on behalf of practices):</strong></P>
        <UL items={[
          'Patient phone numbers (WhatsApp sender IDs)',
          'Patient display names (as set in WhatsApp)',
          'Conversation content — messages sent and received',
          'Appointment booking data — service, date, time',
          'Lead categorisation data — enquiry type, AI confidence score',
          'Voice call transcriptions (where Voice AI is enabled)',
        ]} />
        <P><strong className="text-white">Technical data:</strong></P>
        <UL items={[
          'IP addresses and browser/device information (for security and fraud prevention)',
          'Usage logs — pages visited, features used, timestamps',
          'Error logs and system performance data',
        ]} />
      </Section>

      <Section title="3. How We Use Your Data">
        <P>We use practice and account data to:</P>
        <UL items={[
          'Provide and operate the VisionFlow AI platform',
          'Process billing and subscription management via Stripe',
          'Send service notifications, onboarding guidance, and support communications',
          'Maintain the security and integrity of the platform',
          'Comply with our legal obligations',
        ]} />
        <P>We process patient interaction data solely on the instructions of the practices that use our platform. We do not use patient data for any purpose other than delivering the services agreed in our Data Processing Agreement.</P>
      </Section>

      <Section title="4. Legal Basis for Processing">
        <UL items={[
          'Contract performance — processing account data to deliver the services you have subscribed to',
          'Legitimate interests — security monitoring, fraud prevention, service improvement',
          'Legal obligation — compliance with UK law, HMRC requirements, court orders',
          'Consent — marketing communications (you may withdraw consent at any time)',
        ]} />
        <P>For patient data processed as a data processor, the legal basis is determined by the practice (data controller). Practices are responsible for ensuring they have a lawful basis for processing patient data via WhatsApp and voice communications.</P>
      </Section>

      <Section title="5. Data Storage and Transfers">
        <P>All data is stored in data centres located in the United Kingdom or European Economic Area (EEA) only. We do not transfer personal data to the United States or any country outside the UK/EEA.</P>
        <P>Our sub-processors are listed in Annex A of our Data Processing Agreement. Key sub-processors include:</P>
        <UL items={[
          'Supabase Inc (EU region) — database and authentication',
          'Pinecone Inc (EU region) — knowledge base vector storage',
          'OpenAI Inc (EU region via Azure OpenAI) — AI inference',
          'ElevenLabs Inc (EU region) — voice synthesis',
          'Stripe Inc (UK/EU) — payment processing',
        ]} />
      </Section>

      <Section title="6. Data Retention">
        <UL items={[
          'Account data: retained for the duration of the subscription plus 7 years (legal/tax requirements)',
          'Patient conversation data: retained for 24 months from last interaction, unless practice requests earlier deletion',
          'Billing records: 7 years (HMRC requirement)',
          'Security logs: 90 days',
          'Backups: encrypted backups retained for 30 days then permanently deleted',
        ]} />
      </Section>

      <Section title="7. Your Rights">
        <P>Under UK GDPR, you have the right to:</P>
        <UL items={[
          'Access — request a copy of personal data we hold about you',
          'Rectification — correct inaccurate personal data',
          'Erasure — request deletion of your personal data ("right to be forgotten")',
          'Restriction — restrict how we process your data',
          'Portability — receive your data in a structured, machine-readable format',
          'Object — object to processing based on legitimate interests',
          'Withdraw consent — for any processing based on consent at any time',
        ]} />
        <P>To exercise any of these rights, contact privacy@visionflow.ai. We will respond within 30 days. You also have the right to lodge a complaint with the Information Commissioner's Office (ICO) at ico.org.uk.</P>
      </Section>

      <Section title="8. Cookies">
        <P>Our platform uses essential cookies only (session management and security). We do not use third-party tracking cookies or advertising cookies. You can disable cookies in your browser, though this may affect platform functionality.</P>
      </Section>

      <Section title="9. Changes to This Policy">
        <P>We will notify you of material changes to this policy by email at least 30 days before they take effect. Continued use of the platform after that date constitutes acceptance of the updated policy.</P>
      </Section>
    </LegalShell>
  );
}

// ─── Terms of Service ─────────────────────────────────────────────────────────
export function TermsOfService() {
  return (
    <LegalShell
      title="Terms of Service"
      subtitle="The agreement between you and VisionFlow AI Ltd"
    >
      <Meta date="1 April 2025" version="1.1" />

      <Section title="1. Acceptance of Terms">
        <P>By signing up for or using the VisionFlow AI platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you are using the Service on behalf of an organisation, you represent that you have authority to bind that organisation to these Terms.</P>
        <P>These Terms are governed by the laws of England and Wales. Any disputes will be subject to the exclusive jurisdiction of the courts of England and Wales.</P>
      </Section>

      <Section title="2. The Service">
        <P>VisionFlow AI provides an AI-powered WhatsApp and voice receptionist platform designed for UK independent optical practices. The Service includes:</P>
        <UL items={[
          'AI-powered WhatsApp conversation handling and appointment booking',
          'Voice AI receptionist via ElevenLabs Conversational AI integration',
          'NHS sight test eligibility information engine (informational only)',
          'Knowledge base management and Pinecone vector storage',
          'Practice management dashboard',
          'Escalation alert system',
        ]} />
      </Section>

      <Section title="3. Important Limitations — Clinical Use">
        <P><strong className="text-white">The VisionFlow AI platform is an administrative and communication tool only. It is not a medical device, does not provide clinical advice, and must not be used as a substitute for professional clinical judgement.</strong></P>
        <P>The Service will not and must not:</P>
        <UL items={[
          'Diagnose eye conditions or interpret clinical findings',
          'Provide clinical recommendations or treatment advice',
          'Assess the urgency of clinical presentations beyond basic keyword escalation',
          'Act as a triage tool for clinical decision-making',
          'Provide information about prescriptions, medications, or clinical procedures beyond general informational content',
        ]} />
        <P>You are solely responsible for ensuring that clinical decisions are made by appropriately qualified GOC-registered professionals. The AI emergency escalation feature is a safety net only and should not be relied upon as the primary clinical safety mechanism.</P>
      </Section>

      <Section title="4. Eligibility and Registration">
        <UL items={[
          'You must be at least 18 years old to use the Service',
          'You must be authorised to act on behalf of the optical practice registering for the Service',
          'You must provide accurate and complete information during registration',
          'You are responsible for maintaining the confidentiality of your login credentials',
          'You must notify us immediately of any unauthorised use of your account',
        ]} />
      </Section>

      <Section title="5. Subscription and Payment">
        <P>The Service is provided on a subscription basis. Current pricing is available at visionflow.ai/pricing. All prices are in GBP and exclude VAT at the prevailing rate.</P>
        <UL items={[
          'Subscriptions are billed monthly or annually in advance',
          'Payment is processed by Stripe. By providing payment details, you authorise recurring charges',
          'Failed payments will result in service suspension after 7 days notice',
          'Annual subscriptions may be cancelled within 14 days of renewal for a pro-rata refund',
          'Monthly subscriptions cancel at the end of the current billing period — no pro-rata refunds',
        ]} />
        <P><strong className="text-white">5-Booking Guarantee:</strong> If you do not receive at least 5 recovered bookings in your first 30 days on a paid plan, you may request a full refund within 35 days of your subscription start date. This guarantee applies once per practice and requires that the WhatsApp integration is properly configured and active.</P>
      </Section>

      <Section title="6. Acceptable Use">
        <P>You agree not to use the Service to:</P>
        <UL items={[
          'Provide clinical advice or act as a medical device',
          'Send unsolicited marketing messages (spam) to patients',
          'Violate any applicable law, including UK GDPR and the Data Protection Act 2018',
          'Infringe the intellectual property rights of any third party',
          'Reverse engineer, decompile, or attempt to extract source code from the platform',
          'Share your account credentials with unauthorised parties',
          'Use the Service in a way that could harm the reputation of the optical profession or the GOC',
        ]} />
      </Section>

      <Section title="7. Data and Privacy">
        <P>Your use of the Service is also governed by our Privacy Policy and, where applicable, our Data Processing Agreement. By using the Service, you confirm that you have a lawful basis under UK GDPR for processing patient personal data through the platform.</P>
        <P>You are responsible for updating your practice's Privacy Notice to inform patients that WhatsApp and voice AI communications may be used in your practice.</P>
      </Section>

      <Section title="8. Intellectual Property">
        <P>All intellectual property rights in the VisionFlow AI platform, including software, algorithms, AI models, and documentation, are owned by VisionFlow AI Ltd or our licensors. Nothing in these Terms grants you any ownership rights in the platform.</P>
        <P>You retain ownership of all content you upload to the platform (practice information, knowledge base documents). You grant us a limited licence to use this content solely to provide the Service.</P>
      </Section>

      <Section title="9. Limitation of Liability">
        <P>To the maximum extent permitted by law, VisionFlow AI Ltd shall not be liable for:</P>
        <UL items={[
          'Any clinical outcomes arising from patient interactions with the AI',
          'Indirect, consequential, incidental, or special damages',
          'Loss of profits, revenue, or business opportunity',
          'Loss of data beyond our data recovery obligations',
          'Actions or omissions of Meta (WhatsApp), ElevenLabs, OpenAI, or other third-party services',
        ]} />
        <P>Our total aggregate liability to you for any claim arising under these Terms shall not exceed the total fees paid by you in the 12 months preceding the claim.</P>
      </Section>

      <Section title="10. Termination">
        <P>You may cancel your subscription at any time through the billing section of your dashboard. We may suspend or terminate your account if you breach these Terms, with 30 days' notice for non-material breaches and immediately for serious breaches.</P>
        <P>Upon termination, your data will be retained for 30 days during which you may request an export. After 30 days, your data will be permanently deleted.</P>
      </Section>
    </LegalShell>
  );
}

// ─── Data Processing Agreement ────────────────────────────────────────────────
export function DPA() {
  return (
    <LegalShell
      title="Data Processing Agreement"
      subtitle="How VisionFlow processes patient data on behalf of optical practices"
    >
      <Meta date="1 April 2025" version="1.0" />

      <div className="bg-brand-600/10 border border-brand-600/30 rounded-xl p-5 mb-10">
        <p className="text-sm text-brand-300 leading-relaxed">
          This Data Processing Agreement ("DPA") forms part of the contract between the optical practice ("Controller") and VisionFlow AI Ltd ("Processor"). It governs the processing of personal data by VisionFlow on behalf of the practice, as required by Article 28 of the UK GDPR.
        </p>
      </div>

      <Section title="1. Definitions">
        <UL items={[
          '"Controller" means the optical practice that has subscribed to the VisionFlow AI Service',
          '"Processor" means VisionFlow AI Ltd',
          '"Personal Data" means any information relating to an identified or identifiable natural person, as defined in UK GDPR Article 4',
          '"Patient Data" means personal data relating to patients of the Controller\'s optical practice',
          '"Processing" has the meaning given in UK GDPR Article 4(2)',
          '"Sub-processor" means any third party engaged by VisionFlow to assist in the processing of Personal Data',
        ]} />
      </Section>

      <Section title="2. Subject Matter and Duration">
        <P>VisionFlow processes Patient Data on behalf of the Controller for the purpose of providing AI-powered communication services, including:</P>
        <UL items={[
          'Receiving and processing inbound WhatsApp messages from patients',
          'Generating and sending AI responses to patients via WhatsApp',
          'Receiving and transcribing inbound voice calls (where Voice AI is enabled)',
          'Storing conversation history and booking data in the practice\'s isolated database',
          'Categorising patient enquiries for CRM and analytics purposes',
        ]} />
        <P>Processing commences on the date the Controller activates their VisionFlow account and continues until the subscription is terminated.</P>
      </Section>

      <Section title="3. Nature of Personal Data Processed">
        <P>Categories of personal data: Contact data (phone numbers, display names), communication content (message text, call transcriptions), and inferred data (enquiry category, AI sentiment scores).</P>
        <P>Categories of data subjects: Patients and prospective patients of the Controller's optical practice.</P>
        <P>Special category data: The Service may incidentally process health information where patients voluntarily share it (e.g. mentioning a medical condition). VisionFlow does not actively solicit special category data. The Controller is responsible for ensuring appropriate safeguards are in place where special category data may be processed.</P>
      </Section>

      <Section title="4. Processor Obligations">
        <P>VisionFlow shall:</P>
        <UL items={[
          'Only process Patient Data on documented instructions from the Controller',
          'Ensure all personnel with access to Patient Data are bound by appropriate confidentiality obligations',
          'Implement appropriate technical and organisational security measures (see Annex B)',
          'Not engage any sub-processor without prior written authorisation from the Controller (general authorisation is given in Annex A)',
          'Assist the Controller in responding to data subject rights requests relating to Patient Data',
          'Assist the Controller in meeting obligations under Articles 32–36 UK GDPR (security, breach notification, DPIAs)',
          'Delete or return all Patient Data upon termination of the Service, at the Controller\'s choice',
          'Provide all information reasonably necessary to demonstrate compliance with this DPA',
          'Notify the Controller of any personal data breach affecting Patient Data within 72 hours of becoming aware',
        ]} />
      </Section>

      <Section title="5. Controller Obligations">
        <P>The Controller shall:</P>
        <UL items={[
          'Ensure it has a lawful basis under UK GDPR for processing Patient Data through the Service',
          'Update its Privacy Notice to inform patients that AI-powered WhatsApp and voice communications are used',
          'Not instruct VisionFlow to process Patient Data in a manner that would breach UK GDPR',
          'Ensure patients are informed that calls and messages may be handled by an AI system',
          'Maintain appropriate security over its VisionFlow account credentials',
        ]} />
      </Section>

      <Section title="Annex A — Approved Sub-Processors">
        <UL items={[
          'Supabase Inc — Database, authentication, and file storage (EU data centres)',
          'Pinecone Inc — Knowledge base vector database (EU data centres)',
          'OpenAI Inc via Azure OpenAI — AI inference (EU data centres, UK GDPR compliant)',
          'ElevenLabs Inc — Voice synthesis and Conversational AI (EU data centres)',
          'Stripe Inc — Payment processing (UK/EU, not used for Patient Data)',
        ]} />
        <P>VisionFlow will provide 30 days' notice before engaging any new sub-processor. Objections must be raised in writing within that period.</P>
      </Section>

      <Section title="Annex B — Technical and Organisational Security Measures">
        <UL items={[
          'Encryption in transit: TLS 1.3 for all data in transit',
          'Encryption at rest: AES-256 for all data stored in Supabase',
          'Access control: Role-based access control (RBAC) with row-level security (RLS) per practice',
          'Authentication: Multi-factor authentication available and recommended for all accounts',
          'Data isolation: Each practice\'s data is isolated via Supabase RLS policies and Pinecone namespaces',
          'Penetration testing: Annual third-party penetration testing of the platform',
          'Incident response: Documented incident response procedure with 72-hour breach notification',
          'Staff training: All VisionFlow staff with access to systems receive data protection training annually',
          'Audit logging: All access to Patient Data is logged with timestamps and user IDs',
        ]} />
      </Section>
    </LegalShell>
  );
}

// ─── GDPR Compliance ──────────────────────────────────────────────────────────
export function GDPRCompliance() {
  return (
    <LegalShell
      title="GDPR Compliance"
      subtitle="How VisionFlow aligns with UK GDPR and the Data Protection Act 2018"
    >
      <Meta date="1 April 2025" version="1.0" />

      <Section title="Our Approach to GDPR">
        <P>VisionFlow AI Ltd is committed to full compliance with the UK General Data Protection Regulation (UK GDPR) as retained in UK law by the European Union (Withdrawal) Act 2018 and supplemented by the Data Protection Act 2018.</P>
        <P>This page explains the specific steps we have taken to build GDPR compliance into the VisionFlow platform, and what this means for optical practices using our Service.</P>
      </Section>

      <Section title="Data Residency — UK/EU Only">
        <P>All personal data processed through VisionFlow — including patient conversation data, practice account data, and knowledge base content — is stored exclusively in UK or EEA data centres. We do not transfer data to the United States or any third country without adequate safeguards.</P>
        <P>Our infrastructure providers (Supabase, Pinecone, Azure OpenAI, ElevenLabs) all operate EU or UK data centre regions for our account. Data is not routed through US infrastructure.</P>
      </Section>

      <Section title="Lawful Basis for Processing Patient Data">
        <P>Optical practices using VisionFlow must have a lawful basis for processing patient personal data. The most appropriate basis is typically:</P>
        <UL items={[
          'Contract — processing is necessary to book appointments or provide the service the patient is requesting',
          'Legitimate interests — handling enquiries and follow-up communications, where patients would reasonably expect this',
          'Consent — where you choose to obtain explicit consent from patients before WhatsApp AI communications begin',
        ]} />
        <P>We provide a Privacy Notice template (available in your onboarding materials) that you can adapt to include WhatsApp AI communications in your practice's patient-facing privacy information.</P>
      </Section>

      <Section title="Data Subject Rights">
        <P>Our platform supports all data subject rights under UK GDPR:</P>
        <UL items={[
          'Right of access: Practices can export all data for a specific patient from the Conversations and Leads sections',
          'Right to rectification: Conversation data can be annotated or corrected by practice staff',
          'Right to erasure: Contact support@visionflow.ai to delete all data for a specific patient phone number',
          'Right to restriction: Practices can disable AI for specific patients',
          'Right to portability: Patient data can be exported in JSON format on request',
          'Right to object: Patients can be placed on a do-not-contact list',
        ]} />
      </Section>

      <Section title="Privacy by Design">
        <UL items={[
          'Data minimisation: We only collect the minimum patient data needed to deliver the Service',
          'Purpose limitation: Patient data is never used for training AI models or any purpose beyond delivering the Service',
          'Storage limitation: Automatic deletion of patient data after 24 months of inactivity',
          'Pseudonymisation: Patient data is referenced by phone number hash in analytics, not plain text',
          'Integrity and confidentiality: AES-256 encryption at rest, TLS 1.3 in transit',
          'Accountability: Full audit logs of all data access and processing activities',
        ]} />
      </Section>

      <Section title="WhatsApp and Consent">
        <P>WhatsApp's Business Messaging Policy requires that businesses only initiate conversations with users who have explicitly opted in. VisionFlow's AI only responds to inbound messages — it never initiates contact with patients.</P>
        <P>Practices should ensure their patient-facing materials (website, reception desk notices, appointment cards) inform patients that enquiries sent to the practice WhatsApp number may be handled by an AI assistant.</P>
      </Section>

      <Section title="For More Information">
        <P>Our full privacy practices are set out in our Privacy Policy. Our specific obligations as a data processor are set out in our Data Processing Agreement. If you have a GDPR query not covered here, contact privacy@visionflow.ai.</P>
        <P>ICO registration number: [pending registration] — VisionFlow AI Ltd is registered with the Information Commissioner's Office as a data controller.</P>
      </Section>
    </LegalShell>
  );
}

// ─── GOC Practice Standards ───────────────────────────────────────────────────
export function GOCStandards() {
  return (
    <LegalShell
      title="GOC Practice Standards"
      subtitle="How VisionFlow aligns with General Optical Council regulations and standards"
    >
      <Meta date="1 April 2025" version="1.0" />

      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 mb-10">
        <p className="text-sm text-amber-300 leading-relaxed">
          <strong className="text-amber-200">Important disclaimer:</strong> VisionFlow AI is not affiliated with or endorsed by the General Optical Council (GOC). This page describes how our platform is designed to be consistent with GOC standards. Optical practices are solely responsible for their own GOC compliance. If you have specific regulatory questions, consult the GOC directly at optical.org.
        </p>
      </div>

      <Section title="What VisionFlow Does and Doesn't Do">
        <P>VisionFlow is an administrative communication tool. It is designed to handle the reception and booking functions of an optical practice, not to perform or assist with clinical work. This distinction is fundamental to GOC compliance.</P>
        <P><strong className="text-white">VisionFlow will:</strong></P>
        <UL items={[
          'Answer questions about practice services, prices, and appointment availability',
          'Handle NHS sight test eligibility enquiries (informational only)',
          'Book, reschedule, and cancel appointments',
          'Process contact lens reorder requests (administrative logging only)',
          'Escalate patient contacts to GOC-registered optometrists where appropriate',
          'Handle out-of-hours enquiries and direct emergencies to 111',
        ]} />
        <P><strong className="text-white">VisionFlow will never:</strong></P>
        <UL items={[
          'Interpret clinical findings, prescriptions, or test results',
          'Provide advice on whether a patient needs clinical intervention',
          'Recommend specific optical products for clinical reasons',
          'Assess the urgency of clinical symptoms beyond keyword-based escalation',
          'Make representations that could constitute the practice of optometry',
          'Provide information that could mislead patients about their clinical needs',
        ]} />
      </Section>

      <Section title="GOC Standards of Practice Alignment">
        <P>The GOC Standards of Practice for Optometrists and Dispensing Opticians require practitioners to act in the best interests of patients. VisionFlow is designed to support this by:</P>
        <UL items={[
          'Ensuring clinical questions are always escalated to registered practitioners',
          'Never providing information that could cause a patient to delay necessary clinical care',
          'Implementing immediate escalation for symptoms that may indicate sight-threatening conditions',
          'Maintaining accurate records of all patient interactions for practice audit purposes',
          'Supporting appropriate referral pathways (NHS 111, A&E) for out-of-hours emergencies',
        ]} />
      </Section>

      <Section title="Eye Emergency Escalation">
        <P>The platform automatically escalates to your clinical team when patients describe symptoms that may indicate a sight-threatening condition, including:</P>
        <UL items={[
          'Sudden loss of vision or significant vision change',
          'Flashing lights (photopsia)',
          'New or sudden onset floaters',
          'Eye pain, especially with reduced vision',
          'Chemical splash or foreign body in the eye',
          'Sudden onset double vision',
          'Significant trauma to the eye or orbit',
        ]} />
        <P>The AI does not attempt to assess clinical urgency — it escalates immediately and advises the patient to attend urgently or contact NHS 111. This is a safety measure, not a clinical triage tool.</P>
      </Section>

      <Section title="NHS GOS Contract Compliance">
        <P>Practices with NHS General Ophthalmic Services (GOS) contracts should be aware:</P>
        <UL items={[
          'VisionFlow can provide accurate NHS sight test eligibility information for England (updated annually)',
          'Different eligibility rules apply in Wales (NHS Wales), Scotland (NHS Scotland), and Northern Ireland — configure your knowledge base accordingly',
          'The platform does not handle GOS claiming, pre-authorisation, or clinical record keeping',
          'GOS contracts require optometrists to see all eligible patients who present — VisionFlow\'s booking system should not be configured to restrict NHS eligible patients',
          'Practices are responsible for maintaining their own GOS contract compliance regardless of communication method',
        ]} />
      </Section>

      <Section title="GOC Practice Registration">
        <P>Your GOC practice registration number should be included in your VisionFlow practice profile. This allows the AI to reference it accurately when patients ask about the practice's registration status. The AI can confirm that your practice is GOC-registered but will not make further representations about the scope of registration.</P>
      </Section>

      <Section title="Reporting and Transparency">
        <P>All AI-handled patient interactions are logged and accessible to practice owners and administrators through the VisionFlow dashboard. This audit trail supports:</P>
        <UL items={[
          'GOC fitness to practise investigations (if required)',
          'NHS contract audits',
          'CQC inspection preparation (for practices registered with CQC)',
          'Internal quality assurance reviews',
          'Patient complaint investigations',
        ]} />
      </Section>
    </LegalShell>
  );
}
