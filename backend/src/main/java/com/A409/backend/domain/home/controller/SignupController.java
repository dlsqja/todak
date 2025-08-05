package com.A409.backend.domain.home.controller;

import com.A409.backend.domain.user.owner.dto.OwnerRequest;
import com.A409.backend.domain.user.owner.service.OwnerService;
import com.A409.backend.domain.user.staff.service.StaffService;
import com.A409.backend.domain.user.staff.dto.StaffRequest;
import com.A409.backend.domain.user.vet.dto.VetRequest;
import com.A409.backend.domain.user.vet.service.VetService;
import com.A409.backend.global.response.APIResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/public/signup")
@RequiredArgsConstructor
public class SignupController {

    private final OwnerService ownerService;
    private final VetService vetService;
    private final StaffService staffService;

    @Operation(summary = "반려인 회원가입")
    @PostMapping("/owner")
    public APIResponse<?> ownerSignup(@RequestParam Long authId, @RequestBody OwnerRequest ownerRequest) {
        ownerService.insertOwnerInfo(authId, ownerRequest);
        return APIResponse.ofSuccess(null);
    }

    @Operation(summary = "수의사 회원가입")
    @PostMapping("/vet")
    public APIResponse<?> vetSignup(@RequestParam Long authId, @RequestBody VetRequest vetRequest) {
        vetService.insertVetInfo(authId, vetRequest);
        return APIResponse.ofSuccess(null);
    }

    @Operation(summary = "병원관계자 회원가입")
    @PostMapping("/staff")
    public APIResponse<?> signup(@RequestParam Long authId, @RequestBody StaffRequest staffRequest) {
        staffService.insertStaffInfo(authId, staffRequest);
        return APIResponse.ofSuccess(null);
    }
}
