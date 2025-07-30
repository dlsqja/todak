package com.A409.backend.domain.reservation.dto;

import com.A409.backend.domain.hospital.entity.Hospital;
import com.A409.backend.domain.pet.entity.Pet;
import com.A409.backend.domain.reservation.entity.Reservation;
import com.A409.backend.domain.user.owner.entity.Owner;
import com.A409.backend.domain.user.vet.entity.Vet;
import com.A409.backend.global.enums.Status;
import com.A409.backend.global.enums.Subject;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
public class ReservationReqeust {

    private Long ownerId;
    private Long petId;
    private Long hospitalId;
    private Long vetId;
    private LocalDate reservationDay;
    private Byte reservationTime;
    private String description;
    private Subject subject;
    private Status status;

    public Reservation toEntity() {
        Owner owner = Owner.builder().ownerId(ownerId).build();
        Pet pet = Pet.builder().petId(petId).build();
        Hospital hospital = Hospital.builder().hospitalId(hospitalId).build();
        Vet vet = Vet.builder().vetId(vetId).build();

        return Reservation.builder()
                .owner(owner)
                .pet(pet)
                .hospital(hospital)
                .vet(vet)
                .reservationDay(reservationDay)
                .reservationTime(reservationTime)
                .description(description)
                .subject(subject)
                .status(status)
                .build();
    }
}
