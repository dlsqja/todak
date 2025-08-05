package com.A409.backend.domain.treatment.repository;

import com.A409.backend.domain.treatment.entity.Treatment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TreatmentRepository extends JpaRepository<Treatment,Long> {
    List<Treatment> findAllByOwner_OwnerId(Long ownerOwnerId);
    List<Treatment> findAllByVet_VetId(Long vetId);
}
