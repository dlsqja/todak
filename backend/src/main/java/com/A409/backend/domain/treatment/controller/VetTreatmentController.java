package com.A409.backend.domain.treatment.controller;

import com.A409.backend.domain.hospital.dto.HospitalResponse;
import com.A409.backend.domain.reservation.entity.Reservation;
import com.A409.backend.domain.treatment.entity.Treatment;
import com.A409.backend.domain.treatment.entity.TreatmentResponse;
import com.A409.backend.domain.treatment.service.TreatmentService;
import com.A409.backend.domain.user.vet.dto.VetWorkingHourResponse;
import com.A409.backend.global.ai.AIClient;
import com.A409.backend.global.enums.ErrorCode;
import com.A409.backend.global.redis.RedisService;
import com.A409.backend.global.response.APIResponse;
import com.A409.backend.global.security.model.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RequestMapping("/treatments/vets")
@RestController
@RequiredArgsConstructor
public class VetTreatmentController {

    private final TreatmentService treatmentService;
    private final AIClient aiClient;
    private final RedisService redisService;

    @Operation(summary = "수의사 진료 필터링 조회")
    @ApiResponse(responseCode = "200",
            content = @Content(
                    mediaType = "application/json",
                    array = @ArraySchema(schema = @Schema(implementation = Map.class))
            )
    )
    @GetMapping("/history")
    public APIResponse<?> getVetTreatmentHistory(@AuthenticationPrincipal User user, @RequestParam Integer type) {
        List<Map<String, Object>> treatments = treatmentService.getTreatmentsByVetIdAndType(user.getId(),type);
        return APIResponse.ofSuccess(treatments);
    }

    @Operation(summary = "수의사 진료 상세 조회")
    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = TreatmentResponse.class)))
    @GetMapping("/details/{treatment_id}")
    public APIResponse<?> getVetTreatmentDetails(@AuthenticationPrincipal User user, @PathVariable Long treatment_id) {
        TreatmentResponse treatmentResponse = treatmentService.getTreatmentById(user.getId(), treatment_id);
        return APIResponse.ofSuccess(treatmentResponse);
    }

    @Operation(summary = "진료종료 후 음성 파일 위치 전송")
    @PostMapping("/audio/{treatment_id}")
    public APIResponse<?> uploadAudio(@PathVariable("treatment_id") Long treatmentId) {

        //aiClient.uploadAudio(treatmentId);

        return APIResponse.ofSuccess(null);
    }
    @Operation(summary = "수의사 비대면 진료 시작", description = "비대면 진료 버튼을 누르면, session을 생성합니다.")
    @PostMapping("/start/{treatment_id}")
    public APIResponse<?> startTreatment(@PathVariable("treatment_id") Integer treatment_id) {
        String cacheKey = "treatment" + treatment_id;
        redisService.setByKey(cacheKey, 1);
        return APIResponse.ofSuccess(null);
    }

    @Operation(summary = "수의사 비대면 진료 종료", description = "통화 종료 버튼을 누르면, session을 삭제합니다.")
    @DeleteMapping("/end/{treatment_id}")
    public APIResponse<?> endTreatment(@PathVariable("treatment_id") Integer treatment_id) {
        String cacheKey = "treatment" + treatment_id;
        redisService.deleteByKey(cacheKey);
        return APIResponse.ofSuccess(null);
    }

}
