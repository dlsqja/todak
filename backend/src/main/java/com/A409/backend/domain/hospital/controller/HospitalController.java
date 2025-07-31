package com.A409.backend.domain.hospital.controller;

import com.A409.backend.domain.hospital.dto.HospitalRequest;
import com.A409.backend.domain.hospital.dto.HospitalResponse;
import com.A409.backend.domain.hospital.service.HospitalService;
import com.A409.backend.domain.user.staff.dto.StaffResponse;
import com.A409.backend.global.response.ApiResponse;
import com.A409.backend.global.security.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hospitals")
@RequiredArgsConstructor
public class HospitalController {

    private final HospitalService hospitalService;

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
}
