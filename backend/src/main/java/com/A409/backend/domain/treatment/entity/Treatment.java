package com.A409.backend.domain.treatment.entity;

import com.A409.backend.domain.hospital.entity.Hospital;
import com.A409.backend.domain.pet.entity.Pet;
import com.A409.backend.domain.reservation.entity.Reservation;
import com.A409.backend.domain.user.owner.entity.Owner;
import com.A409.backend.domain.user.vet.entity.Vet;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "treatment")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
public class Treatment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "treatment_id")
    private Long treatmentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vet_id", nullable = false)
    private Vet vet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private Owner owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @Column(name = "is_completed", nullable = false)
    @Builder.Default
    private Boolean isCompleted=false;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    @Column(columnDefinition = "TEXT")
    private String result;

    @Column(columnDefinition = "TEXT")
    private String aiSummary;
}

