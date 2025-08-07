package com.A409.backend.domain.user.owner.dto;

import com.A409.backend.domain.user.owner.entity.Owner;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;


@Setter
@Getter
public class OwnerRequest {
    private String name;
    private String phone;
    private LocalDate birth;

    public Owner toEntity() {
        return Owner.builder()
                .name(name)
                .phone(phone)
                .birth(birth)
                .build();
    }
}
