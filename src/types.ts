// ─── Auth & Users ─────────────────────────────────────────────────────────────

export type Role = 'Owner' | 'Admin' | 'Receptionist' | 'Optometrist' | 'Dispensing Optician' | 'Support Manager';
export type Plan = 'starter' | 'growth' | 'practice' | 'enterprise';

export interface User {
  id: string; name: string; email: string; avatar?: string;
  role: Role; practiceId: string; createdAt: string;
}

export type PracticeType = 'Independent' | 'NHS & Private' | 'Private Only' | 'Domiciliary';

export interface Practice {
  id: string; name: string; type: PracticeType;
  address: string; city: string; postcode: string; phone: string;
  whatsappNumber?: string; gocNumber?: string;
  cqcRegistered: boolean; plan: Plan; trialEndsAt?: string; createdAt: string;
}

export type ConversationStatus = 'open' | 'ai-handled' | 'escalated' | 'booked' | 'unread' | 'closed';

export interface Message {
  id: string; sender: 'patient' | 'ai' | 'staff'; text: string; timestamp: string;
  type: 'text' | 'voice' | 'image' | 'document';
  metadata?: { transcript?: string; imageUrl?: string; fileName?: string; aiConfidence?: number; };
}

export interface Conversation {
  id: string; patientName: string; patientPhone: string;
  lastMessage: string; lastMessageTime: string; status: ConversationStatus;
  aiConfidence: number; assignedTo?: string; labels: string[];
  unreadCount?: number; messages?: Message[];
}

export type AppointmentStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'dna';

export interface Appointment {
  id: string; patientName: string; patientPhone: string;
  optometristName: string; service: string;
  nhsFunded?: boolean; nhsExemptionReason?: string;
  date: string; time: string; duration: number; status: AppointmentStatus;
  bookedVia: 'whatsapp-ai' | 'voice-ai' | 'manual' | 'online'; notes?: string;
}

export type LeadCategory =
  | 'new-patient' | 'nhs-sight-test' | 'private-sight-test' | 'contact-lenses'
  | 'contact-lens-reorder' | 'spectacles-pricing' | 'myopia-management'
  | 'oct-scan' | 'dry-eye' | 'emergency' | 'children' | 'reschedule' | 'ask-staff' | 'other';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';

export interface Lead {
  id: string; name: string; phone: string; category: LeadCategory;
  score: number; summary: string; lastContact: string;
  status: LeadStatus; isNhsEligible?: boolean;
}

export type KBEntryType = 'faq' | 'pricing' | 'policy' | 'optometrist-bio' | 'nhs-info' | 'eye-health-guide' | 'product-info';

export interface KBEntry {
  id: string; title: string; type: KBEntryType; chunkCount: number;
  lastSynced: string; wordCount?: number; status: 'synced' | 'pending' | 'error';
}

export type EscalationReason = 'human-request' | 'eye-emergency' | 'complaint' | 'medical-urgency' | 'frustration' | 'complex-query' | 'clinical-question';

export interface Escalation {
  id: string; patientName: string; patientPhone: string;
  reason: EscalationReason; summary: string; timestamp: string;
  status: 'open' | 'in-progress' | 'resolved'; assignedTo?: string;
}

export interface DailyStats { day: string; conversations: number; bookings: number; escalations: number; }

export interface Analytics {
  totalConversations: number; aiHandledRate: number;
  bookingsThisMonth: number; avgResponseTime: string;
  nhsVsPrivate: { nhs: number; private: number };
  topLeadCategories: { name: string; value: number }[];
  dailyStats: DailyStats[];
}

export interface PlanFeature { name: string; included: boolean; limit?: string; }

export interface BillingPlan {
  id: Plan; name: string; price: number; annualPrice: number;
  description: string; features: PlanFeature[]; highlighted?: boolean;
}
