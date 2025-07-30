package com.A409.backend.domain.reservation.controller;


import com.A409.backend.domain.reservation.dto.ReservationReqeust;
import com.A409.backend.domain.reservation.dto.ReservationResponse;
import com.A409.backend.domain.reservation.entity.Reservation;
import com.A409.backend.domain.reservation.service.ReservationService;
import com.A409.backend.global.response.ApiResponse;
import com.A409.backend.global.security.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RequestMapping("/reservation/owner")
@RestController
@RequiredArgsConstructor
public class OwnerReservationController {

    private final ReservationService reservationService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<?> createReservation(
            @AuthenticationPrincipal User user,
                @RequestPart("data") ReservationReqeust reservationReqeust,
            @RequestPart(value = "photo", required = false) MultipartFile photo
    ) {

        reservationService.createReservation(user.getId(),reservationReqeust,photo);


        return ApiResponse.ofSuccess(null);
    }

    @GetMapping
    public ApiResponse<?> getReservations(@AuthenticationPrincipal User user ) {

        List<Map<String, Object>> ownerReservations = reservationService.getReservations(user.getId());

        return ApiResponse.ofSuccess(ownerReservations);
    }

    @GetMapping("/{reservation_id}")
    public ApiResponse<?> getReservationDetail(@AuthenticationPrincipal User user,@PathVariable("reservation_id")Long reservationId) {

        ReservationResponse reservation = reservationService.getReservationDetail(user.getId(),reservationId);

        return ApiResponse.ofSuccess(reservation);
    }

}
