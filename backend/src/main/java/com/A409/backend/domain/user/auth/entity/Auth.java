package com.A409.backend.domain.user.auth.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "auth")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Auth {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "auth_id")
    private Long authId;

    @Column(length = 50,unique = true)
    private String email;
}


