package com.A409.backend.domain.treatment.controller;

import com.A409.backend.domain.treatment.service.TreatmentService;
import com.A409.backend.global.response.ApiResponse;
import com.A409.backend.global.security.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RequestMapping("/treatments/vets")
@RestController
@RequiredArgsConstructor
public class VetTreatmentController {

    TreatmentService treatmentService;

    @GetMapping("/history")
    public ApiResponse<?> getVetTreatmentHistory(@AuthenticationPrincipal User user) {
        List<Map<String, Object>> treatments = treatmentService.getTreatmentsByVetId(user.getId());
        return ApiResponse.ofSuccess(treatments);
    }
}
