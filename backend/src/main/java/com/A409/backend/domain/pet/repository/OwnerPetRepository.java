package com.A409.backend.domain.pet.repository;

import com.A409.backend.domain.pet.entity.OwnerPet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OwnerPetRepository extends JpaRepository<OwnerPet,Long> {
}
