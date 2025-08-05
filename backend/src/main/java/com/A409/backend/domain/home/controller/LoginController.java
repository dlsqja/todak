package com.A409.backend.domain.home.controller;

import com.A409.backend.domain.hospital.entity.Hospital;
import com.A409.backend.domain.user.auth.entity.Auth;
import com.A409.backend.domain.user.auth.repository.AuthRepository;
import com.A409.backend.domain.user.owner.entity.Owner;
import com.A409.backend.domain.user.owner.repository.OwnerRepository;
import com.A409.backend.domain.user.staff.entity.Staff;
import com.A409.backend.domain.user.staff.repository.StaffRepository;
import com.A409.backend.domain.user.vet.entity.Vet;
import com.A409.backend.domain.user.vet.repository.VetRepository;
import com.A409.backend.global.enums.ErrorCode;
import com.A409.backend.global.enums.Role;
import com.A409.backend.global.exception.CustomException;
import com.A409.backend.global.kakao.service.KakaoAuthService;
import com.A409.backend.global.response.ApiResponse;
import com.A409.backend.global.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
@Slf4j
@RestController
@RequestMapping("/public/login")
@RequiredArgsConstructor
public class LoginController {

    private final AuthRepository authRepository;
    private final JwtService jwtService;
    private final KakaoAuthService kakaoAuthService;
    private final OwnerRepository ownerRepository;
    private final VetRepository vetRepository;
    private final StaffRepository staffRepository;

    @GetMapping("/{role}")
    public ApiResponse<?> login(@PathVariable("role") String role, @RequestParam("code") String code) {



        Role selectedRole = switch (role) {
            case "owner" -> Role.OWNER;
            case "vet"   -> Role.VET;
            case "staff" -> Role.STAFF;
            default      -> throw new IllegalArgumentException("Invalid role");
        };
        String kakaoAccessToken = kakaoAuthService.getAccessToken(code, role);

        Map<String, Object> userInfo = kakaoAuthService.getUserInfo(kakaoAccessToken);
        Map<String, Object> kakaoAccount = (Map<String, Object>) userInfo.get("kakao_account");

        String username = (String) kakaoAccount.get("email");
        Auth auth = authRepository.findByEmail(username).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        Long id = 0L;

        if(selectedRole == Role.OWNER) {
            Owner owner = ownerRepository.findByAuth(auth).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
            id = owner.getOwnerId();
        } else if(selectedRole == Role.VET) {
            Vet vet = vetRepository.findByAuth(auth).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
            id = vet.getVetId();
        } else if(selectedRole == Role.STAFF) {
            Staff staff = staffRepository.findByAuth(auth).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
            Hospital hospital = staff.getHospital();
            id = hospital.getHospitalId();
        }

        String accessToken = jwtService.generateAccessToken(id, auth.getEmail(), selectedRole);
        String refreshToken = jwtService.generateRefreshToken(id , auth.getEmail(), selectedRole);

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);

        log.info("Access Token: {}", accessToken);
        log.info("Refresh Token: {}", refreshToken);
        return ApiResponse.ofSuccess(tokens);
    }
}
