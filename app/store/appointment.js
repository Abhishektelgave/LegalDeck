import { create } from 'zustand';

// Appointment data store using zustand
export const useAppointmentStore = create((set) => ({
  appt: null,
  setAppt: (appt) => set({ appt }),
}));
