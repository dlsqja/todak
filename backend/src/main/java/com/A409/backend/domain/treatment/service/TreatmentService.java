package com.A409.backend.domain.treatment.service;

import com.A409.backend.domain.pet.dto.PetResponse;
import com.A409.backend.domain.treatment.entity.Treatment;
import com.A409.backend.domain.treatment.entity.TreatmentResponse;
import com.A409.backend.domain.treatment.repository.TreatmentRepository;
import com.A409.backend.global.enums.ErrorCode;
import com.A409.backend.global.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TreatmentService {

    private final TreatmentRepository treatmentRepository;

    public void saveAISummary(Long treatmentId,String summary){

        Treatment treatment = treatmentRepository.findById(treatmentId).orElseThrow(() -> new CustomException(ErrorCode.RESOURCE_NOT_FOUND));

        treatment.setAiSummary(summary);

        treatmentRepository.save(treatment);
    }

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
                    map.put("treatmentID", treatments.getTreatmentId());
                    map.put("petInfo", PetResponse.toResponse(treatments.getPet()));
                    map.put("subject", treatments.getReservation().getSubject());
                    map.put("isCompleted", treatments.getIsCompleted());
                    map.put("startTime", treatments.getReservation().getReservationTime());
                    map.put("endTime", treatments.getReservation().getReservationTime());
                    map.put("treatmentDate", treatments.getReservation().getReservationDay());
                    return map;
                })
                .toList();

        return result;
    }
    public TreatmentResponse getTreatmentById(Long vetId, Long treatmentId){
        Treatment treatment = treatmentRepository.findByTreatmentId(treatmentId).orElseThrow(() -> new CustomException(ErrorCode.RESOURCE_NOT_FOUND));
        if(!treatment.getVet().getVetId().equals(vetId)){
            throw  new CustomException(ErrorCode.ACCESS_DENIED);
        }
        return TreatmentResponse.toVetResponse(treatment);
    }
}
