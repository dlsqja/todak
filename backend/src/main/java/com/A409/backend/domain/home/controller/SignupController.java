package com.A409.backend.domain.home.controller;

import com.A409.backend.domain.hospital.entity.Hospital;
import com.A409.backend.domain.user.auth.entity.Auth;
import com.A409.backend.domain.user.auth.repository.AuthRepository;
import com.A409.backend.domain.user.owner.dto.OwnerRequest;
import com.A409.backend.domain.user.owner.entity.Owner;
import com.A409.backend.domain.user.owner.repository.OwnerRepository;
import com.A409.backend.domain.user.owner.service.OwnerService;
import com.A409.backend.domain.user.staff.entity.Staff;
import com.A409.backend.domain.user.staff.repository.StaffRepository;
import com.A409.backend.domain.user.staff.service.StaffService;
import com.A409.backend.domain.user.staff.dto.StaffRequest;
import com.A409.backend.domain.user.vet.dto.VetRequest;
import com.A409.backend.domain.user.vet.entity.Vet;
import com.A409.backend.domain.user.vet.repository.VetRepository;
import com.A409.backend.domain.user.vet.service.VetService;
import com.A409.backend.global.enums.ErrorCode;
import com.A409.backend.global.enums.Role;
import com.A409.backend.global.exception.CustomException;
import com.A409.backend.global.response.APIResponse;
import com.A409.backend.global.security.jwt.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.Duration;

@RestController
@RequestMapping("/public/signup")
@RequiredArgsConstructor
public class SignupController {

    private final OwnerService ownerService;
    private final VetService vetService;
    private final StaffService staffService;
    private final JwtService jwtService;
    private final OwnerRepository ownerRepository;
    private final VetRepository vetRepository;
    private final StaffRepository staffRepository;
    private final AuthRepository authRepository;

    @Operation(summary = "반려인 회원가입")
    @PostMapping("/owner")
    public APIResponse<?> ownerSignup(@RequestParam Long authId, @RequestBody OwnerRequest ownerRequest, HttpServletResponse response) throws IOException {
        ownerService.insertOwnerInfo(authId, ownerRequest);
        String redirectUrl = loginAfterSignup("owner", authId, response);
        return APIResponse.ofSuccess(redirectUrl);
    }

    @Operation(summary = "수의사 회원가입")
    @PostMapping("/vet")
    public APIResponse<?> vetSignup(@RequestParam Long authId, @RequestBody VetRequest vetRequest, HttpServletResponse response) throws IOException  {
        vetService.insertVetInfo(authId, vetRequest);
        String redirectUrl = loginAfterSignup("vet", authId, response);
        return APIResponse.ofSuccess(redirectUrl);
    }

    @Operation(summary = "병원관계자 회원가입")
    @PostMapping("/staff")
    public APIResponse<?> signup(@RequestParam Long authId, @RequestBody StaffRequest staffRequest, HttpServletResponse response) throws IOException  {
        staffService.insertStaffInfo(authId, staffRequest);
        String redirectUrl = loginAfterSignup("staff", authId, response);
        return APIResponse.ofSuccess(redirectUrl);
    }

    private String loginAfterSignup(String role, Long authId, HttpServletResponse response) throws IOException {
        Role selectedRole = switch (role) {
            case "owner" -> Role.OWNER;
            case "vet"   -> Role.VET;
            case "staff" -> Role.STAFF;
            default      -> throw new CustomException(ErrorCode.INVALID_ROLE);
        };

        Auth auth = authRepository.findById(authId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        Long id = null;
        String signRedirectURL = String.format("https://i13a409.p.ssafy.io/auth/%s/", role);

        if(selectedRole == Role.OWNER) {
            Owner owner = ownerRepository.findByAuthAuthId(authId).orElse(null);
            if(owner == null) { return signRedirectURL+authId;};
            id = owner.getOwnerId();
        } else if(selectedRole == Role.VET) {
            Vet vet = vetRepository.findByAuthAuthId(authId).orElse(null);
            if(vet == null) { return signRedirectURL+authId;};
            id = vet.getVetId();
        } else if(selectedRole == Role.STAFF) {
            Staff staff = staffRepository.findByAuthAuthId(authId).orElse(null);
            if(staff == null) { return signRedirectURL+authId;};
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

        String successRedirectURL = String.format("https://i13a409.p.ssafy.io/%s/home", role);
        //String successRedirectURL = String.format("http://localhost:8080/%s", role);

//        response.sendRedirect(successRedirectURL);
        return successRedirectURL;
    }

}
