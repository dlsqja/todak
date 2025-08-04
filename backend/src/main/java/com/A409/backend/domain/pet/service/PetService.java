package com.A409.backend.domain.pet.service;

import com.A409.backend.domain.pet.dto.PetRequest;
import com.A409.backend.domain.pet.entity.OwnerPet;
import com.A409.backend.domain.pet.entity.Pet;
import com.A409.backend.domain.pet.repository.OwnerPetRepository;
import com.A409.backend.domain.pet.repository.PetRepository;
import com.A409.backend.domain.user.owner.entity.Owner;
import com.A409.backend.global.enums.ErrorCode;
import com.A409.backend.global.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PetService {

    private final PetRepository petRepository;
    private final OwnerPetRepository ownerPetRepository;

    public Pet getMyPetDetail(Long ownerId,Long petId){

        //동물의 실 보호자인지 확인
        ownerPetRepository.findOwnerPetByOwner_OwnerIdAndPet_PetId(ownerId,petId).orElseThrow(() -> new CustomException(ErrorCode.ACCESS_DENIED));

        //펫 상세정보
        return petRepository.findById(petId).orElseThrow(() -> new CustomException(ErrorCode.RESOURCE_NOT_FOUND));
    }

    public List<Pet> getMyPets(Long ownerId){

        //결과 없다면 빈 배열
        List<OwnerPet> ownerPetsList = ownerPetRepository
                .findOwnerPetByOwner_OwnerId(ownerId).orElseGet(Collections::emptyList);

        //pet list 리턴
        return ownerPetsList.stream()
                .map(OwnerPet::getPet)
                .collect(Collectors.toList());
    }

    public void registerPet(Long ownerId,PetRequest petRequest){
        Pet registerPet = petRequest.toEntity();

        Pet savePet = petRepository.save(registerPet);

        Owner owner = Owner.builder()
                .ownerId(ownerId)
                .build();

        OwnerPet ownerPet = OwnerPet.builder()
                .owner(owner)
                .pet(savePet)
                .build();

        ownerPetRepository.save(ownerPet);
    }

    public void registerPetByCode(Long userId,String petCode){
        Pet findPet = petRepository.findPetByPetCode(petCode).orElseThrow();
        Owner owner = Owner.builder()
                .ownerId(userId)
                .build();

        OwnerPet ownerPet = OwnerPet.builder()
                .owner(owner)
                .pet(findPet)
                .build();

        ownerPetRepository.save(ownerPet);
    }


}
