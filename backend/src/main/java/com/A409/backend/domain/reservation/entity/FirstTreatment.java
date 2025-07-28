package com.A409.backend.domain.reservation.entity;

import com.A409.backend.domain.hospital.entity.Hospital;
import com.A409.backend.domain.user.owner.entity.Owner;
import com.A409.backend.domain.pet.entity.Pet;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "first_treatment")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FirstTreatment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "first_treatment_id")
    private Long firstTreatmentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private Owner owner;
}

