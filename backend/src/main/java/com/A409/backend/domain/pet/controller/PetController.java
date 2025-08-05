package com.A409.backend.domain.pet.controller;

import com.A409.backend.domain.pet.dto.PetRequest;
import com.A409.backend.domain.pet.entity.Pet;
import com.A409.backend.domain.pet.service.PetService;
import com.A409.backend.global.response.APIResponse;
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
    public APIResponse<?> getMyPets(@AuthenticationPrincipal User user) {

        List<Pet> petList = petService.getMyPets(user.getId());

        return APIResponse.ofSuccess(petList);
    }
    @GetMapping("/{pet_id}")
    public APIResponse<?> getMyPetDetail(@AuthenticationPrincipal User user, @PathVariable("pet_id") Long petId) {

        Pet petDetail = petService.getMyPetDetail(user.getId(), petId);

        return APIResponse.ofSuccess(petDetail);
    }

    @PostMapping("/")
    public APIResponse<?> registerPet(@AuthenticationPrincipal User user, @RequestBody PetRequest petRequest) {
        petService.registerPet(user.getId(),petRequest);

        return APIResponse.ofSuccess(null);
    }

    @PostMapping("/code")
    public APIResponse<?> registerPetByCode(@AuthenticationPrincipal User user, @RequestBody String petCode) {
        petService.registerPetByCode(user.getId(),petCode);

        return APIResponse.ofSuccess(null);
    }
}
