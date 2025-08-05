package com.A409.backend.domain.hospital.controller;

import com.A409.backend.domain.hospital.dto.HospitalRequest;
import com.A409.backend.domain.hospital.dto.HospitalResponse;
import com.A409.backend.domain.hospital.service.HospitalService;
import com.A409.backend.domain.user.staff.dto.StaffResponse;
import com.A409.backend.domain.user.vet.service.VetService;
import com.A409.backend.global.enums.ErrorCode;
import com.A409.backend.global.exception.CustomException;
import com.A409.backend.global.response.APIResponse;
import com.A409.backend.global.security.model.User;
import com.A409.backend.global.redis.RedisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hospitals")
@RequiredArgsConstructor
public class HospitalController {

    private final HospitalService hospitalService;
    private final RedisService redisService;
    private final VetService vetService;

    @Operation(summary = "병원 정보 조회")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = HospitalResponse.class)))
    @GetMapping()
    public APIResponse<?> getHospitalDetail(@AuthenticationPrincipal User user){

        Long hospitalId = user.getId();
        HospitalResponse hospitalResponse = hospitalService.getHospitalDetail(hospitalId);

        return APIResponse.ofSuccess(hospitalResponse);
    }

    @Operation(summary = "병원 정보 수정")
    @PatchMapping()
    public APIResponse<?> updateHospital(@AuthenticationPrincipal User user, @RequestBody HospitalRequest hospitalRequest){

        Long hospitalId = user.getId();
        hospitalService.updateHospital(hospitalId,hospitalRequest);

        return APIResponse.ofSuccess(null);
    }

    @Operation(summary = "병원 관리자 목록 조회")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200",
            content = @Content(
                    mediaType = "application/json",
                    array = @ArraySchema(schema = @Schema(implementation = StaffResponse.class))
            )
    )
    @GetMapping("/staffs")
    public APIResponse<?> getHospitalStaffs(@AuthenticationPrincipal User user){

        Long hospitalId = user.getId();
        List<StaffResponse> hospitalResponse = hospitalService.getHospitalStaffs(hospitalId);

        return APIResponse.ofSuccess(hospitalResponse);
    }

    @Operation(summary = "수의사 불가능 시간 조회")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200",
            content = @Content(
                    mediaType = "application/json",
                    array = @ArraySchema(schema = @Schema(implementation = Integer.class))
            )
    )
    @GetMapping("/{vet_id}/closing-hours")
    public APIResponse<?> getClosingHours(@AuthenticationPrincipal User user, @PathVariable("vet_id") Long vetId) {
        Long hospitalId = user.getId();

        Long hospitalIdByVetId = vetService.getHospitalIdByVetId(vetId);
        if(hospitalId!=hospitalIdByVetId) {
            throw new CustomException(ErrorCode.ACCESS_DENIED);
        }

        String cacheKey = "closinghours:" + vetId;

        List<Integer> cachedTimes = (List<Integer>) redisService.getByKey(cacheKey);

        return APIResponse.ofSuccess(cachedTimes);
    }

    @Operation(summary = "수의사 불가능 시간 수정")
    @PostMapping("/{vet_id}/closing-hours")
    public APIResponse<?> updateClosingHours(@AuthenticationPrincipal User user, @PathVariable("vet_id") Long vetId, @RequestBody List<Integer> closingTimes) {

        Long hospitalId = user.getId();

        Long hospitalIdByVetId = vetService.getHospitalIdByVetId(vetId);
        if(hospitalId!=hospitalIdByVetId) {
            throw new CustomException(ErrorCode.ACCESS_DENIED);
        }

        String cacheKey = "closinghours:" + vetId;

        redisService.setByKey(cacheKey,closingTimes);

        return APIResponse.ofSuccess(null);
    }

    @GetMapping("/working-hours")
    public APIResponse<?> getWorkingHours(@AuthenticationPrincipal User user) {
        return null;
    }
    @PostMapping("/{vet_id}/working-hours")
    public APIResponse<?> getWorkingHours(@AuthenticationPrincipal User user, @PathVariable("vet_id") Long vetId) {
        return null;
    }
}
