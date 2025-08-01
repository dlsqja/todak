package com.A409.backend.domain.login.controller;

import com.A409.backend.domain.user.auth.entity.Auth;
import com.A409.backend.domain.user.auth.repository.AuthRepository;
import com.A409.backend.global.enums.Role;
import com.A409.backend.global.kakao.service.KakaoAuthService;
import com.A409.backend.global.response.ApiResponse;
import com.A409.backend.global.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/public/login")
@RequiredArgsConstructor
public class LoginController {

    private final AuthRepository authRepository;
    private final JwtService jwtService;
    private final KakaoAuthService kakaoAuthService;

    @PostMapping("/{role}")
    public ApiResponse<?> login(@PathVariable("role") String role, @RequestParam("code") String code) {

        Role selectedRole = switch (role.toLowerCase()) {
            case "owner" -> Role.OWNER;
            case "vet"   -> Role.VET;
            case "staff" -> Role.STAFF;
            default      -> throw new IllegalArgumentException("Invalid role");
        };
        String kakaoAccessToken = kakaoAuthService.getAccessToken(code, role.toLowerCase());

        Map<String, Object> userInfo = kakaoAuthService.getUserInfo(kakaoAccessToken);
        Map<String, Object> kakaoAccount = (Map<String, Object>) userInfo.get("kakao_account");

        String username = (String) kakaoAccount.get("email");
        Auth auth = authRepository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Long authId = auth.getAuthId();


        String accessToken = jwtService.generateAccessToken(authId, auth.getEmail(), selectedRole);
        String refreshToken = jwtService.generateRefreshToken(authId , auth.getEmail(), selectedRole);

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);

        return ApiResponse.ofSuccess(tokens);
    }
}
