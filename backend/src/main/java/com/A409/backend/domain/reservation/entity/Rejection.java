package com.A409.backend.domain.reservation.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "rejection")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rejection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rejection_id")
    private Long rejectionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String reason;
}

