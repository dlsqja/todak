package com.A409.backend.domain.user.vet.dto;

import com.A409.backend.domain.hospital.repository.HospitalRepository;
import com.A409.backend.domain.user.vet.entity.Vet;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class VetRequest {

    String name;
    String license;
    String hospitalCode;
    String profile;


    public Vet toEntity(){
        return Vet.builder()
                .name(this.name)
                .license(this.license)
                .profile(this.profile)
                .build();
    }
}
