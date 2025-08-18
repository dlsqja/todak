package com.A409.backend.domain.home.controller;

import com.A409.backend.global.redis.RedisService;
import com.A409.backend.global.response.APIResponse;
import com.A409.backend.global.security.model.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.cache.CacheProperties;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/kakao/logout")
public class LogoutController {

    private final RedisService redisService;

    @PostMapping
    public APIResponse<?> logout (@AuthenticationPrincipal User user, HttpServletResponse response, HttpServletRequest request) {


        String authHeader = request.getHeader("Authorization");

        if(authHeader != null && authHeader.startsWith("Bearer ")) {
            String accessToken = authHeader.substring(7);
            String cacheKey = "blacklist:" + user.getId();

            redisService.setByKey(cacheKey,accessToken);
            List<String> tokens = new ArrayList<>();
            tokens.add(accessToken);
            redisService.setByKeyWithTTL(cacheKey, tokens, 30L);
        }

        ResponseCookie accessTokenCookie = ResponseCookie.from("ACCESSTOKEN", "")
                .httpOnly(true) //js 에서 document.cookie로 읽어오지 못하게함
                .secure(true)   //https 에서만 가능
                .sameSite("Lax")
                .path("/")
                .maxAge(0)
                .build();

        ResponseCookie refreshTokenCookie = ResponseCookie.from("REFRESHTOKEN", "")
                .httpOnly(true) //js 에서 document.cookie로 읽어오지 못하게함
                .secure(true)   //https 에서만 가능
                .sameSite("Lax")
                .path("/")
                .maxAge(0)
                .build();


        response.addHeader(HttpHeaders.SET_COOKIE, accessTokenCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());

        return APIResponse.ofSuccess(null);
    }
}
