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
import com.A409.backend.global.oauth.kakao.service.KakaoAuthService;
import com.A409.backend.global.response.APIResponse;
import com.A409.backend.global.security.jwt.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.Duration;
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

    @Operation(summary = "카카오 로그인")
    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = Map.class)))
    @GetMapping("/{role}")
    public void login(@PathVariable("role") String role, @RequestParam("code") String code, HttpServletResponse response) throws IOException {


        Role selectedRole = switch (role) {
            case "owner" -> Role.OWNER;
            case "vet"   -> Role.VET;
            case "staff" -> Role.STAFF;
            default      -> throw new CustomException(ErrorCode.INVALID_ROLE);
        };
        String kakaoAccessToken = kakaoAuthService.getAccessToken(code, role);

        Map<String, Object> userInfo = kakaoAuthService.getUserInfo(kakaoAccessToken);
        Map<String, Object> kakaoAccount = (Map<String, Object>) userInfo.get("kakao_account");

        String username = (String) kakaoAccount.get("email");
        Auth auth = authRepository.findByEmail(username).orElse(null);


        String signRedirectURL = String.format("https://i13a409.p.ssafy.io/auth/%s/", role);

        if(auth==null){
            auth = Auth.builder()
                    .email(username)
                    .build();
            authRepository.save(auth);

            response.sendRedirect(signRedirectURL+auth.getAuthId());
        }

        Long authId = auth.getAuthId();
        Long id = null;

        if(selectedRole == Role.OWNER) {
            Owner owner = ownerRepository.findByAuth(auth).orElse(null);
            if(owner == null) response.sendRedirect(signRedirectURL+authId);
            id = owner.getOwnerId();
        } else if(selectedRole == Role.VET) {
            Vet vet = vetRepository.findByAuth(auth).orElse(null);
            if(vet == null) response.sendRedirect(signRedirectURL+authId);
            id = vet.getVetId();
        } else if(selectedRole == Role.STAFF) {
            Staff staff = staffRepository.findByAuth(auth).orElse(null);
            if(staff == null) response.sendRedirect(signRedirectURL+authId);
            Hospital hospital = staff.getHospital();
            id = hospital.getHospitalId();
        }

        String accessToken = jwtService.generateAccessToken(id, auth.getEmail(), selectedRole);
        String refreshToken = jwtService.generateRefreshToken(id , auth.getEmail(), selectedRole);

        ResponseCookie accessTokenCookie = ResponseCookie.from("ACCESSTOKEN", accessToken)
                .httpOnly(true) //js 에서 document.cookie로 읽어오지 못하게함
                .secure(true)   //https 에서만 가능
                .sameSite("Lax")
                .path("/")
                .maxAge(Duration.ofDays(14))
                .build();

        ResponseCookie refreshTokenCookie = ResponseCookie.from("REFRESHTOKEN", refreshToken)
                .httpOnly(true) //js 에서 document.cookie로 읽어오지 못하게함
                .secure(true)   //https 에서만 가능
                .sameSite("Lax")
                .path("/")
                .maxAge(Duration.ofDays(14))
                .build();


        response.addHeader(HttpHeaders.SET_COOKIE, accessTokenCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());

        String successRedirectURL = String.format("https://i13a409.p.ssafy.io/%s", role);

        response.sendRedirect(successRedirectURL);
    }
}
