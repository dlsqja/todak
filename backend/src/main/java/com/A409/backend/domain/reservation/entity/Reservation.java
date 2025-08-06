package com.A409.backend.domain.reservation.entity;

import com.A409.backend.domain.hospital.entity.Hospital;
import com.A409.backend.domain.user.owner.entity.Owner;
import com.A409.backend.domain.pet.entity.Pet;
import com.A409.backend.domain.user.vet.entity.Vet;
import com.A409.backend.global.enums.ReservationStatus;
import com.A409.backend.global.enums.Subject;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "reservation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reservation_id")
    private Long reservationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private Owner owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vet_id", nullable = false)
    private Vet vet;

    @Column(name = "reservation_day", nullable = false)
    private LocalDate reservationDay;

    @Column(name = "reservation_time", nullable = false)
    private Byte reservationTime;

    @Column(length = 255)
    private String photo;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Subject subject;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status;
}

