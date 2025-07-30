package com.A409.backend.domain.reservation.repository;

import com.A409.backend.domain.reservation.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findAllByOwner_OwnerId(Long ownerOwnerId);
}
