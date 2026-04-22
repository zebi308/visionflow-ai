export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      practices: {
        Row: {
          id: string
          name: string
          type: 'Independent' | 'NHS & Private' | 'Private Only' | 'Domiciliary'
          address: string | null
          city: string | null
          postcode: string | null
          phone: string | null
          whatsapp_number: string | null
          goc_number: string | null
          cqc_registered: boolean
          plan: 'starter' | 'growth' | 'practice' | 'enterprise'
          trial_ends_at: string | null
          wa_phone_number_id: string | null
          wa_access_token: string | null
          wa_verify_token: string | null
          kb_doc_url: string | null
          kb_namespace: string | null
          ai_personality: 'Professional' | 'Friendly' | 'Empathetic'
          ai_greeting: string | null
          ai_custom_instructions: string | null
          elevenlabs_voice: 'Sophie' | 'James' | 'Emma'
          voice_forwarding_number: string | null
          escalation_emails: string[] | null
          escalation_sms: string | null
          opening_hours: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['practices']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['practices']['Insert']>
      }
      profiles: {
        Row: {
          id: string
          practice_id: string | null
          name: string | null
          role: 'Owner' | 'Admin' | 'Receptionist' | 'Optometrist' | 'Dispensing Optician' | 'Support Manager'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      conversations: {
        Row: {
          id: string
          practice_id: string
          patient_name: string | null
          patient_phone: string
          last_message: string | null
          last_message_time: string | null
          status: 'open' | 'ai-handled' | 'escalated' | 'booked' | 'unread' | 'closed'
          ai_confidence: number
          assigned_to: string | null
          labels: string[]
          unread_count: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['conversations']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['conversations']['Insert']>
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          practice_id: string
          sender: 'patient' | 'ai' | 'staff'
          text: string
          type: 'text' | 'voice' | 'image' | 'document'
          metadata: Json | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['messages']['Insert']>
      }
      appointments: {
        Row: {
          id: string
          practice_id: string
          patient_name: string
          patient_phone: string
          optometrist_name: string | null
          service: string
          nhs_funded: boolean
          nhs_exemption_reason: string | null
          date: string
          time: string
          duration: number
          status: 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'dna'
          booked_via: 'whatsapp-ai' | 'voice-ai' | 'manual' | 'online'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['appointments']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['appointments']['Insert']>
      }
      leads: {
        Row: {
          id: string
          practice_id: string
          name: string
          phone: string
          category: string
          score: number
          summary: string | null
          last_contact: string | null
          status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
          is_nhs_eligible: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['leads']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['leads']['Insert']>
      }
      escalations: {
        Row: {
          id: string
          practice_id: string
          patient_name: string
          patient_phone: string
          reason: string
          summary: string | null
          status: 'open' | 'in-progress' | 'resolved'
          assigned_to: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['escalations']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['escalations']['Insert']>
      }
      kb_entries: {
        Row: {
          id: string
          practice_id: string
          title: string
          type: string
          chunk_count: number
          word_count: number | null
          last_synced: string | null
          status: 'synced' | 'pending' | 'error'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['kb_entries']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['kb_entries']['Insert']>
      }
    }
  }
}
