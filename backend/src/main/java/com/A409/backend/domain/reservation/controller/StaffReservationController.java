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

    @Operation(summary = "수의사 불가능 시간 조회")
    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = HospitalResponse.class)))
    @ApiResponse(responseCode = "200",
            content = @Content(
                    mediaType = "application/json",
                    array = @ArraySchema(schema = @Schema(implementation = 클래스명.class))
            )
    )
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
