package com.A409.backend.domain.hospital.repository;

import com.A409.backend.domain.hospital.entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HospitalRepository extends JpaRepository<Hospital,Long> {
    Hospital findByHospitalCode(String hospitalCode);
}
