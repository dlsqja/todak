package com.A409.backend.domain.home.controller;

import com.A409.backend.domain.hospital.dto.HospitalResponse;
import com.A409.backend.domain.hospital.service.HospitalService;
import com.A409.backend.domain.reservation.dto.ReservationReqeust;
import com.A409.backend.domain.user.vet.dto.VetResponse;
import com.A409.backend.domain.user.vet.service.VetService;
import com.A409.backend.global.response.ApiResponse;
import com.A409.backend.global.security.model.User;
import com.A409.backend.global.util.uploader.S3Uploader;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/public")
@RequiredArgsConstructor
public class HomeController {

    private final HospitalService hospitalService;
    private final VetService vetService;
    private final S3Uploader s3Uploader;
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
    public ApiResponse<?> getVetsByHospitalId(@PathVariable("hospital_id")Long hospitalId) {

        List<VetResponse> vets = vetService.getVetsByHospitalId(hospitalId);
        return ApiResponse.ofSuccess(vets);
    }
}