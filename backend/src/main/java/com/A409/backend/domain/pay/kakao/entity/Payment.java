package com.A409.backend.domain.pay.kakao.entity;

import com.A409.backend.domain.hospital.entity.Hospital;
import com.A409.backend.domain.treatment.entity.Treatment;
import com.A409.backend.domain.user.owner.entity.Owner;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "payment")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Long paymentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "treatment_id", nullable = false, unique = true)
    private Treatment treatment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private Owner owner;

    @Column(name = "tid", nullable = true)
    private String tid;

    @Column(name = "is_completed", nullable = false)
    @Builder.Default
    private Boolean isCompleted=false;

    @Column(name = "complete_time", nullable = true)
    private LocalDateTime completeTime;

    @Column(name = "amount", nullable = true)
    private Long amount;

}
