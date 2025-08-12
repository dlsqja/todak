package com.A409.backend.domain.user.vet.controller;

import com.A409.backend.global.response.APIResponse;
import com.A409.backend.domain.user.vet.dto.VetUpdateRequest;
import com.A409.backend.domain.user.vet.service.VetService;
import com.A409.backend.global.security.model.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/vets")
@RequiredArgsConstructor
public class VetController {

    private final VetService vetService;

    @Operation(summary = "수의사 상세 조회", description = "마이페이지에 보여주기 위해 수의사의 상세정보를 가지고 옵니다.")
    @ApiResponse(responseCode = "200", description = "수의사 상세조회 성공")
    @GetMapping("/my")
    public APIResponse<?> getVet(@AuthenticationPrincipal User user) {

        return APIResponse.ofSuccess(vetService.getVetById(user.getId()));
    }

    @Operation(summary = "수의사 정보 수정", description = "수의사 마이페이지를 수정합니다.")
    @ApiResponse(responseCode = "200", description = "수의사 정보 수정 성공")
    @PostMapping("/my")
    public APIResponse<?> updateVet(@AuthenticationPrincipal User user, @RequestBody VetUpdateRequest vetUpdateRequest) {
        vetService.updateVet(user.getId(), vetUpdateRequest);
        return APIResponse.ofSuccess(null);
    }
}
