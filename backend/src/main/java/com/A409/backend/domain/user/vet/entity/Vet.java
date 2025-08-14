package com.A409.backend.domain.user.vet.entity;

import com.A409.backend.domain.hospital.entity.Hospital;
import com.A409.backend.domain.user.auth.entity.Auth;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vet")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class Vet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vet_id")
    private Long vetId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auth_id", nullable = false,unique = true)
    private Auth auth;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

    @Column(length = 20, nullable = false)
    private String name;

    @Column(length = 25, nullable = false)
    private String license;

    @Column(columnDefinition = "TEXT")
    private String profile;

    @Column(length = 255)
    private String photo;
}
