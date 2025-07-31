package com.A409.backend.global.security.jwt.controller;

import com.A409.backend.global.enums.Role;
import com.A409.backend.global.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.token.TokenService;
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

    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refresh(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refresh_token");

        if(!jwtService.validateToken(refreshToken)) {
            return ResponseEntity.badRequest().build();
        }
        Long id = jwtService.getUserId(refreshToken);
        String username = jwtService.getUsername(refreshToken);
        Role role = jwtService.getRole(refreshToken);
        String newAccessToken = jwtService.generateAccessToken(id, username ,role);

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", newAccessToken);

        return ResponseEntity.ok(tokens);
    }
}
