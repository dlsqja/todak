package com.A409.backend.domain.treatment.repository;

import com.A409.backend.domain.treatment.entity.Treatment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TreatmentRepository extends JpaRepository<Treatment,Long> {
}
