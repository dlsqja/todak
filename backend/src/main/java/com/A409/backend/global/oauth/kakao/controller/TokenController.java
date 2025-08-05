package com.A409.backend.global.oauth.kakao.controller;

import com.A409.backend.global.enums.ErrorCode;
import com.A409.backend.global.enums.Role;
import com.A409.backend.global.response.APIResponse;
import com.A409.backend.global.security.jwt.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class TokenController {

    private final JwtService jwtService;

    @Operation(summary = "토큰 재발급")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = Map.class)))
    @PostMapping("/refresh")
    public APIResponse<?> refresh(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refresh_token");

        if(!jwtService.validateToken(refreshToken)) {
            return APIResponse.ofFail(ErrorCode.AUTH_INVALID_TOKEN);
        }
        Long id = jwtService.getUserId(refreshToken);
        String username = jwtService.getUsername(refreshToken);
        String role = jwtService.getRole(refreshToken);
        String newAccessToken = jwtService.generateAccessToken(id, username ,Role.valueOf(role));

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", newAccessToken);

        return APIResponse.ofSuccess(tokens);
    }
}
