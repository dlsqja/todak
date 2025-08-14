package com.A409.backend.domain.pay.kakao.controller;

import com.A409.backend.global.enums.ErrorCode;
import com.A409.backend.global.exception.CustomException;
import com.A409.backend.domain.pay.kakao.dto.KakaoPayRequest;
import com.A409.backend.domain.pay.kakao.dto.KakaoReadyRequest;
import com.A409.backend.domain.pay.kakao.dto.KakaoReadyResponse;
import com.A409.backend.domain.pay.kakao.service.KakaoPayService;
import com.A409.backend.global.redis.RedisService;
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
    private final RedisService redisService;

    @PostMapping("/ready/{user_id}")
    public APIResponse<?> readyKakaoPay(@PathVariable("user_id") Long userId, @RequestBody Map<String, String> body) {
        KakaoReadyRequest req = KakaoReadyRequest.builder()
                .successUrl(body.get("successUrl"))
                .cancelUrl(body.get("cancelUrl"))
                .failUrl(body.get("failUrl"))
                .partnerOrderId("sub-" + userId)
                .partnerUserId(String.valueOf(userId))
                .build();

        KakaoReadyResponse res = kakaoPayService.readyZero(req);

        String redirectUrl = Optional.ofNullable(res.getNext_redirect_pc_url()).orElseThrow(() -> new CustomException(ErrorCode.INVALID_ERROR));
        String tid = Optional.ofNullable(res.getTid()).orElseThrow(() -> new CustomException(ErrorCode.INVALID_ERROR));
        String redisKey = "payment-" + userId;
        redisService.setByKey(redisKey, tid);
        return APIResponse.ofSuccess(redirectUrl);
    }

    @PostMapping("/regist/{user_id}")
    public APIResponse<?> regist(@PathVariable("user_id") Long userId, @RequestBody Map<String, String> body) {
        String pgToken = body.get("pgToken");
        kakaoPayService.registPay(userId, pgToken);
        return APIResponse.ofSuccess(null);
    }

    @PostMapping("/{user_id}")
    public APIResponse<?> pay(@PathVariable("user_id") Long userId, @RequestBody Map<String, String> body) {
        KakaoPayRequest req = KakaoPayRequest.builder()
                .item_name(body.get("item_name"))
                .partner_order_id("sub-" + userId)
                .partner_user_id(String.valueOf(userId))
                .quantity(1L)
                .total_amount(Long.parseLong(body.get("total_amount")))
                .vat_amount(Long.parseLong(body.get("vat_amount")))
                .tax_free_amount(Long.parseLong(body.get("tax_free_amount")))
                .build();

        kakaoPayService.pay(req);
        return APIResponse.ofSuccess(null);
    }


}
