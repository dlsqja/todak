package com.A409.backend.domain.reservation.repository;

import com.A409.backend.domain.reservation.entity.Rejection;
import com.A409.backend.domain.reservation.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RejectionRepository extends JpaRepository<Rejection, Long> {
    Rejection findByReservation_ReservationId(Long reservationReservationId);
}
