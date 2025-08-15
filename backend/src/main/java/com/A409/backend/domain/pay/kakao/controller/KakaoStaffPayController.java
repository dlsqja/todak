package com.A409.backend.domain.pay.kakao.controller;

import com.A409.backend.domain.pay.kakao.dto.KakaoPayRequest;
import com.A409.backend.domain.pay.kakao.entity.Payment;
import com.A409.backend.domain.pay.kakao.service.KakaoPayService;
import com.A409.backend.global.response.APIResponse;
import com.A409.backend.global.security.model.User;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/staffs/pay")
@RequiredArgsConstructor
public class KakaoStaffPayController {

    private final KakaoPayService kakaoPayService;

    @Operation(summary = "결제 진행", description = "해당 진료 건에 대한 결제를 진행합니다.")
    @PostMapping("/")
    public APIResponse<?> pay(@AuthenticationPrincipal User user, @RequestBody KakaoPayRequest req) {
        kakaoPayService.pay(req);
        return APIResponse.ofSuccess(null);
    }

    @Operation(summary = "결제 건 조회", description = "해당 병원의 결제 건들을 조회합니다.")
    @GetMapping("/")
    public APIResponse<?> paymentList(@AuthenticationPrincipal User user) {
        List<Payment> list = kakaoPayService.getPaymentList(user.getId());
        return APIResponse.ofSuccess(list);
    }
}
