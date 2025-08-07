package com.A409.backend.global.ai;

import com.A409.backend.domain.treatment.service.TreatmentService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AIClient {

    private static final String URL = "https://gms.ssafy.io/gmsapi/api.openai.com/v1/chat/completions";
    private final ObjectMapper objectMapper;

    @Value("${gms.api.key}")
    private String GMS_KEY;

    public String sendChatRequest(String content) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(GMS_KEY);

        Map<String, Object> body = new HashMap<>();
        body.put("model", "gpt-4.1");
        body.put("temperature", 0.7);
        body.put("max_tokens", 500);

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content",
                "당신은 전문 수의사이자 작문 전문가입니다. 사용자가 보낸 진료 대화를 환자가 이해하기 쉬운 말로 친절하게 요약해 주세요. " +
                        "전문 용어는 풀어서 설명하고, 너무 어렵거나 불필요한 정보는 빼고 중요한 내용만 간결하게 정리해 주세요. 한국어로 답변하세요."));
        messages.add(Map.of("role", "user", "content", content));
        body.put("messages", messages);

        try {
            String jsonBody = objectMapper.writeValueAsString(body);
            System.out.println("요청 JSON: " + jsonBody);

            HttpEntity<String> request = new HttpEntity<>(jsonBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(URL, request, String.class);

            JsonNode root = objectMapper.readTree(response.getBody());

            return root.path("choices").get(0).path("message").path("content").asText();

        } catch (HttpClientErrorException e) {
            System.err.println("HTTP 오류 발생: " + e.getStatusCode());
            System.err.println("응답 본문: " + e.getResponseBodyAsString());
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("OpenAI 요청 실패", e);
        }
    }
}


