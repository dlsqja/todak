package com.A409.backend.global.pay.kakao.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class KakaoPayRequest {
    private String item_name;
    private String partner_order_id;
    private String partner_user_id;
    private Long quantity;
    private Long total_amount;
    private Long vat_amount;
    private Long tax_free_amount;
}
