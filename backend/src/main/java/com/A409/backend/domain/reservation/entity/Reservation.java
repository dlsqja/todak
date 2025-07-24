package com.A409.backend.domain.reservation.entity;

import com.A409.backend.domain.hospital.entity.Hospital;
import com.A409.backend.domain.owner.entity.Owner;
import com.A409.backend.domain.pet.entity.Pet;
import com.A409.backend.domain.vet.entity.Vet;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "reservation")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "reservationId")
public class Reservation {
    public enum Subject {
        치과, 피부과, 골절, 안과
    }

    public enum Status {
        신청, 승인, 반려, 완료
    }

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
    private Status status;
}

