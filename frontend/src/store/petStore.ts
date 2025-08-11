// src/store/petStore.ts
import {create} from 'zustand';

interface Pet {
  petId: number;
  name: string;
  age: number;
  weight: number;
  species: string;
  gender: string;
  pet_code: string;
  photo: string;
}

interface PetStore {
  pets: Pet[];
  selectedPet: Pet | null;
  setPets: (pets: Pet[]) => void;
  setSelectedPet: (pet: Pet | null) => void;
  deletePet: (petId: number) => void; // 삭제 기능
}

const usePetStore = create<PetStore>((set) => ({
  pets: [],
  selectedPet: null,
  setPets: (pets) => set({ pets }),
  setSelectedPet: (pet) => set({ selectedPet: pet }),
  deletePet: (petId) => set((state) => {
    const updatedPets = state.pets.filter((pet) => pet.petId !== petId);
    console.log(state.pets)
    console.log(updatedPets)
    return { pets: updatedPets };
  }),
}));

export default usePetStore;
