package com.A409.backend.domain.user.vet.dto;

import com.A409.backend.domain.user.vet.entity.WorkingHour;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkingHourResponse {
    private String day;
    private Byte startTime;
    private Byte endTime;

    public static WorkingHourResponse toResponse(WorkingHour workingHour) {
        return WorkingHourResponse.builder()
                .day(workingHour.getDay())
                .startTime(workingHour.getStartTime())
                .endTime(workingHour.getEndTime())
                .build();
    }
}
