package com.A409.backend.domain.user.owner.controller;

import com.A409.backend.domain.pet.dto.PetRequest;
import com.A409.backend.domain.pet.service.PetService;
import com.A409.backend.domain.user.owner.dto.OwnerRequest;
import com.A409.backend.domain.user.owner.dto.OwnerResponse;
import com.A409.backend.domain.user.owner.service.OwnerService;
import com.A409.backend.global.enums.Role;
import com.A409.backend.global.response.ApiResponse;
import com.A409.backend.global.security.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/owners/my")
@RequiredArgsConstructor
public class OwnerController {

    private final OwnerService ownerService;


    @GetMapping
    public ApiResponse<?> getOwnerInfo(@AuthenticationPrincipal User user){

        log.info(String.valueOf(user.getId()));
        OwnerResponse ownerResponse = ownerService.getOwnerInfo(user.getId());

        return ApiResponse.ofSuccess(ownerResponse);
    }

    @PatchMapping
    public ApiResponse<?> updateOwnerInfo(@AuthenticationPrincipal User user,@RequestBody OwnerRequest ownerRequest){

        ownerService.updateOwnerInfo(user.getId(),ownerRequest);

        return ApiResponse.ofSuccess(null);
    }

}
