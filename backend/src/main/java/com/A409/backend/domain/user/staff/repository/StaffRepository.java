package com.A409.backend.domain.user.staff.repository;

import com.A409.backend.domain.user.staff.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StaffRepository extends JpaRepository<Staff,Long> {
    List<Staff> findAllByHospital_HospitalId(Long hospitalHospitalId);
}
