package com.A409.backend.global.config;

import com.A409.backend.global.security.jwt.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
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

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Value("${api.version}")
    private String VERSION;

    /*
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .formLogin(form -> form.disable())
                .httpBasic(httpBasic -> httpBasic.disable())
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() // 모든 요청 허용
                );
        return http.build();
    }

     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf((auth) -> auth.disable())
                .formLogin((auth) -> auth.disable())
                .httpBasic((auth) -> auth.disable());
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, "/login").permitAll()
                        .requestMatchers(
                                VERSION + "/swagger-ui/**",
                                VERSION + "/swagger-resources/**",
                                VERSION + "/v3/api-docs/**",
                                VERSION + "/webjars/**",
                                VERSION + "/signup/**",
                                VERSION + "/staffs/mypage/**"
                        ).permitAll()
                        .requestMatchers(VERSION + "/public/**").permitAll()

                        .requestMatchers(VERSION + "/owners/**").hasRole("OWNER")
                        .requestMatchers(VERSION + "/reservations/owner/**").hasRole("OWNER")
                        .requestMatchers(VERSION + "/treatments/owner/**").hasRole("OWNER")
                        .requestMatchers(VERSION + "/pets/**").hasRole("OWNER")

                        .requestMatchers(VERSION + "/vets/**").hasRole("VET")
                        .requestMatchers(VERSION + "/reservations/vets/**").hasRole("VET")
                        .requestMatchers(VERSION + "/treatments/vets/**").hasRole("VET")

                        .requestMatchers(VERSION + "/staffs/**").hasRole("STAFF")
                        .requestMatchers(VERSION + "/hospitals/**").hasRole("STAFF")
                        .requestMatchers(VERSION + "/reservations/hospitals/**").hasRole("STAFF")
                        .anyRequest().authenticated())
                .sessionManagement((session) -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
