package com.A409.backend.global.enums;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum Role {
    ROLE_OWNER,
    ROLE_VET,
    ROLE_STAFF;

    public String toString() {
        return this.name();
    }
}
