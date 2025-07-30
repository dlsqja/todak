package com.A409.backend.domain.treatment.controller;

import com.A409.backend.global.response.ApiResponse;
import com.A409.backend.global.security.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/treatment/owner")
@RestController
@RequiredArgsConstructor
public class OwnerTreatmentController {


    @GetMapping
    public ApiResponse<?> getTreatments(@AuthenticationPrincipal User user){

    }
}
