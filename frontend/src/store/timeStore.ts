import { create } from 'zustand';

interface TimeState {
  selectedTime: string;
  setSelectedTime: (time: string) => void;
}

export const useTimeStore = create<TimeState>((set) => ({
  selectedTime: '',
  setSelectedTime: (time) => set({ selectedTime: time }),
}));
