package com.A409.backend.domain.treatment.service;

import com.A409.backend.domain.pet.dto.PetResponse;
import com.A409.backend.domain.treatment.entity.Treatment;
import com.A409.backend.domain.treatment.repository.TreatmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TreatmentService {

    private final TreatmentRepository treatmentRepository;

    public List<Map<String,Object>> getTreatments(Long ownerId){

        List<Treatment> treatmentList = treatmentRepository.findAllByOwner_OwnerId(ownerId);

        List<Map<String, Object>> result = treatmentList.stream()
                .map(treatments -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("reservationId", treatments.getReservation().getReservationId());
                    map.put("petInfo", PetResponse.toResponse(treatments.getPet()));
                    map.put("subject", treatments.getReservation().getSubject());
                    map.put("reservationTime", treatments.getReservation().getReservationTime());
                    return map;
                })
                .toList();

        return result;
    }
    public List<Map<String,Object>> getTreatmentsByVetId(Long vetId){
        List<Treatment> treatmentList = treatmentRepository.findAllByVet_VetId(vetId);

        List<Map<String, Object>> result = treatmentList.stream()
                .map(treatments -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("reservationId", treatments.getReservation().getReservationId());
                    map.put("petInfo", PetResponse.toResponse(treatments.getPet()));
                    map.put("subject", treatments.getReservation().getSubject());
                    map.put("reservationTime", treatments.getReservation().getReservationTime());
                    return map;
                })
                .toList();

        return result;
    }
}
