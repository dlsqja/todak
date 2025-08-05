package com.A409.backend.domain.home.controller;

import com.A409.backend.domain.user.owner.dto.OwnerRequest;
import com.A409.backend.domain.user.owner.service.OwnerService;
import com.A409.backend.domain.user.staff.service.StaffService;
import com.A409.backend.domain.user.staff.dto.StaffRequest;
import com.A409.backend.domain.user.vet.service.VetService;
import com.A409.backend.global.response.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/public/signup")
@RequiredArgsConstructor
public class SignupController {

    private final OwnerService ownerService;
    private final VetService vetService;
    private final StaffService staffService;

    @PostMapping("/owner")
    public APIResponse<?> ownerSignup(@RequestParam Long authId, @RequestBody OwnerRequest ownerRequest) {
        ownerService.insertOwnerInfo(authId, ownerRequest);
        return APIResponse.ofSuccess(null);
    }

    /*
    @PostMapping("/vet")
    public ApiResponse<?> vetSignup(@RequestParam Long authId, @RequestBody VetRequest vetRequest) {
        vetService.insertVetInfo(authId, vetRequest);
        return ApiResponse.ofSuccess(null);
    }

    */
    @PostMapping("/staff")
    public APIResponse<?> signup(@RequestParam Long authId, @RequestBody StaffRequest staffRequest) {
        staffService.insertStaffInfo(authId, staffRequest);
        return APIResponse.ofSuccess(null);
    }
}
