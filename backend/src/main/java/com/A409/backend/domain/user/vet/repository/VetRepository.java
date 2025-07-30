package com.A409.backend.domain.user.vet.repository;

import com.A409.backend.domain.user.auth.entity.Auth;
import com.A409.backend.domain.user.vet.entity.Vet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VetRepository extends JpaRepository<Vet,Long> {
    Optional<Vet> findVetByVetId_AuthId(Long authId);
}
