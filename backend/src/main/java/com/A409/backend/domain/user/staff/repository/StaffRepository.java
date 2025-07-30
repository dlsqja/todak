package com.A409.backend.domain.user.staff.repository;

import com.A409.backend.domain.user.auth.entity.Auth;
import com.A409.backend.domain.user.staff.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StaffRepository extends JpaRepository<Staff,Long> {
    Optional<Staff> findStaffByStaffId_AuthId(Long authId);
}
