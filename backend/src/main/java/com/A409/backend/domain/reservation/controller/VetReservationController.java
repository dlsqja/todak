package com.A409.backend.domain.reservation.controller;

import com.A409.backend.domain.reservation.dto.ReservationResponseToVet;
import com.A409.backend.domain.reservation.entity.Reservation;
import com.A409.backend.domain.reservation.service.ReservationService;
import com.A409.backend.global.response.APIResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reservation/vets")
@RequiredArgsConstructor
public class VetReservationController {

    private final ReservationService reservationService;

    // 목록 조회는 최소 필요부분만, 선택 할 시 detail 조회하도록
    @Operation(summary = "예약 승인 목록 조회", description = "수의사가 비대면 진료를 하기위한 예약 승인 목록을 조회합니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "예약 승인 목록 조회 성공")
//    @GetMapping("/")
    @GetMapping("/{vet_id}")
    //배포 시에는 Authentication으로 해서 vet.getVetId() 받아오도록
    //public ApiResponse<?> getPendingReservations(@AuthenticationPrincipal Vet vet, @PathVariable("vet_id") Long vetId) {
    public APIResponse<?> getPendingReservations(@PathVariable("vet_id") Long vetId) {
        List<Reservation> reservations = reservationService.getReservationsByVetId(vetId);

        return APIResponse.ofSuccess(reservations.stream().map(reservation -> Map.of(
                "reservationId", reservation.getReservationId(),
                "ownerName", reservation.getOwner().getName(),
                "petName", reservation.getPet().getName(),
                "reservationTime", reservation.getReservationTime()
        )).toList());
    }

    @Operation(summary = "예약 목록 상세 조회", description = "수의사가 진료 시작 전, 해당 예약을 상세조히합니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "예약 상세 조회 성공")
//    @GetMapping("/{reservation_id}")
    @GetMapping("/{vet_id}/{reservation_id}")
//    public ApiResponse<?> getDetailReservation(@AuthenticationPrincipal Vet vet, @PathVariable("reservation_id") Long reservationId) {
    public APIResponse<?> getDetailReservation(@PathVariable("vet_id") Long vetId, @PathVariable("reservation_id") Long reservationId) {
        ReservationResponseToVet reservation = reservationService.getReservationDetailByVetId(vetId, reservationId);
        return APIResponse.ofSuccess(reservation);
    }
}
