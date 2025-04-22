import { createContext, useContext } from 'react';

// create context
export const LawyerContext = createContext();
export const AppointmentListContext = createContext();

// use context
export const useLawyer = () => useContext(LawyerContext);
export const useAppointment = () => useContext(AppointmentListContext);