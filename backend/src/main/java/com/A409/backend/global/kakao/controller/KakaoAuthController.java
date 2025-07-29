package com.A409.backend.global.kakao.controller;

import com.A409.backend.global.kakao.service.KakaoAuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class KakaoAuthController {

    private final KakaoAuthService kakaoAuthService;

    @GetMapping("/kakao/callback")
    public ResponseEntity<String> kakaoCallback(@RequestParam("code") String code) {

        String accessToken = kakaoAuthService.getAccessToken(code);
        return ResponseEntity.ok("카카오 Access Token: " + accessToken);
    }
}
