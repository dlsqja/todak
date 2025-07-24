package com.A409.backend.global.security.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "auth")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "authId")
public class Auth {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "auth_id")
    private Long authId;

    @Column(name = "auth_code", length = 6, nullable = false, unique = true)
    private String authCode;
}


