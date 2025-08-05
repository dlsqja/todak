package com.A409.backend.domain.user.owner.controller;

import com.A409.backend.domain.user.owner.dto.OwnerRequest;
import com.A409.backend.domain.user.owner.dto.OwnerResponse;
import com.A409.backend.domain.user.owner.service.OwnerService;
import com.A409.backend.domain.user.staff.dto.StaffResponse;
import com.A409.backend.global.response.APIResponse;
import com.A409.backend.global.security.model.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/owners/my")
@RequiredArgsConstructor
public class OwnerController {

    private final OwnerService ownerService;

    @Operation(summary = "반려인 정보 조회")
    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = OwnerResponse.class)))

    @GetMapping
    public APIResponse<?> getOwnerInfo(@AuthenticationPrincipal User user){

        log.info(String.valueOf(user.getId()));
        OwnerResponse ownerResponse = ownerService.getOwnerInfo(user.getId());

        return APIResponse.ofSuccess(ownerResponse);
    }

    @Operation(summary = "반려인 정보 수정")
    @PatchMapping
    public APIResponse<?> updateOwnerInfo(@AuthenticationPrincipal User user, @RequestBody OwnerRequest ownerRequest){

        ownerService.updateOwnerInfo(user.getId(),ownerRequest);

        return APIResponse.ofSuccess(null);
    }

}
