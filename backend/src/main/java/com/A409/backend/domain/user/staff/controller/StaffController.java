package com.A409.backend.domain.user.staff.controller;

import com.A409.backend.domain.user.staff.dto.StaffRequest;
import com.A409.backend.domain.user.staff.dto.StaffResponse;
import com.A409.backend.domain.user.staff.service.StaffService;
import com.A409.backend.global.response.APIResponse;
import com.A409.backend.global.security.model.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/staffs")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    @Operation(summary = "병원관계자 정보 조회")
    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = StaffResponse.class)))
    @GetMapping("/mypage")
    public APIResponse<?> getStaffInfo(@AuthenticationPrincipal User user){
        StaffResponse staffResponse = staffService.getStaffInfo(user.getId());

        return APIResponse.ofSuccess(staffResponse);
    }

    @Operation(summary = "병원관계자 정보 수정")
    @PatchMapping("/mypage")
    public APIResponse<?> updateStaffInfo(@AuthenticationPrincipal User user, @RequestBody StaffRequest staffRequest){
        staffService.updateStaffInfo(user.getId() ,staffRequest);
        return APIResponse.ofSuccess(null);
    }
}
