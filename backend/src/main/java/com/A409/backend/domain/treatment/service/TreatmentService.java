package com.A409.backend.domain.treatment.service;

import com.A409.backend.domain.pet.dto.PetResponse;
import com.A409.backend.domain.treatment.entity.Treatment;
import com.A409.backend.domain.treatment.entity.TreatmentResponse;
import com.A409.backend.domain.treatment.repository.TreatmentRepository;
import com.A409.backend.global.enums.ErrorCode;
import com.A409.backend.global.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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

    public List<Map<String,Object>> getTreatmentsByOwnerIdAndType(Long ownerId,Integer type){

        List<Treatment> treatmentList = new ArrayList<>();

        if(type==0){
            treatmentList = treatmentRepository.findAllByOwner_OwnerIdAndIsCompleted(ownerId,false);
        }
        else if(type==1){
            treatmentList = treatmentRepository.findAllByOwner_OwnerIdAndIsCompleted(ownerId,true);
        }
        else{
            throw new CustomException(ErrorCode.INVALID_INPUT_VALUE);
        }

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
    public List<Map<String,Object>> getTreatmentsByVetIdAndType(Long vetId,Integer type){

        List<Treatment> treatmentList = new ArrayList<>();
        if(type==0){
            treatmentList = treatmentRepository.findAllByVet_VetIdAndIsCompleted(vetId,false);
        }
        else if(type==1){
            treatmentList = treatmentRepository.findAllByVet_VetIdAndIsCompleted(vetId,true);
        }
        else if(type==2){
            treatmentList = treatmentRepository.findAllByVet_VetId(vetId);
        }
        else{
            throw new CustomException(ErrorCode.INVALID_INPUT_VALUE);
        }


        List<Map<String, Object>> result = treatmentList.stream()
                .map(treatments -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("treatmentId", treatments.getTreatmentId());
                    map.put("petInfo", PetResponse.toResponse(treatments.getPet()));
                    map.put("subject", treatments.getReservation().getSubject());
                    map.put("isCompleted", treatments.getIsCompleted());
                    map.put("startTime", treatments.getReservation().getReservationTime());
                    map.put("reservationId", treatments.getReservation().getReservationId());
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
