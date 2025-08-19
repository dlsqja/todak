package com.A409.backend.global.ai;

import com.A409.backend.domain.treatment.service.TreatmentService;
import com.A409.backend.global.exception.CustomException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class AIClient {

    private static final String AUDIO_URL = "https://gms.ssafy.io/gmsapi/api.openai.com/v1/audio/transcriptions";
    private static final String URL = "https://gms.ssafy.io/gmsapi/api.openai.com/v1/chat/completions";
    private final ObjectMapper objectMapper;
    private final TreatmentService treatmentService;
    private final OkHttpClient client;

    @Value("${gms.api.key}")
    private String GMS_KEY;

    public String sendChatRequest(String content) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(GMS_KEY);

        Map<String, Object> body = new HashMap<>();
        body.put("model", "gpt-4.1");
        body.put("temperature", 0.4);
        body.put("max_tokens", 1000);

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of(
                "role", "system",
                "content",
                "당신은 전문 수의사이자 작문 전문가입니다. " +
                        "진료 과정에서 일어난 의사의 대사를 환자가 이해하기 쉬운 말로 친절하게 요약해 주세요. " +
                        "전문 용어는 풀어서 설명하고, 중요한 정보는 꼭 넣되 필요하지 않은 정보는 빼고 환자가 이해하기 쉽게 해주세요. " +
                        "출력 시 서두 문구 없이, 요약된 내용만 바로 작성하세요. 한국어로 답변하세요."
        ));
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

    @Async
    public void uploadAudio(Long treatmentId, File file) {
        try {
            RequestBody requestBody = new MultipartBody.Builder()
                    .setType(MultipartBody.FORM)
                    .addFormDataPart("model", "whisper-1")
                    .addFormDataPart("file", file.getName(),
                            RequestBody.create(Files.readAllBytes(file.toPath())))
//                    .addFormDataPart("file", file.getOriginalFilename(),
//                            RequestBody.create(file.getBytes()))
                    .build();

            log.info(GMS_KEY);
            Request request = new Request.Builder()
                    .url(AUDIO_URL)
                    .post(requestBody)
                    .addHeader("Authorization", "Bearer " + GMS_KEY)
                    .build();
            Response response = client.newCall(request).execute();

            ObjectMapper mapper = new ObjectMapper();
            String body = response.body().string();

            JsonNode jsonNode = mapper.readTree(body);
            String result = jsonNode.get("text").asText();
            log.info("음성 텍스트 추출: "+result);
            treatmentService.saveResult(treatmentId, result);

            String AIResult = sendChatRequest(result);
            log.info("AI 텍스트 요약/분석 추출: "+AIResult);
            treatmentService.saveAISummary(treatmentId, AIResult);

            boolean isDelete = file.delete();
            if (isDelete)
                log.info("요약 완료된 녹음 파일 삭제 완료");
        }  catch (Exception e) {
            e.printStackTrace();
        }
    }
}


