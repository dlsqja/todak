package com.A409.backend.domain.pet.service;

import com.A409.backend.domain.pet.dto.PetRequest;
import com.A409.backend.domain.pet.entity.Pet;
import com.A409.backend.domain.pet.repository.PetRepository;
import com.A409.backend.domain.user.owner.entity.Owner;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PetService {

    private final PetRepository petRepository;

    public void registerPet(Long userId,PetRequest petRequest){
        Pet registerPet = petRequest.toEntity();

        Pet savePet = petRepository.save(registerPet);


    }

    public void registerPetByCode(Long userId,String petCode){
    }


}
