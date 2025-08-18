package com.A409.backend.domain.pay.kakao.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

// KakaoPayProperties.java
@Component
@Getter
@Setter
public class KakaoPayProperties {
    @Value("${kakaopay.host}")
    private String host;
    @Value("${kakaopay.admin-key}")
    private String adminKey;
    @Value("${kakaopay.cid}")
    private String cid;
}

