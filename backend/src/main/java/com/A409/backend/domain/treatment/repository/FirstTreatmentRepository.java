package com.A409.backend.domain.treatment.repository;

import com.A409.backend.domain.treatment.entity.FirstTreatment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FirstTreatmentRepository extends JpaRepository<FirstTreatment,Long> {
    boolean existsByOwner_OwnerId(Long ownerId);
}
