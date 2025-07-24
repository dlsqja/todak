package com.A409.backend.domain.vet.entity;

import com.A409.backend.domain.hospital.Hospital;
import com.A409.backend.global.security.entity.Auth;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vet")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "vetId")
public class Vet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vet_id")
    private Long vetId;

    @Column(name = "vet_code", length = 6, nullable = false, unique = true)
    private String vetCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auth_id", nullable = false)
    private Auth auth;

    @Column(length = 20, nullable = false)
    private String name;

    @Column(length = 25, nullable = false)
    private String license;

    @Column(columnDefinition = "TEXT")
    private String profile;

    @Column(length = 255)
    private String photo;
}
