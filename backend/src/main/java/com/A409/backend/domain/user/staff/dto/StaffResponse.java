package com.A409.backend.domain.user.staff.dto;

import com.A409.backend.domain.user.staff.entity.Staff;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StaffResponse {

    private String name;
    private String profile;

    public static StaffResponse toResponse(Staff staff){
        return StaffResponse.builder()
                .name(staff.getName())
                .build();
    }
}
