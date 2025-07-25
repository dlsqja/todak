package com.A409.backend.domain.user.auth.repository;

import com.A409.backend.domain.user.auth.entity.Auth;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthRepository extends JpaRepository<Auth, Long> {
}
