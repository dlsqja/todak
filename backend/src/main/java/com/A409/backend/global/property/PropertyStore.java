package com.A409.backend.global.property;

import java.util.Optional;

public interface PropertyStore {
    Optional<String> get(String key);
}
