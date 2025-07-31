package com.A409.backend.domain.hospital.dto;

import com.A409.backend.domain.hospital.entity.Hospital;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class HospitalRequest {

    private String name;
    private String profile;
    private String location;
    private String contact;

    public Hospital toEntity(){
        return Hospital.builder()
                .name(name)
                .profile(profile)
                .location(location)
                .contact(contact)
                .build();
    }

}
