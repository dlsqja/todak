package com.A409.backend.domain.user.owner.entity;

import com.A409.backend.domain.user.auth.entity.Auth;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Builder
@Getter
public class OwnerResponse {

    private Long ownerId;
    private String name;
    private String phone;
    private LocalDate birth;

    public static OwnerResponse toResponse(Owner owner){
        return OwnerResponse.builder()
                .ownerId(owner.getOwnerId())
                .name(owner.getName())
                .phone(owner.getPhone())
                .birth(owner.getBirth())
                .build();
    }
}
