package com.A409.backend.domain.reservation.controller;

import com.A409.backend.domain.reservation.dto.ReservationResponseToVet;
import com.A409.backend.domain.reservation.entity.Reservation;
import com.A409.backend.domain.reservation.service.ReservationService;
import com.A409.backend.global.response.APIResponse;
import com.A409.backend.global.security.model.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reservations/vets")
@RequiredArgsConstructor
public class VetReservationController {

    private final ReservationService reservationService;

    
    @Operation(summary = "예약 승인 목록 조회", description = "수의사가 비대면 진료를 하기위한 예약 승인 목록을 조회합니다.")
    @ApiResponse(responseCode = "200", description = "예약 승인 목록 조회 성공")
    @GetMapping("/")
    public APIResponse<?> getPendingReservations(@AuthenticationPrincipal User user) {
    
        List<Reservation> reservations = reservationService.getReservationsByVetId(user.getId());

        return APIResponse.ofSuccess(reservations.stream().map(reservation -> Map.of(
                "reservationId", reservation.getReservationId(),
                "ownerName", reservation.getOwner().getName(),
                "petName", reservation.getPet().getName(),
                "reservationTime", reservation.getReservationTime()
        )).toList());
    }

    @Operation(summary = "예약 목록 상세 조회", description = "수의사가 진료 시작 전, 해당 예약을 상세조히합니다.")
    @ApiResponse(responseCode = "200", description = "예약 상세 조회 성공")
    @GetMapping("/{reservation_id}")
    public APIResponse<?> getDetailReservation(@AuthenticationPrincipal User user, @PathVariable("reservation_id") Long reservationId) {
        ReservationResponseToVet reservation = reservationService.getReservationDetailByVetId(user.getId(), reservationId);
        return APIResponse.ofSuccess(reservation);
    }
}
