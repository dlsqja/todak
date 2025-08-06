package com.A409.backend.domain.home.controller;

import com.A409.backend.domain.hospital.dto.HospitalResponse;
import com.A409.backend.domain.hospital.service.HospitalService;
import com.A409.backend.domain.user.vet.dto.VetResponse;
import com.A409.backend.domain.user.vet.service.VetService;
import com.A409.backend.global.annotation.LogExecutionTime;
import com.A409.backend.global.elasticsearch.Entity.HospitalDocument;
import com.A409.backend.global.elasticsearch.service.ElasticService;
import com.A409.backend.global.redis.RedisService;
import com.A409.backend.global.response.APIResponse;
import com.A409.backend.global.util.uploader.S3Uploader;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/public")
@RequiredArgsConstructor
@Slf4j
public class HomeController {

    private final HospitalService hospitalService;
    private final VetService vetService;
    private final ElasticService elasticService;
    private final RedisService redisService;
    private static final long CACHE_TTL_MINUTES = 5;

    @Operation(summary = "인덱스 페이지")
    @GetMapping()
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


    @GetMapping("/autocomplete/{keyword}")
    @LogExecutionTime
    public APIResponse<?> autocomplete(@PathVariable String keyword) {
        String cacheKey = "autocomplete:" + keyword;

        Object cached = redisService.getByKey(cacheKey);
        if (cached != null) {
            log.info("Cache hit for keyword: {}", keyword);

            return APIResponse.ofSuccess(cached);
        }

        List<HospitalDocument> result = elasticService.autocompleteByName(keyword);

        if (result != null) {
            redisService.setByKeyWithTTL(cacheKey, result,CACHE_TTL_MINUTES);
        }

        return APIResponse.ofSuccess(result);
    }
}