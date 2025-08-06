package com.A409.backend.global.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AIClient {

    private static final String URL = "https://gms.ssafy.io/gmsapi/api.openai.com/v1/chat/completions";

    @Value("${gms.api.key}")
    private String GMS_KEY;

    public String sendChatRequest(String message) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(GMS_KEY);

        Map<String, Object> body = new HashMap<>();
        body.put("model", "gpt-4.1");

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "developer", "content", "Answer in Korean"));
        messages.add(Map.of("role", "user", "content", message));

        body.put("messages", messages);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(URL, request, String.class);

        return response.getBody();
    }
}

