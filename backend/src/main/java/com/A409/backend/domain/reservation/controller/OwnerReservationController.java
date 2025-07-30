package com.A409.backend.domain.reservation.controller;


import com.A409.backend.domain.reservation.dto.ReservationReqeust;
import com.A409.backend.global.response.ApiResponse;
import com.A409.backend.global.security.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RequestMapping("/reservation/owner")
@RestController
@RequiredArgsConstructor
public class OwnerReservationController {

    /*
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<?> createReservation(
            @AuthenticationPrincipal User user,
            @RequestPart("data") ReservationReqeust reservationReqeust,
            @RequestPart(value = "photo", required = false) MultipartFile photo
    ) {




    }
    */
}
