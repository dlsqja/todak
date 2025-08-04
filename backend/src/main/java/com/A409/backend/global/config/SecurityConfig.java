package com.A409.backend.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {


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
                                "/swagger-ui/**",
                                "/swagger-resources/**",
                                "/v3/api-docs/**",
                                "/webjars/**",
                                "/signup/**",
                                "/staffs/mypage/**"
                        ).permitAll()
                        .requestMatchers("/public/**").permitAll()

                        .requestMatchers("/api/v1/owners/**").hasRole("OWNER")
                        .requestMatchers("/api/v1/reservations/owner/**").hasRole("OWNER")
                        .requestMatchers("/api/v1/treatments/owner/**").hasRole("OWNER")
                        .requestMatchers("/api/v1/pets/**").hasRole("OWNER")

                        .requestMatchers("/api/v1/vets/**").hasRole("VET")
                        .requestMatchers("/api/v1/reservations/vets/**").hasRole("VET")
                        .requestMatchers("/api/v1/treatments/vets/**").hasRole("VET")

                        .requestMatchers("/api/v1/staffs/**").hasRole("STAFF")
                        .requestMatchers("/api/v1/hospitals/**").hasRole("STAFF")
                        .requestMatchers("/api/v1/reservations/hospitals/**").hasRole("STAFF")


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
                        .anyRequest().authenticated());
        http
                .sessionManagement((session) -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }
}
