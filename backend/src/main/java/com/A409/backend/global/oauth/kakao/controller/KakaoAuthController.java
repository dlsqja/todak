package com.A409.backend.global.oauth.kakao.controller;

import com.A409.backend.domain.user.auth.entity.Auth;
import com.A409.backend.domain.user.auth.repository.AuthRepository;
import com.A409.backend.global.enums.ErrorCode;
import com.A409.backend.global.enums.Role;
import com.A409.backend.global.exception.CustomException;
import com.A409.backend.global.oauth.kakao.service.KakaoAuthService;
import com.A409.backend.global.response.APIResponse;
import com.A409.backend.global.security.jwt.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/public/auth")
@RequiredArgsConstructor
public class KakaoAuthController {

    private final KakaoAuthService kakaoAuthService;
    private final AuthRepository authRepository;
    private final JwtService jwtService;

    @GetMapping("/kakao/callback")
    public APIResponse<?> saveAuthAfterKakaoLogin(@RequestParam("code") String code){
        String kakaoAccessToken = kakaoAuthService.getAccessToken(code);
        Map<String, Object> userInfo = kakaoAuthService.getUserInfo(kakaoAccessToken);
        Map<String, Object> kakaoAccount = (Map<String, Object>) userInfo.get("kakao_account");
        String username = (String) kakaoAccount.get("email");

        if(!authRepository.existsAuthByEmail(username)){
            Auth auth = Auth.builder()
                    .email(username)
                    .build();
            authRepository.save(auth);
        }
        Auth auth = authRepository.findByEmail(username)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        return APIResponse.ofSuccess(auth.getAuthId());
    }

    @Operation(summary = "토큰 재발급")
    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = Map.class)))
    @PostMapping("/refresh")
    public APIResponse<?> refresh(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refresh_token");

        if(!jwtService.validateToken(refreshToken)) {
            return APIResponse.ofFail(ErrorCode.AUTH_INVALID_TOKEN);
        }
        Long id = jwtService.getUserId(refreshToken);
        String username = jwtService.getUsername(refreshToken);
        String role = jwtService.getRole(refreshToken);
        String newAccessToken = jwtService.generateAccessToken(id, username , Role.valueOf(role));

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", newAccessToken);

        return APIResponse.ofSuccess(tokens);
    }

//    @GetMapping("/kakao/callback/{role}")
//    public ApiResponse<?> kakaoLoginCallback(@RequestParam("code") String code, @PathVariable("role")String roleStr) {
//        log.info("kakaoCallback roleStr:{}",roleStr);
//
//        Role role = switch (roleStr.toLowerCase()) {
//            case "owner" -> Role.OWNER;
//            case "vet"   -> Role.VET;
//            case "staff" -> Role.STAFF;
//            default      -> throw new IllegalArgumentException("Invalid role");
//        };
//        String kakaoAccessToken = kakaoAuthService.getAccessToken(code, roleStr.toLowerCase());
//
//        Map<String, Object> userInfo = kakaoAuthService.getUserInfo(kakaoAccessToken);
//        Map<String, Object> kakaoAccount = (Map<String, Object>) userInfo.get("kakao_account");
//
//        String username = (String) kakaoAccount.get("email");
//        Auth auth = authRepository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
//        Long id = auth.getAuthId();
//
//        String accessToken = jwtService.generateAccessToken(id, username, role);
//        String refreshToken = jwtService.generateRefreshToken(id, username, role);
//
//        Map<String, String> tokens = new HashMap<>();
//        tokens.put("accessToken", accessToken);
//        tokens.put("refreshToken", refreshToken);
//
//        return ApiResponse.ofSuccess(tokens);
//    }
}
