package com.A409.backend.domain.reservation.repository;

import com.A409.backend.domain.reservation.entity.Reservation;
import com.A409.backend.global.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findAllByOwner_OwnerId(Long ownerOwnerId);
    void removeByOwner_OwnerIdAndReservationId(Long ownerOwnerId, Long reservationId);
    List<Reservation> findAllByHospital_HospitalId(Long hospitalId);
    List<Reservation> findAllByHospital_HospitalIdAndStatus(Long hospitalId, Status status);
    Optional<Reservation> findReservationByReservationId(Long reservationId);
}

