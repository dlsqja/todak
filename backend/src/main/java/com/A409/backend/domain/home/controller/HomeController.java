package com.A409.backend.domain.home.controller;

import com.A409.backend.global.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/public")
public class HomeController {
    
    @GetMapping("/")
    public ApiResponse<?> home() {
        return ApiResponse.ofSuccess("A409팀입니다 ㄱ-");
    }

    @GetMapping("/hospitals")
    public ApiResponse<?> getHospitals() {

        return ApiResponse.ofSuccess("A409팀입니다 ㄱ-");
    }

    @GetMapping("/hospitals/{hospital_id}/vets")
    public ApiResponse<?> getVetsByHospitalId() {
        return ApiResponse.ofSuccess("A409팀입니다 ㄱ-");
    }
}