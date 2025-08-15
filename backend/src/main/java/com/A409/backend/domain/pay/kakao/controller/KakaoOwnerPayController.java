package com.A409.backend.domain.pay.kakao.controller;

import com.A409.backend.global.enums.ErrorCode;
import com.A409.backend.global.exception.CustomException;
import com.A409.backend.domain.pay.kakao.dto.KakaoReadyRequest;
import com.A409.backend.domain.pay.kakao.dto.KakaoReadyResponse;
import com.A409.backend.domain.pay.kakao.service.KakaoPayService;
import com.A409.backend.global.redis.RedisService;
import com.A409.backend.global.response.APIResponse;
import com.A409.backend.global.security.model.User;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/owners/pay")
@RequiredArgsConstructor
public class KakaoOwnerPayController {

    private final KakaoPayService kakaoPayService;
    private final RedisService redisService;

    @Operation(summary = "자동결제 토큰 생성", description = "카카오페이 인증을 위한 토큰을 생성합니다.")
    @PostMapping("/ready")
    public APIResponse<?> readyKakaoPay(@AuthenticationPrincipal User user, @RequestBody Map<String, String> body) {
        Long userId = user.getId();
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

    @Operation(summary = "자동결제 등록", description = "자동결제를 위한 코드를 저장합니다.")
    @PostMapping("/regist")
    public APIResponse<?> regist(@AuthenticationPrincipal User user, @RequestBody Map<String, String> body) {
        Long userId = user.getId();
        String pgToken = body.get("pgToken");
        kakaoPayService.registPay(userId, pgToken);
        return APIResponse.ofSuccess(null);
    }
}
