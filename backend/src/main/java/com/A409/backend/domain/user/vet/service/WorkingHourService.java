package com.A409.backend.domain.user.vet.service;

import com.A409.backend.domain.user.vet.dto.WorkingHourResponse;
import com.A409.backend.domain.user.vet.entity.Vet;
import com.A409.backend.domain.user.vet.entity.WorkingHour;
import com.A409.backend.domain.user.vet.repository.WorkingHourRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkingHourService {
    private final WorkingHourRepository workingHourRepository;

    // 수의사 ID를 받아서 근무 시간 목록 조회
    List<WorkingHourResponse> getWorkingHourByVetId(Long vetId){
        return workingHourRepository.findByVet_VetId(vetId)
                .stream()
                .map(WorkingHourResponse::toResponse)
                .toList();
    }

}
