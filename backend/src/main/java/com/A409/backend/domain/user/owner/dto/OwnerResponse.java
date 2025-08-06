package com.A409.backend.domain.user.owner.dto;

import com.A409.backend.domain.user.auth.entity.Auth;
import com.A409.backend.domain.user.owner.entity.Owner;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Builder
@Getter
public class OwnerResponse {

    private String name;
    private String phone;
    private LocalDate birth;

    public static OwnerResponse toResponse(Owner owner){
        return OwnerResponse.builder()
                .name(owner.getName())
                .phone(owner.getPhone())
                .build();
    }
}
