package com.A409.backend.domain.user.vet.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "closing_hour")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "closingId")
public class ClosingHour {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "closing_id")
    private Long closingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vet_id", nullable = false)
    private Vet vet;

    @Column(nullable = false)
    private Byte time;
}

