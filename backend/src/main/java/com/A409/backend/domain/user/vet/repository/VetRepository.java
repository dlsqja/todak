package com.A409.backend.domain.user.vet.repository;

import com.A409.backend.domain.user.vet.entity.Vet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VetRepository extends JpaRepository<Vet,Long> {
}
