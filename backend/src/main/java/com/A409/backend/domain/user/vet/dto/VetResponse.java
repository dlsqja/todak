package com.A409.backend.domain.user.vet.dto;

import com.A409.backend.domain.hospital.entity.Hospital;
import com.A409.backend.domain.user.auth.entity.Auth;
import com.A409.backend.domain.user.vet.entity.Vet;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class VetResponse {

    private Long vetId;
    private String name;
    private String profile;
    private String photo;

    public static VetResponse toResponse(Vet vet){

        return VetResponse.builder()
                .vetId(vet.getVetId())
                .name(vet.getName())
                .profile(vet.getProfile())
                .photo(vet.getPhoto())
                .build();

    }
}
