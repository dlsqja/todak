package com.A409.backend.domain.user.owner.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class OwnerRequest {
    private String name;
    private String phone;
    private LocalDate birth;
}
