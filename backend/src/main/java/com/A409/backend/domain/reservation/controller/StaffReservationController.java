package com.A409.backend.domain.reservation.controller;


import com.A409.backend.global.enums.Status;
import com.A409.backend.global.response.APIResponse;
import com.A409.backend.global.security.model.User;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/reservations/hospitals")
@RestController
@RequiredArgsConstructor
public class StaffReservationController {

    @GetMapping
    public APIResponse<?> getAllHospitalReservations(@AuthenticationPrincipal User user){
        return null;
    }


    @GetMapping(params = "type")
    public APIResponse<?> getHospitalReservationsByType(@AuthenticationPrincipal User user, @RequestParam Status status){
        return null;
    }


    @GetMapping("/{reservation_id}")
    public APIResponse<?> getHospitalReservationDetail(@AuthenticationPrincipal User user, @PathVariable("reservation_id") Long reservationId){
        return null;
    }
}
