package com.A409.backend.domain.hospital.controller;

import com.A409.backend.domain.hospital.dto.HospitalRequest;
import com.A409.backend.domain.hospital.dto.HospitalResponse;
import com.A409.backend.domain.hospital.service.HospitalService;
import com.A409.backend.domain.user.staff.dto.StaffResponse;
import com.A409.backend.domain.user.vet.service.VetService;
import com.A409.backend.global.enums.ErrorCode;
import com.A409.backend.global.exception.CustomException;
import com.A409.backend.global.response.ApiResponse;
import com.A409.backend.global.security.model.User;
import com.A409.backend.global.util.redis.RedisService;
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

    @GetMapping()
    public ApiResponse<?> getHospitalDetail(@AuthenticationPrincipal User user){

        Long hospitalId = user.getId();
        HospitalResponse hospitalResponse = hospitalService.getHospitalDetail(hospitalId);

        return ApiResponse.ofSuccess(hospitalResponse);
    }

    @PatchMapping()
    public ApiResponse<?> updateHospital(@AuthenticationPrincipal User user, @RequestBody HospitalRequest hospitalRequest){

        Long hospitalId = user.getId();
        hospitalService.updateHospital(hospitalId,hospitalRequest);

        return ApiResponse.ofSuccess(null);
    }

    @GetMapping("/staffs")
    public ApiResponse<?> getHospitalStaffs(@AuthenticationPrincipal User user){

        Long hospitalId = user.getId();
        List<StaffResponse> hospitalResponse = hospitalService.getHospitalStaffs(hospitalId);

        return ApiResponse.ofSuccess(hospitalResponse);
    }

    @GetMapping("/{vet_id}/closing-hours")
    public ApiResponse<?> getClosingHours(@AuthenticationPrincipal User user, @PathVariable("vet_id") Long vetId) {
        Long hospitalId = user.getId();

        Long hospitalIdByVetId = vetService.getHospitalIdByVetId(vetId);
        if(hospitalId!=hospitalIdByVetId) {
            throw new CustomException(ErrorCode.ACCESS_DENIED);
        }

        String cacheKey = "closinghours:" + vetId;

        List<Integer> cachedTimes = (List<Integer>) redisService.getByKey(cacheKey);

        return ApiResponse.ofSuccess(cachedTimes);
    }

    @PostMapping("/{vet_id}/closing-hours")
    public ApiResponse<?> updateClosingHours(@AuthenticationPrincipal User user, @PathVariable("vet_id") Long vetId,@RequestBody List<Integer> closingTimes) {

        Long hospitalId = user.getId();

        Long hospitalIdByVetId = vetService.getHospitalIdByVetId(vetId);
        if(hospitalId!=hospitalIdByVetId) {
            throw new CustomException(ErrorCode.ACCESS_DENIED);
        }

        String cacheKey = "closinghours:" + vetId;

        redisService.setByKey(cacheKey,closingTimes);

        return ApiResponse.ofSuccess(null);
    }
}
