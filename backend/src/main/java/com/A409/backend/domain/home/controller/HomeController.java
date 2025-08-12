package com.A409.backend.domain.home.controller;

import com.A409.backend.domain.hospital.dto.HospitalResponse;
import com.A409.backend.domain.hospital.service.HospitalService;
import com.A409.backend.domain.user.vet.dto.VetResponse;
import com.A409.backend.domain.user.vet.service.VetService;
import com.A409.backend.global.ai.AIClient;
import com.A409.backend.global.annotation.LogExecutionTime;
import com.A409.backend.global.elasticsearch.Entity.HospitalDocument;
import com.A409.backend.global.elasticsearch.service.ElasticService;
import com.A409.backend.global.enums.ErrorCode;
import com.A409.backend.global.exception.CustomException;
import com.A409.backend.global.rabbitmq.SttRequestProducer;
import com.A409.backend.global.redis.RedisService;
import com.A409.backend.global.response.APIResponse;
import com.A409.backend.global.security.model.User;
import com.A409.backend.global.util.uploader.S3Uploader;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
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



    @Operation(summary = "수의사 불가능 시간 조회")
    @ApiResponse(responseCode = "200",
            content = @Content(
                    mediaType = "application/json",
                    array = @ArraySchema(schema = @Schema(implementation = Integer.class))
            )
    )
    @GetMapping("/{vet_id}/closing-hours")
    public APIResponse<?> getClosingHours(@PathVariable("vet_id") Long vetId) {

        String cacheKey = "closinghours:" + vetId;

        List<Integer> cachedTimes = (List<Integer>) redisService.getByKey(cacheKey);
        if(cachedTimes==null){
            cachedTimes = new ArrayList<>();
        }
        return APIResponse.ofSuccess(cachedTimes);
    }

    @Operation(summary = "자동완성")
    @ApiResponse(responseCode = "200",
            content = @Content(
                    mediaType = "application/json",
                    array = @ArraySchema(schema = @Schema(implementation = HospitalDocument.class))
            )
    )
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