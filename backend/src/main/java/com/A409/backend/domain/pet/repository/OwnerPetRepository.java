package com.A409.backend.domain.pet.repository;

import com.A409.backend.domain.pet.entity.OwnerPet;
import com.A409.backend.domain.pet.entity.Pet;
import com.A409.backend.domain.user.owner.entity.Owner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OwnerPetRepository extends JpaRepository<OwnerPet,Long> {

    Optional<List<OwnerPet>> findOwnerPetByOwner_OwnerId(Long ownerOwnerId);

    Optional<OwnerPet> findOwnerPetByOwner_OwnerIdAndPet_PetId(Long ownerOwnerId, Long petPetId);
}
