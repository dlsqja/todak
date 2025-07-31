package com.A409.backend.domain.user.vet.entity;

import com.A409.backend.global.enums.Day;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "working_hour")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkingHour {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "working_id")
    private Long workingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vet_id", nullable = false)
    private Vet vet;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Day day;

    @Column(name = "start_time", nullable = false)
    private Byte startTime;

    @Column(name = "end_time", nullable = false)
    private Byte endTime;
}

