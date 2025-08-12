package com.A409.backend.domain.treatment.dto;

import com.A409.backend.domain.treatment.entity.Treatment;
import jakarta.persistence.Column;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class TreatementResponse {

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String aiSummary;

    public static TreatementResponse toResponse(Treatment treatment){
        return TreatementResponse.builder()
                .startTime(treatment.getStartTime())
                .endTime(treatment.getEndTime())
                .aiSummary(treatment.getAiSummary())
                .build();
    }
}
