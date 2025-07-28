package com.A409.backend.domain.user.owner.entity;

import com.A409.backend.domain.user.auth.entity.Auth;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "owner")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Owner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private Auth ownerId;

    @Column(name = "owner_code", length = 6, nullable = false, unique = true)
    private String ownerCode;

    @Column(length = 20, nullable = false)
    private String name;

    @Column(length = 15, nullable = false)
    private String phone;

    @Column(nullable = false)
    private LocalDate birth;
}

