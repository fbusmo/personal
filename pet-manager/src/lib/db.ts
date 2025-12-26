import Dexie from 'dexie';
import type { Table } from 'dexie';
import type { Pet, MedicalEvent, Reminder, AppSettings } from '../types';

export class PetManagerDB extends Dexie {
  pets!: Table<Pet, string>;
  medicalEvents!: Table<MedicalEvent, string>;
  reminders!: Table<Reminder, string>;
  settings!: Table<AppSettings & { id: string }, string>;

  constructor() {
    super('PetManagerDB');

    this.version(1).stores({
      pets: 'id, name, species, birthDate, createdAt',
      medicalEvents: 'id, petId, type, date, createdAt',
      reminders: 'id, petId, eventId, dueDate, completed, type',
      settings: 'id',
    });
  }
}

export const db = new PetManagerDB();

// Initialize default settings
export const initializeSettings = async () => {
  const existingSettings = await db.settings.get('default');
  if (!existingSettings) {
    await db.settings.add({
      id: 'default',
      theme: 'system',
      notifications: true,
      reminderDaysBefore: 7,
      currency: 'USD',
      language: 'en',
    });
  }
};
