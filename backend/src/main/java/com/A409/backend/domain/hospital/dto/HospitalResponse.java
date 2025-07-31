package com.A409.backend.domain.hospital.dto;

import com.A409.backend.domain.hospital.entity.Hospital;
import jakarta.persistence.Column;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class HospitalResponse {

    private Long hospitalId;
    private String name;
    private String profile;
    private String location;
    private String contact;

    public static HospitalResponse toResponse(Hospital hospital){
        return HospitalResponse.builder()
                .hospitalId(hospital.getHospitalId())
                .name(hospital.getName())
                .profile(hospital.getProfile())
                .location(hospital.getLocation())
                .contact(hospital.getContact())
                .build();
    }
}
