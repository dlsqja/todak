import { create } from 'zustand';

interface SubjectState {
  subject: string;
  setSubject: (subject: string) => void;
}

export const useSubjectStore = create<SubjectState>((set) => ({
  subject: '',
  setSubject: (subject) => set({ subject }),
}));
