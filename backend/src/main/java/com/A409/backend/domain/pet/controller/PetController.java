package com.A409.backend.domain.pet.controller;

import com.A409.backend.domain.pet.dto.PetRequest;
import com.A409.backend.domain.pet.entity.Pet;
import com.A409.backend.domain.pet.repository.OwnerPetRepository;
import com.A409.backend.domain.pet.service.PetService;
import com.A409.backend.global.response.ApiResponse;
import com.A409.backend.global.security.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pets")
@RequiredArgsConstructor
public class PetController {

    private final PetService petService;

    @GetMapping("/")
    public ApiResponse<?> getMyPets(@AuthenticationPrincipal User user) {

        List<Pet> petList = petService.getMyPets(user.getId());

        return ApiResponse.ofSuccess(petList);
    }
    @GetMapping("/{pet_id}")
    public ApiResponse<?> getMyPetDetail(@AuthenticationPrincipal User user, @PathVariable("pet_id") Long petId) {

        Pet petDetail = petService.getMyPetDetail(user.getId(), petId);

        return ApiResponse.ofSuccess(petDetail);
    }

    @PostMapping("/")
    public ApiResponse<?> registerPet(@AuthenticationPrincipal User user, @RequestBody PetRequest petRequest) {
        petService.registerPet(user.getId(),petRequest);

        return ApiResponse.ofSuccess(null);
    }

    @PostMapping("/code")
    public ApiResponse<?> registerPetByCode(@AuthenticationPrincipal User user, @RequestBody String petCode) {
        petService.registerPetByCode(user.getId(),petCode);

        return ApiResponse.ofSuccess(null);
    }
}
