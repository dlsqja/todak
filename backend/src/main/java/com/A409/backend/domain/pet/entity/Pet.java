package com.A409.backend.domain.pet.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pet")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pet {
    public enum Species {
        DOG, CAT, OTHER
    }

    public enum Gender {
        MALE, FEMALE, NON
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pet_id")
    private Long petId;

    @Column(name = "pet_code", length = 6, nullable = false, unique = true)
    private String petCode;

    @Column(length = 30, nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Species species;

    @Column(length = 255)
    private String photo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Gender gender = Gender.NON;

    @Column(nullable = false)
    private Integer age;
}

