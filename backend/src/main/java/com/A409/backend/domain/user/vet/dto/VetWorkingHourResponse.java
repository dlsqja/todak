package com.A409.backend.domain.user.vet.dto;

import com.A409.backend.domain.user.vet.entity.WorkingHour;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VetWorkingHourResponse {
    List<WorkingHourDto> workingHourResponseList;
    Long vetId;

    public static VetWorkingHourResponse toResponse(List<WorkingHour> workingHours) {
        List<WorkingHourDto> workingHourResponses = workingHours.stream()
                .map(WorkingHourDto::toResponse)
                .toList();

        Long vetId = workingHours.get(0).getVet().getVetId();

        return VetWorkingHourResponse.builder()
                .vetId(vetId)
                .workingHourResponseList(workingHourResponses)
                .build();
    }
}
