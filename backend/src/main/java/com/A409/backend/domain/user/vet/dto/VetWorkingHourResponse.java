package com.A409.backend.domain.user.vet.dto;

import com.A409.backend.domain.user.vet.entity.Vet;

import java.util.List;

public class VetWorkingHourResponse {
    List<WorkingHourResponse> workingHourResponseList;
    Long vetId;

    public static VetWorkingHourResponse toResponse(Vet vet) {
        return null;
    }
}
