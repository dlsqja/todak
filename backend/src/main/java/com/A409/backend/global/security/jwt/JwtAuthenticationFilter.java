package com.A409.backend.global.security.jwt;

import com.A409.backend.global.enums.ErrorCode;
import com.A409.backend.global.enums.Role;
import com.A409.backend.global.exception.CustomException;
import com.A409.backend.global.redis.RedisService;
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
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final RedisService redisService;

    @Value("${api.version}")
    private String VERSION;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();
        log.info(path);

        if (isPermitAllPath(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = null;
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }

        if (token == null) {
            jakarta.servlet.http.Cookie[] cookies = request.getCookies();

            if (cookies != null) {
                for (jakarta.servlet.http.Cookie c : cookies) {

                    if ("ACCESSTOKEN".equals(c.getName())) {
                        String v = c.getValue();
                        if (v != null && !v.isBlank()) {
                            token = v;
                            break;
                        }
                    }
                }
            }
        }
        if(token != null && jwtService.validateToken(token)){
            Long id = jwtService.getUserId(token);
            String username = jwtService.getUsername(token);
            String role = jwtService.getRole(token);

            String cacheKey = "blacklist:" + id;
            List<String> cachedTokens = (List<String>) redisService.getByKey(cacheKey);

            if(cachedTokens!=null&&cachedTokens.contains(token)){
                throw new CustomException(ErrorCode.ACCESS_DENIED);
            }



            User user = User.builder()
                    .id(id)
                    .username(username)
                    .role(Role.valueOf(role))
                    .password(null)
                    .build();

            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
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
