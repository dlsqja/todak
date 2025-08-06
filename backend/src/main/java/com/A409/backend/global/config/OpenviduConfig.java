package com.A409.backend.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

//@Configuration
public class OpenviduConfig {
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
