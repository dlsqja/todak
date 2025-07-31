package com.A409.backend.domain.user.vet.dto;

import com.A409.backend.domain.user.vet.entity.Vet;
import lombok.Data;

@Data
public class VetRequest {
    private Long authId;
    private String hospitalCode;
    private String name;
    private String license;
    private String profile;
    private String photo;
}
