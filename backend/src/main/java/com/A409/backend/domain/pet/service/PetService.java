package com.A409.backend.domain.pet.service;

import com.A409.backend.domain.pet.dto.PetRequest;
import com.A409.backend.domain.pet.dto.PetResponse;
import com.A409.backend.domain.pet.entity.OwnerPet;
import com.A409.backend.domain.pet.entity.Pet;
import com.A409.backend.domain.pet.repository.OwnerPetRepository;
import com.A409.backend.domain.pet.repository.PetRepository;
import com.A409.backend.domain.user.owner.entity.Owner;
import com.A409.backend.global.enums.ErrorCode;
import com.A409.backend.global.exception.CustomException;
import com.A409.backend.global.util.RandomCodeGenerator;
import com.A409.backend.global.util.uploader.S3Uploader;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PetService {

    private final PetRepository petRepository;
    private final OwnerPetRepository ownerPetRepository;
    private final S3Uploader s3Uploader;

    public Pet getMyPetDetail(Long ownerId,Long petId){

        //동물의 실 보호자인지 확인
        ownerPetRepository.findOwnerPetByOwner_OwnerIdAndPet_PetId(ownerId,petId).orElseThrow(() -> new CustomException(ErrorCode.ACCESS_DENIED));

        //펫 상세정보
        return petRepository.findById(petId).orElseThrow(() -> new CustomException(ErrorCode.RESOURCE_NOT_FOUND));
    }

    public List<PetResponse> getMyPets(Long ownerId){

        //결과 없다면 빈 배열
        List<OwnerPet> ownerPetsList = ownerPetRepository
                .findOwnerPetByOwner_OwnerId(ownerId);

        List<Pet> petList = ownerPetsList.stream()
                .map(OwnerPet::getPet)
                .toList();
        //pet list 리턴
        return petList.stream().map(PetResponse::toResponse).toList();
    }

    public void updatePet(Long ownerId, Long petId,PetRequest petRequest, MultipartFile photo){

        ownerPetRepository.findOwnerPetByOwner_OwnerIdAndPet_PetId(ownerId,petId).orElseThrow(() -> new CustomException(ErrorCode.ACCESS_DENIED));
        Pet findPet = petRepository.findById(petId).orElseThrow(() -> new CustomException(ErrorCode.RESOURCE_NOT_FOUND));

        findPet.setAge(petRequest.getAge());
        findPet.setName(petRequest.getName());
        findPet.setGender(petRequest.getGender());
        findPet.setSpecies(petRequest.getSpecies());

        if(photo != null){
            try{
                String url = s3Uploader.upload(photo,"pet");
                findPet.setPhoto(url);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }

        }

        petRepository.save(findPet);
    }

    public void registerPet(Long ownerId, PetRequest petRequest, MultipartFile photo){
        Pet registerPet = petRequest.toEntity();

        String randomCode = RandomCodeGenerator.generateRandomCode();
        registerPet.setPetCode(randomCode);

        if(photo != null){
            try{
                String url = s3Uploader.upload(photo,"pet");
                registerPet.setPhoto(url);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }

        }

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
        log.info(petCode);
        Pet findPet = petRepository.findPetByPetCode(petCode).orElseThrow();
        Owner owner = Owner.builder()
                .ownerId(userId)
                .build();

        OwnerPet ownerPet = OwnerPet.builder()
                .owner(owner)
                .pet(findPet)
                .build();

        log.info(ownerPet.toString());

        ownerPetRepository.save(ownerPet);
    }


}
