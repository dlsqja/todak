package com.A409.backend.domain.reservation.controller;

import com.A409.backend.global.annotation.LogExecutionTime;
import com.A409.backend.global.elasticsearch.Entity.HospitalDocument;
import com.A409.backend.global.response.ApiResponse;
import com.A409.backend.global.security.model.User;
import com.A409.backend.global.util.redis.RedisService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.TimeUnit;

@RequestMapping("/reservation/hospitals")
@RestController
@RequiredArgsConstructor
public class StaffReservationController {

    private final RedisService redisService;

    @GetMapping("/{vet_id}/closing-hours")
    public ApiResponse<?> getClosingHours(@AuthenticationPrincipal User user, @PathVariable("vet_id") Long vetId) {
        String cacheKey = "closinghours:" + vetId;

        List<Integer> cachedTimes = (List<Integer>) redisService.getByKey(cacheKey);

        return ApiResponse.ofSuccess(cachedTimes);
    }

    @PostMapping("/{vet_id}/closing-hours")
    public ApiResponse<?> updateClosingHours(@AuthenticationPrincipal User user, @PathVariable("vet_id") Long vetId,@RequestBody List<Integer> closingTimes) {
        String cacheKey = "closinghours:" + vetId;

        redisService.setByKey(cacheKey,closingTimes);

        return ApiResponse.ofSuccess(null);
    }
}
