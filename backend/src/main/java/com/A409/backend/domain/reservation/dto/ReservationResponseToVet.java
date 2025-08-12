package com.A409.backend.domain.reservation.dto;

import com.A409.backend.domain.pet.dto.PetResponse;
import com.A409.backend.domain.reservation.entity.Reservation;
import com.A409.backend.domain.user.owner.dto.OwnerResponse;
import com.A409.backend.global.enums.ReservationStatus;
import com.A409.backend.global.enums.Subject;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class ReservationResponseToVet {

    private Long reservationId;
    private OwnerResponse owner;
    private PetResponse pet;
    private LocalDate reservationDay;
    private Byte reservationTime;
    private String photo;
    private String description;
    private Subject subject;

    public static ReservationResponseToVet toResposne(Reservation reservation){
        return ReservationResponseToVet.builder()
                .reservationId(reservation.getReservationId())
                .owner(OwnerResponse.toResponse(reservation.getOwner()))
                .pet(PetResponse.toResponse(reservation.getPet()))
                .reservationDay(reservation.getReservationDay())
                .reservationTime(reservation.getReservationTime())
                .photo(reservation.getPhoto())
                .description(reservation.getDescription())
                .subject(reservation.getSubject())
                .build();
    }

}
