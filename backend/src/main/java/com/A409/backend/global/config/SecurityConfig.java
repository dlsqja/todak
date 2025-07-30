package com.A409.backend.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(authz -> authz
                        .anyRequest().permitAll() // ✅ 모든 요청 허용
                )
                .csrf(csrf -> csrf
                        .disable() // ✅ CSRF 완전 비활성화
                )
                .httpBasic(Customizer.withDefaults()); // 또는 필요 없으면 제거 가능

        return http.build();
    }
}
