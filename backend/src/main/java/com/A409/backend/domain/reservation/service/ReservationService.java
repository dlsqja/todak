package com.A409.backend.domain.reservation.service;

import com.A409.backend.domain.reservation.dto.ReservationReqeust;
import com.A409.backend.domain.reservation.dto.ReservationResponse;
import com.A409.backend.domain.reservation.entity.Reservation;
import com.A409.backend.domain.reservation.repository.ReservationRepository;
import com.A409.backend.domain.user.owner.entity.Owner;
import com.A409.backend.global.enums.ErrorCode;
import com.A409.backend.global.exceptin.CustomException;
import com.A409.backend.global.util.uploader.S3Uploader;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final S3Uploader s3Uploader;
    private final ReservationRepository reservationRepository;

    public void createReservation(Long ownerId, ReservationReqeust reservationReqeust, MultipartFile photo) {
        Owner owner = Owner.builder().ownerId(ownerId).build();

        Reservation reservation = reservationReqeust.toEntity();
        reservation.setOwner(owner);

        if(photo != null){
            try{
                String url = s3Uploader.upload(photo,"reservation");
                reservation.setPhoto(url);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }

        }
        reservationRepository.save(reservation);
    }

    public List<Map<String, Object>> getReservations(Long ownerId) {
        List<Reservation> reservations = reservationRepository.findAllByOwner_OwnerId(ownerId);

        List<Map<String, Object>> result = reservations.stream()
                .map(reservation -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("reservationId", reservation.getReservationId());
                    map.put("petName", reservation.getPet().getName());
                    map.put("hospitalName", reservation.getHospital().getName());
                    map.put("vetName", reservation.getVet().getName());
                    map.put("reservationDay", reservation.getReservationDay());
                    map.put("reservationTime", reservation.getReservationTime());
                    map.put("subject", reservation.getSubject());
                    map.put("status", reservation.getStatus());
                    return map;
                })
                .toList();

        return result;
    }

    public ReservationResponse getReservationDetail(Long ownerId, Long reservationId) {

        Reservation reservation = reservationRepository.findById(reservationId).orElseThrow(() -> new CustomException(ErrorCode.CONTENT_NOT_FOUND));
        if(ownerId!=reservation.getOwner().getOwnerId()){
            throw  new CustomException(ErrorCode.ACCESS_DENIED);
        }

        return ReservationResponse.toOwnerResponse(reservation);
    }

}
