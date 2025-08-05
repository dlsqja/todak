package com.A409.backend.domain.treatment.controller;

import com.A409.backend.domain.treatment.service.TreatmentService;
import com.A409.backend.global.response.APIResponse;
import com.A409.backend.global.security.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RequestMapping("/treatment/owner")
@RestController
@RequiredArgsConstructor
public class OwnerTreatmentController {

    private final TreatmentService treatmentService;

    @GetMapping
    public APIResponse<?> getTreatments(@AuthenticationPrincipal User user){

        List<Map<String,Object>> treatments = treatmentService.getTreatments(user.getId());

        return APIResponse.ofSuccess(treatments);
    }
}
