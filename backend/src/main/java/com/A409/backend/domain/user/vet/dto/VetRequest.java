package com.A409.backend.domain.user.vet.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VetRequest {
    String name;
    String license;
    Long hospitalCode;
    String profile;
    String photo;
}
