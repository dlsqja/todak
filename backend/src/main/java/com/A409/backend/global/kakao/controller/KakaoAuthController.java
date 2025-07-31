package com.A409.backend.global.kakao.controller;

import com.A409.backend.domain.user.auth.entity.Auth;
import com.A409.backend.domain.user.auth.repository.AuthRepository;
import com.A409.backend.global.enums.Role;
import com.A409.backend.global.kakao.service.KakaoAuthService;
import com.A409.backend.global.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class KakaoAuthController {

    private final KakaoAuthService kakaoAuthService;
    private final AuthRepository authRepository;
    private final JwtService jwtService;

    @GetMapping("/kakao/callback/{role}")
    public ResponseEntity<Map<String, String>> kakaoCallback(@RequestParam("code") String code, @PathVariable("role")String roleStr) {
        log.info("kakaoCallback roleStr:{}",roleStr);

        Role role = switch (roleStr.toLowerCase()) {
            case "owner" -> Role.OWNER;
            case "vet"   -> Role.VET;
            case "staff" -> Role.STAFF;
            default      -> throw new IllegalArgumentException("Invalid role");
        };
        String kakaoAccessToken = kakaoAuthService.getAccessToken(code, roleStr.toLowerCase());

        Map<String, Object> userInfo = kakaoAuthService.getUserInfo(kakaoAccessToken);
        Map<String, Object> kakaoAccount = (Map<String, Object>) userInfo.get("kakao_account");

        String username = (String) kakaoAccount.get("email");
        Auth auth = authRepository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Long id = auth.getAuthId();

        String accessToken = jwtService.generateAccessToken(id, username, role);
        String refreshToken = jwtService.generateRefreshToken(id, username, role);

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);

        return ResponseEntity.ok(tokens);
    }
}
