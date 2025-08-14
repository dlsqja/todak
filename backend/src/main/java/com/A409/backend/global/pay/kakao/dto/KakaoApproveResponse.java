package com.A409.backend.global.pay.kakao.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class KakaoApproveResponse {
    private String aid; //요청 고유 번호 - 승인/취소가 구분된 결제번호
    private String tid; //결제 고유 번호 - 승인/취소가 구분된 결제번호
    private String sid; //정기 결제용 ID, 정기 결제 CID로 단건결제 요청시 발급

    private Amount amount; // 결제 금액 정보
    private String created_at; // 결제 준비 요청 시각
    private String approved_at; // 결제 승인 시각

    @Override
    public String toString() {
        return "KakaoApproveResponse{" +
                "aid='" + aid + '\'' +
                ", tid='" + tid + '\'' +
                ", sid='" + sid + '\'' +
                ", created_at='" + created_at + '\'' +
                ", approved_at='" + approved_at + '\'' +
                amount.toString() +
                '}';
    }
}
