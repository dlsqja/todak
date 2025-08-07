package com.A409.backend.domain.user.vet.dto;

import com.A409.backend.domain.user.vet.entity.WorkingHour;
import com.A409.backend.global.enums.Day;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkingHourDto {
    private Long workingId;
    private Day day;
    private Byte startTime;
    private Byte endTime;

    public static WorkingHourDto toResponse(WorkingHour workingHour) {
        return WorkingHourDto.builder()
                .workingId(workingHour.getWorkingId())
                .day(workingHour.getDay())
                .startTime(workingHour.getStartTime())
                .endTime(workingHour.getEndTime())
                .build();
    }
}
