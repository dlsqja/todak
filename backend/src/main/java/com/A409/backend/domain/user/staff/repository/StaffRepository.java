package com.A409.backend.domain.user.staff.repository;

import com.A409.backend.domain.user.staff.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StaffRepository extends JpaRepository<Staff,Long> {
}
