package com.A409.backend.domain.treatment.controller;

import com.A409.backend.domain.treatment.service.TreatmentService;
import com.A409.backend.global.response.APIResponse;
import com.A409.backend.global.security.model.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RequestMapping("/treatments/owner")
@RestController
@RequiredArgsConstructor
public class OwnerTreatmentController {

    private final TreatmentService treatmentService;

    @Operation(summary = "진료 리스트 조회")
    @ApiResponse(responseCode = "200",
            content = @Content(
                    mediaType = "application/json",
                    array = @ArraySchema(schema = @Schema(implementation = Map.class))
            )
    )
    @GetMapping
    public APIResponse<?> getTreatments(@AuthenticationPrincipal User user){

        List<Map<String,Object>> treatments = treatmentService.getTreatments(user.getId());

        return APIResponse.ofSuccess(treatments);
    }
}
