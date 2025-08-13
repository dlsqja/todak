package com.A409.backend.global.pay.kakao.service;

import com.A409.backend.global.pay.kakao.dto.KakaoPayProperties;
import com.A409.backend.global.pay.kakao.dto.KakaoReadyRequest;
import com.A409.backend.global.pay.kakao.dto.KakaoReadyResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

// KakaoPayClient.java
@Service
@RequiredArgsConstructor
public class KakaoPayService {
    private final KakaoPayProperties props;
    private final RestTemplate rest = new RestTemplate();

    public KakaoReadyResponse readyZero(KakaoReadyRequest req) {
        String url = props.getHost() + "/v1/payment/ready";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "SECRET_KEY " + props.getAdminKey());
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("cid", props.getCid());                      // TCSUBSCRIP
        body.put("partner_order_id", req.getPartnerOrderId()); // 필수
        body.put("partner_user_id",  req.getPartnerUserId());  // 필수
        body.put("item_name", "정기결제 0원 인증");
        body.put("quantity", "1");
        body.put("total_amount", "0");                         // ✅ 0원
        body.put("tax_free_amount", "0");
        body.put("approval_url", req.getSuccessUrl());         // 성공 콜백
        body.put("cancel_url",   req.getCancelUrl());
        body.put("fail_url",     req.getFailUrl());

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<KakaoReadyResponse> res =
                rest.postForEntity(url, entity, KakaoReadyResponse.class);

        return Objects.requireNonNull(res.getBody());
    }
}

