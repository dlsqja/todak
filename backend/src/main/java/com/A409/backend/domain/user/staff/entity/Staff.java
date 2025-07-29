package com.A409.backend.domain.user.staff.entity;

import com.A409.backend.domain.hospital.entity.Hospital;
import com.A409.backend.domain.user.auth.entity.Auth;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "staff")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Staff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id", nullable = false)
    private Auth staffId;

    @Column(name = "staff_code", length = 6, nullable = false, unique = true)
    private String staffCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

    @Column(length = 100, nullable = false)
    private String name;
}