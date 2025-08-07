package com.A409.backend.global.security.jwt;

import com.A409.backend.domain.user.auth.entity.Auth;
import com.A409.backend.domain.user.auth.repository.AuthRepository;
import com.A409.backend.global.enums.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtTokenProvider jwtTokenProvider;
    private final AuthRepository authRepository;

    private static final long ACCESS_TOKEN_EXPIRATION = 1000L * 60 * 60 * 24 * 30 * 12;
    private static final long REFRESH_TOKEN_EXPIRATION = 1000L * 60 * 60 * 24 * 7;

    public String generateAccessToken(Long id, String username , Role role) {
        return jwtTokenProvider.createAccessJwt(id, username, role, ACCESS_TOKEN_EXPIRATION);
    }

    public String generateRefreshToken(Long id ,String username,Role role) {
        return jwtTokenProvider.createRefreshToken(id, username ,role ,REFRESH_TOKEN_EXPIRATION);
    }

    public boolean validateToken(String token) {
        return jwtTokenProvider.validateToken(token);
    }

    public String getUsername(String token) {
        return jwtTokenProvider.getUsername(token);
    }

    public String getRole(String token) {
        return jwtTokenProvider.getRole(token);
    }
    public Long getUserId(String token) {
        return jwtTokenProvider.getUserId(token);
    }
}
