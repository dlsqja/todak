package com.A409.backend.domain.user.vet.controller;

import com.A409.backend.domain.user.vet.dto.WorkingHourResponse;
import com.A409.backend.domain.user.vet.entity.WorkingHour;
import com.A409.backend.domain.user.vet.service.WorkingHourService;
import com.A409.backend.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// ClosingHour는 매일매일 초기화됨. -> redis로 다루는 건 어떨까?
@RestController
@RequestMapping("/vets")
@RequiredArgsConstructor
public class WorkingHourController {
    private final WorkingHourService workingHourService;

    @Operation(summary = "수의사 근무시간", description = "수의사가 등록해놓은 요일별 근무시간을 조회합니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "근무시간 조회 성공")
    @GetMapping("/{vet_id}/workinghours")
    public ApiResponse<?> getWorkingHours(@PathVariable("vet_id") Long vetId) {
        List<WorkingHourResponse> workingHours = workingHourService.getWorkingHourByVetId(vetId);

        return ApiResponse.ofSuccess(workingHours);
    }

    // 근무시간은 여러개 등록 가능 -> (월, 화, 수, 목, 금, 토, 일 을 한번에 수정하고 한번에 저장이 일반적)
    @Operation(summary = "수의사 근무시간 수정", description = "수의사의 근무시간을 수정합니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "근무시간 수정 성공")
    @PostMapping("/{vet_id}/workinghours")
    public ApiResponse<?> putWorkingHours(@PathVariable("vet_id") Long vetId, @RequestBody List<WorkingHourResponse> workingHour) {
        List<WorkingHour> workingHours = workingHourService.putWorkingHours(vetId, workingHour);

        return ApiResponse.ofSuccess(workingHours.stream().map(WorkingHourResponse::toResponse).toList());
    }
}
