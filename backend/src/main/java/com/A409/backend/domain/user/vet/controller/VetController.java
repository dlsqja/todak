package com.A409.backend.domain.user.vet.controller;

import com.A409.backend.domain.hospital.dto.HospitalRequest;
import com.A409.backend.domain.hospital.dto.HospitalResponse;
import com.A409.backend.domain.hospital.service.HospitalService;
import com.A409.backend.global.response.APIResponse;
import com.A409.backend.domain.user.vet.dto.VetUpdateRequest;
import com.A409.backend.domain.user.vet.service.VetService;
import com.A409.backend.global.security.model.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/vets")
@RequiredArgsConstructor
public class VetController {

    private final VetService vetService;
    private final HospitalService hospitalService;

    @Operation(summary = "수의사 상세 조회", description = "마이페이지에 보여주기 위해 수의사의 상세정보를 가지고 옵니다.")
    @ApiResponse(responseCode = "200", description = "수의사 상세조회 성공")
    @GetMapping("/my")
    public APIResponse<?> getVet(@AuthenticationPrincipal User user) {

        return APIResponse.ofSuccess(vetService.getVetById(user.getId()));
    }

    @Operation(summary = "수의사 정보 수정", description = "수의사 마이페이지를 수정합니다.")
    @ApiResponse(responseCode = "200", description = "수의사 정보 수정 성공")
    @PostMapping(path = "/my", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public APIResponse<?> updateVet(@AuthenticationPrincipal User user,
                                    @RequestPart VetUpdateRequest vetUpdateRequest,
                                    @RequestPart(value = "photo", required = false) MultipartFile photo) {
        vetService.updateVet(user.getId(), vetUpdateRequest, photo);
        return APIResponse.ofSuccess(null);
    }

    @Operation(summary = "수의사가 병원 정보 조회")
    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = HospitalResponse.class)))
    @GetMapping("/hospitals")
    public APIResponse<?> getHospitalDetail(@AuthenticationPrincipal User user){

        Long vetId = user.getId();
        HospitalResponse hospitalResponse = hospitalService.getHospitalDetailByVetId(vetId);

        return APIResponse.ofSuccess(hospitalResponse);
    }

    @Operation(summary = "수의사가 병원 정보 수정")
    @PatchMapping("/hospitals")
    public APIResponse<?> updateHospital(@AuthenticationPrincipal User user, @RequestBody HospitalRequest hospitalRequest){

        Long vetId = user.getId();
        hospitalService.updateHospitalByVetId(vetId,hospitalRequest);

        return APIResponse.ofSuccess(null);
    }
}
