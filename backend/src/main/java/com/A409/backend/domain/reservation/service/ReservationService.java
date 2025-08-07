package com.A409.backend.domain.reservation.service;

import com.A409.backend.domain.reservation.dto.ReservationReqeust;
import com.A409.backend.domain.reservation.dto.ReservationResponse;
import com.A409.backend.domain.reservation.dto.ReservationResponseToVet;
import com.A409.backend.domain.reservation.entity.Reservation;
import com.A409.backend.domain.reservation.repository.ReservationRepository;
import com.A409.backend.domain.user.owner.entity.Owner;
import com.A409.backend.global.enums.ErrorCode;
import com.A409.backend.global.enums.ReservationStatus;
import com.A409.backend.global.exception.CustomException;
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
        if(!ownerId.equals(reservation.getOwner().getOwnerId())){
            throw  new CustomException(ErrorCode.ACCESS_DENIED);
        }

        return ReservationResponse.toOwnerResponse(reservation);
    }

    public void deleteReservation(Long ownerId, Long reservationId) {

        reservationRepository.removeByOwner_OwnerIdAndReservationId(ownerId,reservationId);
    }

    public List<Reservation> getReservationsByVetId(Long vetId) {
        List<Reservation> reservations = reservationRepository.findByVet_VetIdAndStatus(vetId, ReservationStatus.APPROVED);

        return reservations;
    }

    public ReservationResponseToVet getReservationDetailByVetId(Long vetId, Long reservationId) {

        Reservation reservation = reservationRepository.findById(reservationId).orElseThrow(() -> new CustomException(ErrorCode.CONTENT_NOT_FOUND));
        System.out.println(reservation.getOwner().getOwnerId());
        if(!vetId.equals(reservation.getVet().getVetId())){
            throw new CustomException(ErrorCode.ACCESS_DENIED);
        }

        return ReservationResponseToVet.toOwnerResponse(reservation);
    }

    public List<Map<String, Object>> getHospitalReservations(Long hospitalId) {
        List<Reservation> reservations = reservationRepository.findAllByHospital_HospitalId(hospitalId);

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
    public List<Map<String, Object>> getReservationsByHospitalAndStatus(Long hospitalId, ReservationStatus status) {
        List<Reservation> reservations = reservationRepository.findAllByHospital_HospitalIdAndStatus(hospitalId, status);
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
    public ReservationResponse getHospitalReservationDetail(Long hospitalId, Long reservationId) {
        Reservation reservation = reservationRepository.findReservationByReservationId(reservationId).orElseThrow(() -> new CustomException(ErrorCode.CONTENT_NOT_FOUND));

        if(!hospitalId.equals(reservation.getHospital().getHospitalId())){
            throw  new CustomException(ErrorCode.ACCESS_DENIED);
        }

        return ReservationResponse.toOwnerResponse(reservation);
    }
}
