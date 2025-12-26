import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { db } from '../lib/db';
import type { Pet, MedicalEvent, Reminder } from '../types';
import { generateId } from '../lib/utils';

interface PetContextType {
  pets: Pet[];
  medicalEvents: MedicalEvent[];
  reminders: Reminder[];
  loading: boolean;

  // Pet operations
  addPet: (pet: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Pet>;
  updatePet: (id: string, updates: Partial<Pet>) => Promise<void>;
  deletePet: (id: string) => Promise<void>;
  getPetById: (id: string) => Pet | undefined;

  // Medical event operations
  addMedicalEvent: (event: Omit<MedicalEvent, 'id' | 'createdAt' | 'updatedAt'>) => Promise<MedicalEvent>;
  updateMedicalEvent: (id: string, updates: Partial<MedicalEvent>) => Promise<void>;
  deleteMedicalEvent: (id: string) => Promise<void>;
  getEventsByPetId: (petId: string) => MedicalEvent[];

  // Reminder operations
  addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Reminder>;
  updateReminder: (id: string, updates: Partial<Reminder>) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  getRemindersByPetId: (petId: string) => Reminder[];
  getUpcomingReminders: () => Reminder[];

  refreshData: () => Promise<void>;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export function PetProvider({ children }: { children: ReactNode }) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [medicalEvents, setMedicalEvents] = useState<MedicalEvent[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    try {
      setLoading(true);
      const [petsData, eventsData, remindersData] = await Promise.all([
        db.pets.toArray(),
        db.medicalEvents.toArray(),
        db.reminders.toArray(),
      ]);
      setPets(petsData);
      setMedicalEvents(eventsData);
      setReminders(remindersData);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Pet operations
  const addPet = async (petData: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>): Promise<Pet> => {
    const now = new Date();
    const newPet: Pet = {
      ...petData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    await db.pets.add(newPet);
    await refreshData();
    return newPet;
  };

  const updatePet = async (id: string, updates: Partial<Pet>) => {
    await db.pets.update(id, { ...updates, updatedAt: new Date() });
    await refreshData();
  };

  const deletePet = async (id: string) => {
    await db.pets.delete(id);
    // Also delete related events and reminders
    await db.medicalEvents.where('petId').equals(id).delete();
    await db.reminders.where('petId').equals(id).delete();
    await refreshData();
  };

  const getPetById = (id: string) => pets.find(pet => pet.id === id);

  // Medical event operations
  const addMedicalEvent = async (
    eventData: Omit<MedicalEvent, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<MedicalEvent> => {
    const now = new Date();
    const newEvent: MedicalEvent = {
      ...eventData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    await db.medicalEvents.add(newEvent);
    await refreshData();
    return newEvent;
  };

  const updateMedicalEvent = async (id: string, updates: Partial<MedicalEvent>) => {
    await db.medicalEvents.update(id, { ...updates, updatedAt: new Date() });
    await refreshData();
  };

  const deleteMedicalEvent = async (id: string) => {
    await db.medicalEvents.delete(id);
    await refreshData();
  };

  const getEventsByPetId = (petId: string) =>
    medicalEvents.filter(event => event.petId === petId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());

  // Reminder operations
  const addReminder = async (
    reminderData: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Reminder> => {
    const now = new Date();
    const newReminder: Reminder = {
      ...reminderData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    await db.reminders.add(newReminder);
    await refreshData();
    return newReminder;
  };

  const updateReminder = async (id: string, updates: Partial<Reminder>) => {
    await db.reminders.update(id, { ...updates, updatedAt: new Date() });
    await refreshData();
  };

  const deleteReminder = async (id: string) => {
    await db.reminders.delete(id);
    await refreshData();
  };

  const getRemindersByPetId = (petId: string) =>
    reminders.filter(reminder => reminder.petId === petId);

  const getUpcomingReminders = () => {
    const now = new Date();
    return reminders
      .filter(reminder => !reminder.completed && reminder.dueDate >= now)
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  };

  const value: PetContextType = {
    pets,
    medicalEvents,
    reminders,
    loading,
    addPet,
    updatePet,
    deletePet,
    getPetById,
    addMedicalEvent,
    updateMedicalEvent,
    deleteMedicalEvent,
    getEventsByPetId,
    addReminder,
    updateReminder,
    deleteReminder,
    getRemindersByPetId,
    getUpcomingReminders,
    refreshData,
  };

  return <PetContext.Provider value={value}>{children}</PetContext.Provider>;
}

export function usePets() {
  const context = useContext(PetContext);
  if (context === undefined) {
    throw new Error('usePets must be used within a PetProvider');
  }
  return context;
}
