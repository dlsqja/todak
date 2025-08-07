package com.A409.backend.global.security.jwt;

import com.A409.backend.global.enums.Role;
import com.A409.backend.global.security.model.User;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;

    @Value("${api.version}")
    private String VERSION;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();
        log.info(path);
        // permitAll 경로는 JWT 검증 없이 통과
        if (isPermitAllPath(path)) {
            log.info("Permit all path, skipping JWT validation: {}", path);
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        if(authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            log.info("Authentication Token: {}", token);
            if(jwtService.validateToken(token)){
                Long id = jwtService.getUserId(token);
                String username = jwtService.getUsername(token);
                String role = jwtService.getRole(token);

                User user = User.builder()
                        .id(id)
                        .username(username)
                        .role(Role.valueOf(role))
                        .password(null)
                        .build();

                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }
        filterChain.doFilter(request, response);
    }

    private boolean isPermitAllPath(String path) {
        return path.equals("/login") // POST /login
                || path.startsWith(VERSION + "/swagger-ui")
                || path.startsWith(VERSION + "/swagger-resources")
                || path.startsWith(VERSION + "/v3/api-docs")
                || path.startsWith(VERSION + "/webjars")
                || path.startsWith(VERSION + "/signup")
                || path.startsWith(VERSION + "/staffs/mypage")
                || path.startsWith(VERSION + "/public");
    }


}
