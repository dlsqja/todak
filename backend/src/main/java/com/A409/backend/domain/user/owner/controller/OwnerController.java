package com.A409.backend.domain.user.owner.controller;

import com.A409.backend.domain.pet.service.PetService;
import com.A409.backend.domain.user.owner.service.OwnerService;
import com.A409.backend.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/my")
@RequiredArgsConstructor
public class OwnerController {

    private final OwnerService ownerService;
    private final PetService petService;

    @GetMapping("/pets")
    public ApiResponse<?> getOwner() {

        return ApiResponse.OfSuccess(null);
    }

    @PostMapping("/")
    public String postOwner() {
        return "owner get";
    }




}
