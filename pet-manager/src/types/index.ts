export type PetSpecies = 'dog' | 'cat' | 'bird' | 'rabbit' | 'hamster' | 'fish' | 'reptile' | 'other';

export interface Pet {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string;
  birthDate: Date;
  photo?: string; // base64 encoded image or URL
  color?: string;
  gender?: 'male' | 'female' | 'unknown';
  weight?: number;
  microchipNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type MedicalEventType =
  | 'consultation'
  | 'vaccination'
  | 'deworming'
  | 'exam'
  | 'surgery'
  | 'medication';

export interface MedicalEvent {
  id: string;
  petId: string;
  type: MedicalEventType;
  title: string;
  date: Date;
  description?: string;
  veterinarian?: string;
  clinic?: string;
  cost?: number;
  attachments?: Attachment[];
  nextAppointment?: Date;
  reminderEnabled?: boolean;
  reminderDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'document';
  data: string; // base64 encoded
  size: number;
  uploadedAt: Date;
}

export interface Reminder {
  id: string;
  petId: string;
  eventId?: string;
  title: string;
  description?: string;
  dueDate: Date;
  type: 'vaccination' | 'medication' | 'appointment' | 'deworming' | 'other';
  completed: boolean;
  completedAt?: Date;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  reminderDaysBefore: number;
  currency: string;
  language: string;
}
