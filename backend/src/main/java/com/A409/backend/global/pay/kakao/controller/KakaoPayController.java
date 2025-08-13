package com.A409.backend.global.pay.kakao.controller;

import com.A409.backend.global.pay.kakao.dto.KakaoReadyRequest;
import com.A409.backend.global.pay.kakao.dto.KakaoReadyResponse;
import com.A409.backend.global.pay.kakao.service.KakaoPayService;
import com.A409.backend.global.response.APIResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/public/pay")
@RequiredArgsConstructor
public class KakaoPayController {

    private final KakaoPayService kakaoPayService;

    @PostMapping("/ready/{user_id}")
    public APIResponse<?> readyKakaoPay(@PathVariable("user_id") Long userId, @RequestBody Map<String, String> body) {
        String kakaoUrl = "open-api.kakaopay.com/online/v1/payment/ready";

        KakaoReadyRequest req = KakaoReadyRequest.builder()
                .successUrl(body.get("successUrl"))
                .cancelUrl(body.get("cancelUrl"))
                .failUrl(body.get("failUrl"))
                .partnerOrderId("sub-" + userId + "-" + System.currentTimeMillis())
                .partnerUserId(String.valueOf(userId))
                .build();

        KakaoReadyResponse res = kakaoPayService.readyZero(req);

        String redirectUrl = Optional.ofNullable(res.getNext_redirect_pc_url())
                .orElse(res.getNext_redirect_pc_url());
        return APIResponse.ofSuccess(redirectUrl);
    }

}
