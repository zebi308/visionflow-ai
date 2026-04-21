import {
  LayoutDashboard, MessageSquare, Calendar, Target,
  BookOpen, ShieldAlert, BarChart3, Users, CreditCard,
  Settings, Zap, Eye
} from 'lucide-react';
import type { Conversation, Lead, Appointment, Escalation, Analytics, BillingPlan } from './types';

export const mainNavigation = [
  { name: 'Dashboard',      href: '/app',               icon: LayoutDashboard },
  { name: 'Conversations',  href: '/app/conversations', icon: MessageSquare, badge: '8' },
  { name: 'Appointments',   href: '/app/appointments',  icon: Calendar },
  { name: 'Leads',          href: '/app/leads',         icon: Target },
  { name: 'Knowledge Base', href: '/app/kb',            icon: BookOpen },
];

export const automationNavigation = [
  { name: 'AI Settings',  href: '/app/settings',   icon: Zap },
  { name: 'Escalations',  href: '/app/escalations', icon: ShieldAlert, alert: '3' },
];

export const secondaryNavigation = [
  { name: 'Analytics', href: '/app/analytics', icon: BarChart3 },
  { name: 'Team',      href: '/app/team',      icon: Users },
  { name: 'Billing',   href: '/app/billing',   icon: CreditCard },
  { name: 'Settings',  href: '/app/settings',  icon: Settings },
];

export const mockConversations: Conversation[] = [
  {
    id: '1', patientName: 'James Thornton', patientPhone: '+44 7700 900123',
    lastMessage: "Am I eligible for a free NHS eye test? I'm 62.",
    lastMessageTime: '10:42', status: 'ai-handled', aiConfidence: 1.0,
    labels: ['NHS Eligibility', 'Existing Patient'], unreadCount: 0,
  },
  {
    id: '2', patientName: 'Priya Patel', patientPhone: '+44 7700 900456',
    lastMessage: 'Can I reorder my monthly contact lenses through you?',
    lastMessageTime: '09:18', status: 'booked', aiConfidence: 0.98,
    labels: ['Contact Lens Reorder'], unreadCount: 0,
  },
  {
    id: '3', patientName: 'Emily Clarke', patientPhone: '+44 7700 900789',
    lastMessage: "I've had sudden flashing lights in my vision since this morning.",
    lastMessageTime: '09:05', status: 'escalated', aiConfidence: 0.1,
    labels: ['Eye Emergency'], unreadCount: 1,
  },
  {
    id: '4', patientName: 'Tom Sinclair', patientPhone: '+44 7700 900321',
    lastMessage: 'Thank you! See you on the 24th for the sight test. 👍',
    lastMessageTime: 'Yesterday', status: 'booked', aiConfidence: 0.99,
    labels: ['Booking', 'New Patient'], unreadCount: 0,
  },
  {
    id: '5', patientName: 'Aoife Murphy', patientPhone: '+44 7700 900654',
    lastMessage: "What's included in your myopia management for children?",
    lastMessageTime: 'Yesterday', status: 'ai-handled', aiConfidence: 0.95,
    labels: ['Myopia Management', 'Children'], unreadCount: 0,
  },
  {
    id: '6', patientName: 'David Okafor', patientPhone: '+44 7700 900987',
    lastMessage: 'How much does an OCT scan cost privately?',
    lastMessageTime: 'Mon', status: 'ai-handled', aiConfidence: 1.0,
    labels: ['OCT Pricing', 'Private'], unreadCount: 0,
  },
];

export const mockLeads: Lead[] = [
  {
    id: '1', name: 'James Thornton', phone: '+44 7700 900123',
    category: 'nhs-sight-test', score: 85,
    summary: 'Over-60, eligible for free NHS sight test. Asked about availability.',
    lastContact: '2025-04-20', status: 'qualified', isNhsEligible: true,
  },
  {
    id: '2', name: 'Robert Blake', phone: '+44 7700 900555',
    category: 'myopia-management', score: 94,
    summary: 'Parent enquiring about MiSight contact lenses for 10-year-old. High intent.',
    lastContact: '2025-04-19', status: 'new', isNhsEligible: false,
  },
  {
    id: '3', name: 'Linda Ashworth', phone: '+44 7700 900444',
    category: 'contact-lenses', score: 78,
    summary: 'Interested in switching from glasses to daily disposable lenses.',
    lastContact: '2025-04-18', status: 'contacted', isNhsEligible: false,
  },
  {
    id: '4', name: 'Gareth Williams', phone: '+44 7700 900333',
    category: 'nhs-sight-test', score: 60,
    summary: 'Diabetic patient, eligible for free NHS sight test. Moved from Swansea.',
    lastContact: '2025-04-17', status: 'new', isNhsEligible: true,
  },
  {
    id: '5', name: 'Fatima Al-Hassan', phone: '+44 7700 900222',
    category: 'oct-scan', score: 88,
    summary: 'Family history of glaucoma, wants OCT scan. Ready to book.',
    lastContact: '2025-04-16', status: 'qualified', isNhsEligible: false,
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: '1', patientName: 'Tom Sinclair', patientPhone: '+44 7700 900321',
    optometristName: 'Mr. Raj Patel BSc MCOptom', service: 'NHS Sight Test',
    nhsFunded: true, date: '2025-04-24', time: '09:30', duration: 30,
    status: 'confirmed', bookedVia: 'whatsapp-ai',
  },
  {
    id: '2', patientName: 'Priya Patel', patientPhone: '+44 7700 900456',
    optometristName: 'Ms. Sarah Williams FCOptom', service: 'Contact Lens Consultation',
    nhsFunded: false, date: '2025-04-24', time: '11:00', duration: 45,
    status: 'confirmed', bookedVia: 'whatsapp-ai',
  },
  {
    id: '3', patientName: 'Kevin Hart', patientPhone: '+44 7700 900111',
    optometristName: 'Mr. Raj Patel BSc MCOptom', service: 'OCT Scan',
    nhsFunded: false, date: '2025-04-25', time: '14:15', duration: 20,
    status: 'pending', bookedVia: 'voice-ai',
  },
  {
    id: '4', patientName: 'Maria Santos', patientPhone: '+44 7700 900888',
    optometristName: 'Ms. Sarah Williams FCOptom', service: 'Private Sight Test',
    nhsFunded: false, date: '2025-04-22', time: '10:00', duration: 45,
    status: 'completed', bookedVia: 'whatsapp-ai',
  },
  {
    id: '5', patientName: 'Ben Tucker', patientPhone: '+44 7700 900777',
    optometristName: 'Mr. Raj Patel BSc MCOptom', service: 'Emergency Appointment',
    nhsFunded: true, date: '2025-04-21', time: '08:30', duration: 20,
    status: 'dna', bookedVia: 'voice-ai',
  },
];

export const mockEscalations: Escalation[] = [
  {
    id: '1', patientName: 'Emily Clarke', patientPhone: '+44 7700 900789',
    reason: 'eye-emergency',
    summary: 'Patient reporting sudden flashing lights and floaters in left eye since this morning. Possible posterior vitreous detachment — urgent clinical assessment needed.',
    timestamp: '2025-04-20T09:05:00', status: 'open',
  },
  {
    id: '2', patientName: 'Harold Price', patientPhone: '+44 7700 900666',
    reason: 'complaint',
    summary: 'Patient unhappy that spectacles ordered 3 weeks ago still not arrived. Requested to speak with practice manager.',
    timestamp: '2025-04-19T14:22:00', status: 'in-progress', assignedTo: 'Ms. Sarah Williams FCOptom',
  },
  {
    id: '3', patientName: 'Mei-Lin Chan', patientPhone: '+44 7700 900555',
    reason: 'clinical-question',
    summary: 'Patient asking detailed questions about orthokeratology for her child. AI correctly escalated to optometrist.',
    timestamp: '2025-04-18T16:40:00', status: 'resolved',
  },
];

export const mockAnalytics: Analytics = {
  totalConversations: 312,
  aiHandledRate: 0.84,
  bookingsThisMonth: 94,
  avgResponseTime: '16s',
  nhsVsPrivate: { nhs: 62, private: 38 },
  topLeadCategories: [
    { name: 'NHS Sight Tests',      value: 38 },
    { name: 'Contact Lenses',       value: 24 },
    { name: 'New Patients',         value: 18 },
    { name: 'OCT / Specialist',     value: 12 },
    { name: 'Myopia Management',    value: 8  },
  ],
  dailyStats: [
    { day: 'Mon', conversations: 52, bookings: 14, escalations: 2 },
    { day: 'Tue', conversations: 61, bookings: 17, escalations: 1 },
    { day: 'Wed', conversations: 48, bookings: 12, escalations: 3 },
    { day: 'Thu', conversations: 67, bookings: 19, escalations: 2 },
    { day: 'Fri', conversations: 55, bookings: 18, escalations: 1 },
    { day: 'Sat', conversations: 29, bookings: 14, escalations: 0 },
  ],
};

export const billingPlans: BillingPlan[] = [
  {
    id: 'starter', name: 'Starter', price: 79, annualPrice: 69,
    description: 'For single-optometrist practices getting started with AI.',
    features: [
      { name: 'Up to 200 AI conversations/mo', included: true },
      { name: 'WhatsApp booking bot',          included: true },
      { name: 'NHS eligibility FAQs',          included: true },
      { name: 'Google Sheets CRM sync',        included: true },
      { name: 'Human escalation emails',       included: true },
      { name: 'Voice AI receptionist',         included: false },
      { name: 'RAG knowledge base',            included: false },
      { name: 'Analytics dashboard',           included: false },
      { name: 'Priority support',              included: false },
    ],
  },
  {
    id: 'growth', name: 'Growth', price: 149, annualPrice: 129,
    description: 'For practices wanting full WhatsApp + Voice automation.',
    highlighted: true,
    features: [
      { name: 'Up to 800 AI conversations/mo', included: true },
      { name: 'WhatsApp booking bot',          included: true },
      { name: 'NHS eligibility FAQs',          included: true },
      { name: 'Google Sheets CRM sync',        included: true },
      { name: 'Human escalation emails',       included: true },
      { name: 'Voice AI receptionist',         included: true },
      { name: 'RAG knowledge base',            included: true },
      { name: 'Analytics dashboard',           included: true },
      { name: 'Priority support',              included: false },
    ],
  },
  {
    id: 'practice', name: 'Practice', price: 299, annualPrice: 249,
    description: 'For multi-optometrist or multi-site practices.',
    features: [
      { name: 'Unlimited AI conversations',    included: true },
      { name: 'WhatsApp + Voice AI',           included: true },
      { name: 'NHS eligibility FAQs',          included: true },
      { name: 'Google Sheets CRM sync',        included: true },
      { name: 'Human escalation emails',       included: true },
      { name: 'Voice AI receptionist',         included: true },
      { name: 'RAG knowledge base',            included: true },
      { name: 'Analytics dashboard',           included: true },
      { name: 'Priority support',              included: true },
    ],
  },
];

export const leadCategoryLabels: Record<string, string> = {
  'new-patient':          'New Patient',
  'nhs-sight-test':       'NHS Sight Test',
  'private-sight-test':   'Private Sight Test',
  'contact-lenses':       'Contact Lenses',
  'contact-lens-reorder': 'CL Reorder',
  'spectacles-pricing':   'Spectacles Pricing',
  'myopia-management':    'Myopia Management',
  'oct-scan':             'OCT Scan',
  'dry-eye':              'Dry Eye',
  'emergency':            'Emergency',
  'children':             'Children',
  'reschedule':           'Reschedule',
  'ask-staff':            'Ask Staff',
  'other':                'Other',
};

export const nhsEligibility = [
  { group: 'Under 16',             detail: 'All children under 16 qualify for a free NHS sight test' },
  { group: 'Under 19, in full-time education', detail: 'Students in full-time education up to age 19' },
  { group: 'Over 60',              detail: 'All patients aged 60 and over' },
  { group: 'Diagnosed with glaucoma', detail: 'Or considered at risk by an ophthalmologist' },
  { group: 'Diabetic patients',    detail: 'All patients with a diabetes diagnosis' },
  { group: 'Benefits claimants',   detail: 'Income Support, Universal Credit, JSA, ESA, Pension Credit' },
  { group: 'NHS Low Income Scheme',detail: 'HC2/HC3 certificate holders' },
  { group: 'Prisoners on release', detail: 'Complex discharge pathways' },
];
