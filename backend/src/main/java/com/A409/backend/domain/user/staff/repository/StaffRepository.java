package com.A409.backend.domain.user.staff.repository;

import com.A409.backend.domain.user.auth.entity.Auth;
import com.A409.backend.domain.user.staff.entity.Staff;
import com.A409.backend.domain.user.vet.entity.Vet;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;
import java.util.Optional;

public interface StaffRepository extends JpaRepository<Staff,Long> {
    List<Staff> findAllByHospital_HospitalId(Long hospitalHospitalId);
    Optional<Staff> findByAuth(Auth auth);
}
