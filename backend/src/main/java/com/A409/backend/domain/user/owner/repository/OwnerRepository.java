package com.A409.backend.domain.user.owner.repository;

import com.A409.backend.domain.user.auth.entity.Auth;
import com.A409.backend.domain.user.owner.entity.Owner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OwnerRepository extends JpaRepository<Owner, Long> {
    Optional<Owner> findByAuth(Auth auth);
}
