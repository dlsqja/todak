package com.A409.backend.domain.openvidu;

import com.A409.backend.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/video")
public class OpenViduController {

    private final RestTemplate restTemplate;
    private final String OPENVIDU_URL; // docker-compose 네트워크명 사용
    private final String OPENVIDU_SECRET;

    public OpenViduController(
            RestTemplate restTemplate,
            @Value("${openvidu.url}") String openviduUrl,
            @Value("${openvidu.key}") String openviduSecret
    ) {
        this.restTemplate = restTemplate;
        this.OPENVIDU_URL = openviduUrl;
        this.OPENVIDU_SECRET = openviduSecret;
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/get-token")
    public ApiResponse<?> getToken(@RequestParam("session_id") String sessionId) {

        HttpHeaders headers = createAuthHeaders();

        // 1. 세션 생성 (이미 있으면 409 → 무시)
        createSessionIfNotExists(sessionId, headers);

        // 2. 토큰 생성
        String token = createToken(sessionId, headers);

        // 3. JSON 응답 반환
        Map<String, Object> response = new HashMap<>();
        response.put("sessionId", sessionId);
        response.put("token", token);
        return ApiResponse.ofSuccess(response);
    }

    /**
     * 인증 헤더 생성
     */
    private HttpHeaders createAuthHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth("OPENVIDUAPP", OPENVIDU_SECRET);
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    /**
     * 세션이 없으면 생성
     */
    private void createSessionIfNotExists(String sessionId, HttpHeaders headers) {
        Map<String, Object> body = Map.of("customSessionId", sessionId);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            restTemplate.exchange(
                    OPENVIDU_URL + "/openvidu/api/sessions",
                    HttpMethod.POST,
                    request,
                    String.class
            );
        } catch (HttpClientErrorException e) {
            // 409는 이미 세션 존재 → 무시
            if (!e.getStatusCode().equals(HttpStatus.CONFLICT)) {
                throw e;
            }
        }
    }

    /**
     * 토큰 생성 후 반환
     */
    private String createToken(String sessionId, HttpHeaders headers) {
        Map<String, Object> body = Map.of("session", sessionId);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                OPENVIDU_URL + "/openvidu/api/tokens",
                HttpMethod.POST,
                request,
                Map.class
        );

        return (String) response.getBody().get("token");
    }
}
