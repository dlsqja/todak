package com.A409.backend.domain.treatment.controller;

import com.A409.backend.domain.treatment.service.TreatmentService;
import com.A409.backend.domain.user.vet.dto.VetResponse;
import com.A409.backend.global.ai.STTData;
import com.A409.backend.global.enums.ErrorCode;
import com.A409.backend.global.exception.CustomException;
import com.A409.backend.global.rabbitmq.SttRequestProducer;
import com.A409.backend.global.redis.RedisService;
import com.A409.backend.global.response.APIResponse;
import com.A409.backend.global.security.model.User;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequestMapping("/treatments/owner")
@RestController
@RequiredArgsConstructor
public class OwnerTreatmentController {

    private final TreatmentService treatmentService;
    private final SttRequestProducer sttRequestProducer;
    private final ObjectMapper objectMapper;
    private final RedisService redisService;;

    @Operation(summary = "진료 리스트 조회")
    @ApiResponse(responseCode = "200",
            content = @Content(
                    mediaType = "application/json",
                    array = @ArraySchema(schema = @Schema(implementation = Map.class))
            )
    )
    @GetMapping("")
    public APIResponse<?> getTreatments(@AuthenticationPrincipal User user,@RequestParam Integer type){

        List<Map<String,Object>> treatments = treatmentService.getTreatmentsByOwnerIdAndType(user.getId(),type);

        return APIResponse.ofSuccess(treatments);
    }

    @Operation(summary = "최근 진료 의사 리스트")
    @ApiResponse(responseCode = "200",
            content = @Content(
                    mediaType = "application/json",
                    array = @ArraySchema(schema = @Schema(implementation = VetResponse.class))
            )
    )
    @GetMapping("/recent")
    public APIResponse<?> getTreatments(@AuthenticationPrincipal User user){

        List<VetResponse> treatments = treatmentService.getRencetTreatments(user.getId());

        return APIResponse.ofSuccess(treatments);
    }

    @Operation(summary = "반려인 비대면 진료 시작", description = "비대면 진료 버튼을 누르면, session을 확입합니다.")
    @PatchMapping("/start/{treatment_id}")
    public APIResponse<?> startTreatment(@PathVariable("treatment_id") Integer treatment_id) {
        String cacheKey = "treatment" + treatment_id;
        Integer cachedNum = (Integer) redisService.getByKey(cacheKey);
        if (cachedNum == null || cachedNum != 1)
            throw new CustomException(ErrorCode.SESSION_NOT_FOUND);
        redisService.setByKey(cacheKey, 2);
        return APIResponse.ofSuccess(null);
    }
}
