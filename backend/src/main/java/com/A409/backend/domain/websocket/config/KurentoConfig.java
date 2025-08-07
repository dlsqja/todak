package com.A409.backend.domain.websocket.config;

import org.kurento.client.KurentoClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KurentoConfig {

    @Bean
    public KurentoClient kurentoClient() {
        // Docker-compose 기준: kurento 컨테이너 이름과 포트를 사용
        return KurentoClient.create("ws://43.201.146.186:8888/kurento");
//        return KurentoClient.create("ws://kurento:8888/kurento");
        // 로컬 테스트면 ws://localhost:8888/kurento
    }
}
