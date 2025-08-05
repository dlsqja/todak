package com.A409.backend.domain.user.vet.controller;

import com.A409.backend.domain.user.vet.dto.WorkingHourResponse;
import com.A409.backend.domain.user.vet.service.WorkingHourService;
import com.A409.backend.global.response.APIResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/vets")
@RequiredArgsConstructor
public class WorkingHourController {
    private final WorkingHourService workingHourService;

    @Operation(summary = "수의사 업무시간", description = "수의사가 등록해놓은 요일별 업무시간을 조회합니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "업무시간 조회 성공")
    @GetMapping("/{vet_id}/working-hours")
    public APIResponse<?> getWorkingHours(@PathVariable("vet_id") Long vetId) {
        List<WorkingHourResponse> workingHours = workingHourService.getWorkingHourByVetId(vetId);

        return APIResponse.ofSuccess(workingHours);
    }
}
