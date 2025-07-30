package com.A409.backend.domain.reservation.service;

import com.A409.backend.domain.reservation.dto.ReservationReqeust;
import com.A409.backend.domain.reservation.entity.Reservation;
import com.A409.backend.domain.reservation.repository.ReservationRepository;
import com.A409.backend.domain.user.owner.entity.Owner;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;

    public void createReservation(Long ownerId, ReservationReqeust reservationReqeust) {
        Owner owner = Owner.builder().ownerId(ownerId).build();

        Reservation reservation = reservationReqeust.toEntity();
        reservation.setOwner(owner);

        reservationRepository.save(reservation);
    }


}
