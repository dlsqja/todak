package com.A409.backend.domain.pet.entity;

import com.A409.backend.domain.user.owner.entity.Owner;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "owner_pet")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OwnerPet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "owner_pet_id")
    private Long ownerPetId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private Owner owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;
}

