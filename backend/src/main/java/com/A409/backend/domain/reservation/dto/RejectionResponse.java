package com.A409.backend.domain.reservation.dto;

import com.A409.backend.domain.reservation.entity.Rejection;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Builder
public class RejectionResponse {

    private String reason;

    public static RejectionResponse toResponse(Rejection rejection) {
        return RejectionResponse.builder()
                .reason(rejection.getReason())
                .build();
    }
}
