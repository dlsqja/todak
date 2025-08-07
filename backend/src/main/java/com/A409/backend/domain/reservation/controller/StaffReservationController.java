package com.A409.backend.domain.reservation.controller;


import com.A409.backend.domain.hospital.service.HospitalService;
import com.A409.backend.domain.reservation.dto.ReservationResponse;
import com.A409.backend.domain.reservation.service.ReservationService;
import com.A409.backend.domain.user.staff.repository.StaffRepository;
import com.A409.backend.global.enums.ErrorCode;
import com.A409.backend.global.enums.ReservationStatus;
import com.A409.backend.global.exception.CustomException;
import com.A409.backend.global.response.APIResponse;
import com.A409.backend.global.security.model.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequestMapping("/reservations/hospitals")
@RestController
@RequiredArgsConstructor
public class StaffReservationController {

    private final ReservationService reservationService;
    private final HospitalService hospitalService;
    private final StaffRepository staffRepository;

    @Operation(summary = "병원 예약 리스트 필터 조회")
    @ApiResponse(responseCode = "200",
            content = @Content(
                    mediaType = "application/json",
                    array = @ArraySchema(schema = @Schema(implementation = Map.class))
            )
    )
    @GetMapping("/")
    public APIResponse<?> getHospitalReservationsByType(@AuthenticationPrincipal User user, @RequestParam("status") ReservationStatus reservationStatus){
        Long hospitalId = user.getId();

        List<Map<String, Object>> hospitalReservations = reservationService.getReservationsByHospitalAndStatus(hospitalId, reservationStatus);
        return APIResponse.ofSuccess(hospitalReservations);
    }

    @Operation(summary = "병원 예약 리스트 모두 조회")
    @ApiResponse(responseCode = "200",
            content = @Content(
                    mediaType = "application/json",
                    array = @ArraySchema(schema = @Schema(implementation = Map.class))
            )
    )
    @GetMapping("")
    public APIResponse<?> getHospitalReservations(@AuthenticationPrincipal User user){
        Long hospitalId = user.getId();

        List<Map<String, Object>> hospitalReservations = reservationService.getHospitalReservations(hospitalId);
        return APIResponse.ofSuccess(hospitalReservations);
    }

    @Operation(summary = "예약 상세 조회")
    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = ReservationResponse.class)))
    @GetMapping("/{reservation_id}")
    public APIResponse<?> getHospitalReservationDetail(@AuthenticationPrincipal User user, @PathVariable("reservation_id") Long reservationId){
        ReservationResponse reservationResponse = reservationService.getHospitalReservationDetail(user.getId(), reservationId);
        return APIResponse.ofSuccess(reservationResponse);
    }

    @Operation(summary = "예약 승인")
    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = ReservationResponse.class)))
    @PatchMapping("/approve/{reservation_id}")
    public APIResponse<?> approveReservation(@AuthenticationPrincipal User user, @PathVariable("reservation_id") Long reservationId){
        reservationService.approveReservation(user.getId(), reservationId);
        return APIResponse.ofSuccess(null);
    }
}
