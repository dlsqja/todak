package com.A409.backend.domain.reservation.controller;


import com.A409.backend.domain.hospital.entity.Hospital;
import com.A409.backend.domain.hospital.service.HospitalService;
import com.A409.backend.domain.reservation.dto.ReservationResponse;
import com.A409.backend.domain.reservation.service.ReservationService;
import com.A409.backend.domain.user.staff.entity.Staff;
import com.A409.backend.domain.user.staff.repository.StaffRepository;
import com.A409.backend.global.enums.Status;
import com.A409.backend.global.response.ApiResponse;
import com.A409.backend.global.security.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.elasticsearch.ResourceNotFoundException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequestMapping("/reservations/hospitals")
@RestController
@RequiredArgsConstructor
public class StaffReservationController {

    private ReservationService reservationService;
    private HospitalService hospitalService;
    private StaffRepository staffRepository;

    @GetMapping
    public ApiResponse<?> getAllHospitalReservations(@AuthenticationPrincipal User user){
        Long hospitalId = user.getId();
        List<Map<String, Object>> hospitalReservations = reservationService.getHospitalReservations(hospitalId);
        return ApiResponse.ofSuccess(hospitalReservations);
    }
    @GetMapping(params = "status")
    public ApiResponse<?> getHospitalReservationsByType(@AuthenticationPrincipal User user, @RequestParam("status") int code){
        Long hospitalId = user.getId();
        Status status = switch (code) {
            case 0 -> Status.REQUESTED;
            case 1 -> Status.APPROVED;
            case 2 -> Status.REJECTED;
            case 3 -> Status.COMPLETED;
            default -> throw new IllegalArgumentException("Invalid status code: " + code);
        };
        List<Map<String, Object>> hospitalReservations = reservationService.getReservationsByHospitalAndStatus(hospitalId, status);
        return ApiResponse.ofSuccess(hospitalReservations);
    }
    @GetMapping("/{reservation_id}")
    public ApiResponse<?> getHospitalReservationDetail(@AuthenticationPrincipal User user, @PathVariable("reservation_id") Long reservationId){
        ReservationResponse reservationResponse = reservationService.getHospitalReservationDetail(user.getId(), reservationId);
        return ApiResponse.ofSuccess(reservationResponse);
    }
}
