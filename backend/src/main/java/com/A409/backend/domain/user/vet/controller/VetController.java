package com.A409.backend.domain.user.vet.controller;

import com.A409.backend.domain.reservation.entity.Reservation;
import com.A409.backend.domain.reservation.service.ReservationService;
import com.A409.backend.domain.user.vet.dto.VetRequest;
import com.A409.backend.domain.user.vet.dto.VetUpdateRequest;
import com.A409.backend.domain.user.vet.entity.Vet;
import com.A409.backend.domain.user.vet.dto.VetRequest;
import com.A409.backend.domain.user.vet.entity.Vet;
import com.A409.backend.domain.user.vet.service.VetService;
import com.A409.backend.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/vets")
@RequiredArgsConstructor
public class VetController {

    private final VetService vetService;
    private final ReservationService reservationService;

//    @Operation(summary = "수의사 회원가입", description = "새로운 수의사를 등록합니다.")
//    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "회원가입 성공")
//    @PostMapping("/signup")
//    public ApiResponse<?> signup(@RequestBody VetRequest vetRequest) {
//        Vet newvet = vetService.insertVet(vetRequest);
//        return ApiResponse.ofSuccess(newvet);
//    }

    @Operation(summary = "수의사 상세 조회", description = "마이페이지에 보여주기 위해 수의사의 상세정보를 가지고 옵니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "수의사 상세조회 성공")
//    @GetMapping("/my")
    @GetMapping("/my/{vet_id}")
//    public ApiResponse<?> getVet(@AuthenticationPrincipal Vet vet) {
    public ApiResponse<?> getVet(@PathVariable("vet_id") Long vetId) {
//        return ApiResponse.ofSuccess(vetService.getVetById(vet.getVetId()));
        return ApiResponse.ofSuccess(vetService.getVetById(vetId));
    }

    @Operation(summary = "수의사 정보 수정", description = "수의사 마이페이지를 수정합니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "수의사 정보 수정 성공")
//    @PostMapping("/my")
    @PostMapping("/my/{vet_id}")
//    public void updateVet(@AuthenticationPrincipal Vet vet, @RequestBody VetRequest vetRequest) {
    public ApiResponse<?> updateVet(@PathVariable("vet_id") Long vetId, @RequestBody VetUpdateRequest vetUpdateRequest) {
        vetService.updateVet(vetId, vetUpdateRequest);
        return ApiResponse.ofSuccess(null);
    }
}
