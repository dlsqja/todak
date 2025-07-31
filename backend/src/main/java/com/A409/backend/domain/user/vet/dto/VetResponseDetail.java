package com.A409.backend.domain.user.vet.dto;

import com.A409.backend.domain.hospital.dto.HospitalResponse;
import com.A409.backend.domain.hospital.entity.Hospital;
import com.A409.backend.domain.user.vet.entity.Vet;
import lombok.Builder;

@Builder
public class VetResponseDetail {

    private HospitalResponse hospital;
    private String name;
    private String license;
    private String profile;
    private String photo;

    public static VetResponseDetail toResponse(Vet vet){

        return VetResponseDetail.builder()
                .hospital(HospitalResponse.toResponse(vet.getHospital()))
                .name(vet.getName())
                .license(vet.getLicense())
                .profile(vet.getProfile())
                .photo(vet.getPhoto())
                .build();

    }
}
