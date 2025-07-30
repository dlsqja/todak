package com.A409.backend.domain.home.controller;

import com.A409.backend.domain.hospital.dto.HospitalResponse;
import com.A409.backend.domain.hospital.service.HospitalService;
import com.A409.backend.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/public")
@RequiredArgsConstructor
public class HomeController {

    private final HospitalService hospitalService;
    
    @GetMapping("/")
    public ApiResponse<?> home() {
        return ApiResponse.ofSuccess("A409팀입니다 ㄱ-");
    }

    @GetMapping("/hospitals")
    public ApiResponse<?> getHospitals() {

        List<HospitalResponse> hospitals = hospitalService.getHospitals();
        return ApiResponse.ofSuccess(hospitals);
    }

    @GetMapping("/hospitals/{hospital_id}/vets")
    public ApiResponse<?> getVetsByHospitalId() {
        return ApiResponse.ofSuccess("A409팀입니다 ㄱ-");
    }
}