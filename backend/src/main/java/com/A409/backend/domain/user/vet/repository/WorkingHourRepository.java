package com.A409.backend.domain.user.vet.repository;

import com.A409.backend.domain.user.vet.dto.WorkingHourDto;
import com.A409.backend.domain.user.vet.entity.Vet;
import com.A409.backend.domain.user.vet.entity.WorkingHour;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkingHourRepository extends JpaRepository<WorkingHour,Long> {
    List<WorkingHour> findByVet_VetId(Long vetId); //수의사 근무시간 목록 조회.

    List<WorkingHour> findAllByVet(Vet vet);

    List<WorkingHourDto> findAllByVet_VetId(Long vetId);
}
