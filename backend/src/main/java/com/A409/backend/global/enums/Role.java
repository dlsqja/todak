package com.A409.backend.global.enums;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum Role {
    OWNER,
    VET,
    STAFF;

    public String toString() {
        return this.name();
    }
}
