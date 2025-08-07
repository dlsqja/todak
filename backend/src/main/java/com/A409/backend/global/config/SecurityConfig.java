package com.A409.backend.global.config;

import com.A409.backend.global.security.jwt.JwtAuthenticationFilter;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.time.Duration;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@Slf4j
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Value("${api.version}")
    private String VERSION;

//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//        http
//                .csrf(csrf -> csrf.disable())
//                .formLogin(form -> form.disable())
//                .httpBasic(httpBasic -> httpBasic.disable())
//                .authorizeHttpRequests(auth -> auth
//                        .anyRequest().permitAll() // 모든 요청 허용
//                );
//        return http.build();
//    }


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .cors(c -> c.configurationSource(corsConfigurationSource()))
                .csrf((auth) -> auth.disable())
                .formLogin((auth) -> auth.disable())
                .httpBasic((auth) -> auth.disable());
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, "/login").permitAll()
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-resources/**",
                                "/v3/api-docs/**",
                                "/webjars/**",
                                "/signup/**",
                                "/staffs/mypage/**",
                                "/api/v1/ws/",
                                "/api/v1/ws/**",
                                "/ws/**",
                                "/ws/"
                        ).permitAll()
                        .requestMatchers("/api/v1/public/**").permitAll()
                        .requestMatchers("/public/**").permitAll()

                        .requestMatchers("/owners/**").hasRole("OWNER")
                        .requestMatchers("/reservations/owner/**").hasRole("OWNER")
                        .requestMatchers("/treatments/owner/**").hasRole("OWNER")
                        .requestMatchers("/pets/**").hasRole("OWNER")

                        .requestMatchers("/vets/**").hasRole("VET")
                        .requestMatchers("/reservations/vets/**").hasRole("VET")
                        .requestMatchers("/treatments/vets/**").hasRole("VET")

                        .requestMatchers("/staffs/**").hasRole("STAFF")
                        .requestMatchers("/hospitals/**").hasRole("STAFF")
                        .requestMatchers("/reservations/hospitals/**").hasRole("STAFF")
                        .anyRequest().authenticated())
                .sessionManagement((session) -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // ------------------------------------------------------------------
        // ❶ 허용 Origin
        // credentials(true) 를 쓴다면 와일드카드 "*" 대신 구체적인 패턴을 넣어야 함!
        // Vite ↔ React DevServer ↔ CRA 등 포트만 다른 경우도 모두 추가하세요.
        // ------------------------------------------------------------------
        config.setAllowedOriginPatterns(List.of(
                "http://localhost:5173"           // Vite
        ));

        // ------------------------------------------------------------------
        // ❷ 허용 메서드 · 헤더
        // ------------------------------------------------------------------
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));

        // ------------------------------------------------------------------
        // ❸ 인증 정보(쿠키, Authorization 헤더 등) 전송 허용 여부
        //    → 프론트 axios/fetch 에서 withCredentials:true / credentials:"include" 필수
        // ------------------------------------------------------------------
        config.setAllowCredentials(true);

        // (선택) preflight 응답 캐싱 시간
        config.setMaxAge(Duration.ofHours(1));

        // ------------------------------------------------------------------
        // ❹ 경로 매핑
        //    여기선 전체 API(**)에 동일 CORS 정책을 적용
        // ------------------------------------------------------------------
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }

}
