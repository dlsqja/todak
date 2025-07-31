package com.A409.backend.domain.user.vet.controller;

import com.A409.backend.domain.user.vet.dto.VetRequest;
import com.A409.backend.domain.user.vet.entity.Vet;
import com.A409.backend.domain.user.vet.service.VetService;
import com.A409.backend.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/vets")
@RequiredArgsConstructor
public class VetController {

    private final VetService vetService;

    @Operation(summary = "수의사 회원가입", description = "새로운 수의사를 등록합니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "회원가입 성공")
    @PostMapping("/signup")
    public ApiResponse<?> signup(@RequestBody VetRequest vetRequest) {
        Vet newvet = vetService.insertVet(vetRequest);
        return ApiResponse.ofSuccess(newvet);
    }


}
