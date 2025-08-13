package com.A409.backend.global.pay.kakao.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class KakaoReadyRequest {
    private String successUrl;
    private String cancelUrl;
    private String failUrl;
    private String partnerOrderId;   // 내부 주문/요청 ID
    private String partnerUserId;    // 내부 사용자 ID
}
