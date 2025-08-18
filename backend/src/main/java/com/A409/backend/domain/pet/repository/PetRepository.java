package com.A409.backend.domain.pet.repository;

import com.A409.backend.domain.pet.entity.Pet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PetRepository extends JpaRepository<Pet,Long> {

    Optional<Pet> findPetByPetCode(String petCode);
    Optional<Pet> findPetByPetId(Long petId);
}
