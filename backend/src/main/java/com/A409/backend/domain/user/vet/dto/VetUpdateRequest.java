package com.A409.backend.domain.user.vet.dto;

import lombok.Data;

@Data
public class VetUpdateRequest {
    private String name;
    private String license;
    private String profile;
    private String photo;
}
