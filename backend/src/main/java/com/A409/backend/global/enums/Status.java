package com.A409.backend.global.enums;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

public enum Status {
    REQUESTED,
    APPROVED,
    REJECTED,
    COMPLETED
}
