package com.A409.backend.domain.user.vet.repository;

import com.A409.backend.domain.user.vet.entity.ClosingHour;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClosingHourRepository extends JpaRepository<ClosingHour,Long> {
    List<ClosingHour> findByVet_VetId(Long vetId); // 수의사의 closingHour 조회

}
