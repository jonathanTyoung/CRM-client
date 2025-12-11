// app/types/contacts.ts

export interface Contact {
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone?: string | null;
  notes?: string | null;
  relationship_type?: string | null;
  owner?: {
    id: number;
    name: string;
    email: string;
  } | null;
  source?: any | null;
  tags?: any[];
  created_at?: string;
  updated_at?: string;
}

export interface Participant {
  contact: Contact;
}
