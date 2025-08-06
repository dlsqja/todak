package com.A409.backend.domain.reservation.dto;

import com.A409.backend.domain.hospital.entity.Hospital;
import com.A409.backend.domain.pet.dto.PetResponse;
import com.A409.backend.domain.pet.entity.Pet;
import com.A409.backend.domain.reservation.entity.Reservation;
import com.A409.backend.domain.user.owner.entity.Owner;
import com.A409.backend.domain.user.owner.entity.OwnerResponse;
import com.A409.backend.domain.user.vet.entity.Vet;
import com.A409.backend.global.enums.ReservationStatus;
import com.A409.backend.global.enums.Subject;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class ReservationResponse {

    private Long reservationId;
    private OwnerResponse onwer;
    private PetResponse pet;
    private String hospitalName;
    private String vetName;
    private LocalDate reservationDay;
    private Byte reservationTime;
    private String photo;
    private String description;
    private Subject subject;
    private ReservationStatus status;

    public static ReservationResponse toOwnerResponse(Reservation reservation){
        return ReservationResponse.builder()
                .reservationId(reservation.getReservationId())
                .pet(PetResponse.toResponse(reservation.getPet()))
                .hospitalName(reservation.getHospital().getName())
                .vetName(reservation.getVet().getName())
                .reservationDay(reservation.getReservationDay())
                .reservationTime(reservation.getReservationTime())
                .photo(reservation.getPhoto())
                .description(reservation.getDescription())
                .subject(reservation.getSubject())
                .status(reservation.getStatus())
                .build();
    }

}
