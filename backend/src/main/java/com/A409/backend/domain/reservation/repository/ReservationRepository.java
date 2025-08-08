package com.A409.backend.domain.reservation.repository;

import com.A409.backend.domain.pet.entity.Pet;
import com.A409.backend.domain.reservation.entity.Reservation;
import com.A409.backend.global.enums.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findAllByOwner_OwnerId(Long ownerOwnerId);
    void removeByOwner_OwnerIdAndReservationId(Long ownerOwnerId, Long reservationId);
    List<Reservation> findAllByHospital_HospitalId(Long hospitalId);
    List<Reservation> findAllByHospital_HospitalIdAndStatus(Long hospitalId, ReservationStatus status);
    Optional<Reservation> findReservationByReservationId(Long reservationId);
    List<Reservation> findByVet_VetIdAndStatus(Long vetId, ReservationStatus status);

    void deleteByReservationIdAndOwner_OwnerId(Long reservationId, Long ownerOwnerId);
    boolean existsReservationByReservationIdAndOwner_OwnerId(Long reservationId, Long ownerId);


    List<Reservation> findAllByPet(Pet pet);

    List<Reservation> findAllByPet_PetId(Long petPetId);
}

