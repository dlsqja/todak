package com.A409.backend.domain.user.owner.controller;

import com.A409.backend.domain.pet.dto.PetRequest;
import com.A409.backend.domain.pet.service.PetService;
import com.A409.backend.domain.user.owner.service.OwnerService;
import com.A409.backend.global.response.ApiResponse;
import com.A409.backend.global.security.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/my")
@RequiredArgsConstructor
public class OwnerController {

    private final OwnerService ownerService;
    private final PetService petService;

    @GetMapping("/pets")
    public ApiResponse<?> getMyPets() {

        return ApiResponse.OfSuccess(null);
    }

    @PostMapping("/pets")
    public String registerPet(@AuthenticationPrincipal User user, @RequestBody PetRequest petRequest) {

        petService.registerPet(user.getId(),petRequest);
        return "owner get";
    }




}
