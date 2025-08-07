package com.A409.backend.domain.treatment.controller;

import com.A409.backend.domain.hospital.dto.HospitalResponse;
import com.A409.backend.domain.reservation.entity.Reservation;
import com.A409.backend.domain.treatment.entity.Treatment;
import com.A409.backend.domain.treatment.entity.TreatmentResponse;
import com.A409.backend.domain.treatment.service.TreatmentService;
import com.A409.backend.domain.user.vet.dto.VetWorkingHourResponse;
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

import java.util.List;
import java.util.Map;

@RequestMapping("/treatments/vets")
@RestController
@RequiredArgsConstructor
public class VetTreatmentController {

    private final TreatmentService treatmentService;

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

}
