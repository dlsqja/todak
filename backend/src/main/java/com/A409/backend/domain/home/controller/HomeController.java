package com.A409.backend.domain.home.controller;

import com.A409.backend.domain.hospital.dto.HospitalResponse;
import com.A409.backend.domain.hospital.service.HospitalService;
import com.A409.backend.domain.user.vet.dto.VetResponse;
import com.A409.backend.domain.user.vet.service.VetService;
import com.A409.backend.global.response.APIResponse;
import com.A409.backend.global.util.uploader.S3Uploader;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/public")
@RequiredArgsConstructor
public class HomeController {

    private final HospitalService hospitalService;
    private final VetService vetService;
    private final S3Uploader s3Uploader;

    @GetMapping("/")
    public APIResponse<?> home() {
        return APIResponse.ofSuccess("A409팀입니다 ㄱ-");
    }


    @Operation(summary = "병원 리스트 조회")
    @ApiResponse(responseCode = "200",
            content = @Content(
                    mediaType = "application/json",
                    array = @ArraySchema(schema = @Schema(implementation = HospitalResponse.class))
            )
    )
    @GetMapping("/hospitals")
    public APIResponse<?> getHospitals() {

        List<HospitalResponse> hospitals = hospitalService.getHospitals();
        return APIResponse.ofSuccess(hospitals);
    }

    @Operation(summary = "수의사 리스트 조회")
    @ApiResponse(responseCode = "200",
            content = @Content(
                    mediaType = "application/json",
                    array = @ArraySchema(schema = @Schema(implementation = VetResponse.class))
            )
    )
    @GetMapping("/hospitals/{hospital_id}/vets")
    public APIResponse<?> getVetsByHospitalId(@PathVariable("hospital_id")Long hospitalId) {

        List<VetResponse> vets = vetService.getVetsByHospitalId(hospitalId);
        return APIResponse.ofSuccess(vets);
    }
}