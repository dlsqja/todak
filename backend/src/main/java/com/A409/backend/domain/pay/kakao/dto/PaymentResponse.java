package com.A409.backend.domain.pay.kakao.dto;

import com.A409.backend.domain.pay.kakao.entity.Payment;
import com.A409.backend.domain.pet.dto.PetResponse;
import com.A409.backend.domain.user.vet.dto.VetResponse;
import com.A409.backend.global.enums.Subject;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class PaymentResponse {
    private Long paymentId;
    private Long amount;
    private Boolean isCompleted;
    private LocalDateTime completeTime; // 결제 완료 시간
    private PetResponse pet;
    private VetResponse vet;
    private LocalDateTime startTime; // 진료 시작 시간
    private LocalDateTime endTime; // 진료 완료 시간
    private Subject subject; // 진료과목
    private String hospitalName;

    public static PaymentResponse toResponse(Payment payment) {
        return PaymentResponse.builder()
                .paymentId(payment.getPaymentId())
                .amount(payment.getAmount())
                .isCompleted(payment.getIsCompleted())
                .completeTime(payment.getCompleteTime())
                .pet(PetResponse.toResponse(payment.getTreatment().getPet()))
                .vet(VetResponse.toResponse(payment.getTreatment().getVet()))
                .startTime(payment.getTreatment().getStartTime())
                .endTime(payment.getTreatment().getEndTime())
                .subject(payment.getTreatment().getReservation().getSubject())
                .hospitalName(payment.getHospital().getName())
                .build();
    }
}
