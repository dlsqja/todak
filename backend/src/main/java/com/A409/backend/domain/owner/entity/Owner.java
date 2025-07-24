package com.A409.backend.domain.owner.entity;

import com.A409.backend.global.security.entity.Auth;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "owner")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Owner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "owner_id")
    private Long ownerId;

    @Column(name = "owner_code")
    private String ownerCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auth_id")
    private Auth authId;

    @Column
    private String name;

    @Column
    private String email;

    @Column
    private String phone;

    @Column()
    private LocalDate birth;
}
