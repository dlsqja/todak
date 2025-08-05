package com.A409.backend.domain.user.vet.controller;

import com.A409.backend.domain.user.vet.entity.ClosingHour;
import com.A409.backend.domain.user.vet.service.ClosingHourService;
import com.A409.backend.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/vets")
@RequiredArgsConstructor
public class ClosingHourController {
    private final ClosingHourService closingHourService;

    @Operation(summary = "수의사의 닫힌 스케줄 조회", description = "예약창 관리를 위해서 닫힌 스케줄들을 조회합니다.")
    @GetMapping("/{vet_id}/closinghours")
    public ApiResponse<?> getClosingHours(@PathVariable("vet_id") Long vetId) {
        List<ClosingHour> closingHours = closingHourService.getClosingHoursByVetId(vetId);

        return ApiResponse.ofSuccess(
                closingHours.stream().map(hour -> Map.of(
                        "closingId", hour.getClosingId(),
                        "time", hour.getTime()
                )).toList()
        );
    }

}
