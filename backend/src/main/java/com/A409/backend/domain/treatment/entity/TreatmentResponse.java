package com.A409.backend.domain.treatment.entity;

import com.A409.backend.domain.pet.dto.PetResponse;
import com.A409.backend.domain.user.owner.dto.OwnerResponse;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class TreatmentResponse {

    private Long treatmentId;
    private Long reservationId;
    private OwnerResponse owner;
    private String vetName;
    private PetResponse pet;
    private Boolean isCompleted;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String result;
    private String aiSummary;

    public static TreatmentResponse toVetResponse(Treatment treatment) {
        return TreatmentResponse.builder()
                .treatmentId(treatment.getTreatmentId())
                .reservationId(treatment.getReservation().getReservationId())
                .owner(OwnerResponse.toResponse(treatment.getOwner()))
                .vetName(treatment.getVet().getName())
                .pet(PetResponse.toResponse(treatment.getPet()))
                .isCompleted(treatment.getIsCompleted())
                .startTime(treatment.getStartTime())
                .endTime(treatment.getEndTime())
                .result(treatment.getResult())
                .aiSummary(treatment.getAiSummary())
                .build();
    }
}
