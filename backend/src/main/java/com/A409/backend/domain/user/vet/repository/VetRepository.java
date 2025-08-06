package com.A409.backend.domain.user.vet.repository;

import com.A409.backend.domain.hospital.entity.Hospital;
import com.A409.backend.domain.user.auth.entity.Auth;
import com.A409.backend.domain.user.vet.entity.Vet;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;
import java.util.Optional;

public interface VetRepository extends JpaRepository<Vet,Long> {
    List<Vet> findVetsByHospital_HospitalId(Long hospitalId);
    Optional<Vet> findVetByVetId(Long vetId);
    Optional<Vet> findByAuth(Auth auth);
}
