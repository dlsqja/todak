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
                                "/ws"
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

}
