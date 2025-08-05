package com.A409.backend.domain.user.vet.controller;

import com.A409.backend.domain.user.vet.dto.WorkingHourResponse;
import com.A409.backend.domain.user.vet.service.WorkingHourService;
import com.A409.backend.global.response.APIResponse;
import com.A409.backend.domain.reservation.service.ReservationService;
import com.A409.backend.domain.user.vet.dto.VetUpdateRequest;
import com.A409.backend.domain.user.vet.service.VetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/vets")
@RequiredArgsConstructor
public class VetController {

    private final VetService vetService;
    private final ReservationService reservationService;
    private final WorkingHourService workingHourService;

    @Operation(summary = "수의사 업무시간 조회")
    @ApiResponse(responseCode = "200",
            content = @Content(
                    mediaType = "application/json",
                    array = @ArraySchema(schema = @Schema(implementation = WorkingHourResponse.class))
            )
    )
    @GetMapping("/{vet_id}/working-hours")
    public APIResponse<?> getWorkingHours(@PathVariable("vet_id") Long vetId) {
        List<WorkingHourResponse> workingHours = workingHourService.getWorkingHourByVetId(vetId);

        return APIResponse.ofSuccess(workingHours);
    }

    @Operation(summary = "수의사 상세 조회", description = "마이페이지에 보여주기 위해 수의사의 상세정보를 가지고 옵니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "수의사 상세조회 성공")
//    @GetMapping("/my")
    @GetMapping("/my/{vet_id}")
//    public ApiResponse<?> getVet(@AuthenticationPrincipal Vet vet) {
    public APIResponse<?> getVet(@PathVariable("vet_id") Long vetId) {
//        return ApiResponse.ofSuccess(vetService.getVetById(vet.getVetId()));
        return APIResponse.ofSuccess(vetService.getVetById(vetId));
    }

    @Operation(summary = "수의사 정보 수정", description = "수의사 마이페이지를 수정합니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "수의사 정보 수정 성공")
//    @PostMapping("/my")
    @PostMapping("/my/{vet_id}")
//    public void updateVet(@AuthenticationPrincipal Vet vet, @RequestBody VetRequest vetRequest) {
    public APIResponse<?> updateVet(@PathVariable("vet_id") Long vetId, @RequestBody VetUpdateRequest vetUpdateRequest) {
        vetService.updateVet(vetId, vetUpdateRequest);
        return APIResponse.ofSuccess(null);
    }
}
