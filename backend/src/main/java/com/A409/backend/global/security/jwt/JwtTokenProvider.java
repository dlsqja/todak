package com.A409.backend.global.security.jwt;

import com.A409.backend.global.enums.ErrorCode;
import com.A409.backend.global.enums.Role;
import com.A409.backend.global.exception.CustomException;
import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import io.jsonwebtoken.security.SignatureException;
import java.util.Date;
import java.util.UUID;

@Component
public class JwtTokenProvider {
    private SecretKey secretKey;

    public JwtTokenProvider( @Value("${auth.secret-key}")String secret){
        this.secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), Jwts.SIG.HS256.key().build().getAlgorithm());
    }

    public Long getUserId(String token){
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("id", Long.class);
    }

    public String getUsername(String token){
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("username", String.class);

    }
    public String getRole(String token){
        return Jwts.parser()
                .verifyWith(secretKey)
                .build().parseSignedClaims(token)
                .getPayload().get("role", String.class);
    }
    public Boolean isExpired(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration()
                .before(new Date());
    }
    public String createAccessJwt(Long id, String email, Role role, Long expiredMs) {
        return Jwts.builder()
                .id(UUID.randomUUID().toString())
                .claim("id", id)
                .claim("username", email)
                .claim("role", role.name())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiredMs))
                .signWith(secretKey)
                .compact();
    }

    public String createRefreshToken(Long id, String email, Role role, Long expiredMs) {
        return Jwts.builder()
                .id(UUID.randomUUID().toString())
                .claim("id", id)
                .claim("username", email)
                .claim("role", role.name())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiredMs))
                .signWith(secretKey)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            throw new CustomException(ErrorCode.AUTH_TOKEN_EXPIRED);
        } catch (UnsupportedJwtException e) {
            throw new CustomException(ErrorCode.AUTH_TOKEN_UNSUPPORTED);
        } catch (MalformedJwtException e) {
            throw new CustomException(ErrorCode.AUTH_TOKEN_MALFORMED);
        } catch (SignatureException e) {
            throw new CustomException(ErrorCode.AUTH_TOKEN_INVALID_SIGNATURE);
        } catch (JwtException e) {
            throw new CustomException(ErrorCode.AUTH_INVALID_TOKEN);
        }
    }

}
