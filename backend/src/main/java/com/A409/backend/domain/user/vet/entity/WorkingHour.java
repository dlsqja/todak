package com.A409.backend.domain.user.vet.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "working_hour")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of = "workingId")
public class WorkingHour {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "working_id")
    private Long workingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vet_id", nullable = false)
    private Vet vet;

    @Column(length = 1, nullable = false)
    private String day;

    @Column(name = "start_time", nullable = false)
    private Byte startTime;

    @Column(name = "end_time", nullable = false)
    private Byte endTime;
}

