package com.A409.backend.domain.pay.kakao.repository;

import com.A409.backend.domain.hospital.entity.Hospital;
import com.A409.backend.domain.treatment.entity.Treatment;
import com.A409.backend.domain.pay.kakao.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByPaymentId(Long paymentId);
    Optional<Payment> findByTreatment(Treatment treatment);
    List<Payment> findByHospital(Hospital hospital);
}
