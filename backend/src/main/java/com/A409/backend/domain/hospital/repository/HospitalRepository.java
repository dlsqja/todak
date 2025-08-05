package com.A409.backend.domain.hospital.repository;

import com.A409.backend.domain.hospital.entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HospitalRepository extends JpaRepository<Hospital,Long> {
    Optional<Hospital> findByHospitalCode(String hospitalCode);
}
