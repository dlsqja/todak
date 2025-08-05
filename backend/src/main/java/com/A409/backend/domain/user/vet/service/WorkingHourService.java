package com.A409.backend.domain.user.vet.service;

import com.A409.backend.domain.user.vet.dto.WorkingHourResponse;
import com.A409.backend.domain.user.vet.entity.Vet;
import com.A409.backend.domain.user.vet.entity.WorkingHour;
import com.A409.backend.domain.user.vet.repository.VetRepository;
import com.A409.backend.domain.user.vet.repository.WorkingHourRepository;
import com.A409.backend.global.enums.ErrorCode;
import com.A409.backend.global.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class WorkingHourService {
    private final WorkingHourRepository workingHourRepository;
    private final VetRepository vetRepository;

    // 수의사 ID를 받아서 근무 시간 목록 조회
    public List<WorkingHourResponse> getWorkingHourByVetId(Long vetId){
        return workingHourRepository.findByVet_VetId(vetId)
                .stream()
                .map(WorkingHourResponse::toResponse)
                .toList();
    }
    public List<Map<String, Object>> getWorkingHoursAndVet(Long hospital_id){
        return null;
    }

    // 해당 workingHour를 추가 및 수정
    @Transactional
    public List<WorkingHour> putWorkingHours(Long vetId,List<WorkingHourResponse> workingHours) {
        Vet vet = vetRepository.findVetByVetId(vetId).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        List<WorkingHour> whs = workingHourRepository.saveAll(workingHours.stream().map(wh ->
                WorkingHour.builder()
                        .workingId(wh.getWorkingId())
                        .day(wh.getDay())
                        .vet(vet)
                        .startTime(wh.getStartTime())
                        .endTime(wh.getEndTime())
                        .build()
        ).toList());

        return workingHourRepository.saveAll(whs);
    }

}
