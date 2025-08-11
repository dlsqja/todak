package com.A409.backend.domain.treatment.service;

import com.A409.backend.domain.hospital.dto.HospitalResponse;
import com.A409.backend.domain.pet.dto.PetResponse;
import com.A409.backend.domain.pet.entity.Pet;
import com.A409.backend.domain.pet.service.PetService;
import com.A409.backend.domain.treatment.dto.TreatementResponse;
import com.A409.backend.domain.treatment.entity.Treatment;
import com.A409.backend.domain.treatment.entity.TreatmentResponse;
import com.A409.backend.domain.treatment.repository.TreatmentRepository;
import com.A409.backend.domain.user.vet.dto.VetResponse;
import com.A409.backend.domain.user.vet.dto.WorkingHourDto;
import com.A409.backend.domain.user.vet.entity.WorkingHour;
import com.A409.backend.domain.user.vet.service.WorkingHourService;
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
    private final PetService petService;
    private final WorkingHourService workingHourService;

    public void saveAISummary(Long treatmentId,String summary){

        Treatment treatment = treatmentRepository.findById(treatmentId).orElseThrow(() -> new CustomException(ErrorCode.RESOURCE_NOT_FOUND));

        treatment.setAiSummary(summary);

        treatmentRepository.save(treatment);
    }

    public List<Map<String,Object>> getTreatmentsByOwnerIdAndType(Long ownerId,Integer type){

        List<Treatment> treatmentList = new ArrayList<>();
        List<Map<String, Object>> result = new ArrayList<>();
        if(type==0){
            //진료 대기 목록
            treatmentList = treatmentRepository.findAllByOwner_OwnerIdAndIsCompleted(ownerId,false);
        }
        else if(type==1){
            List<PetResponse> petList = petService.getMyPets(ownerId);

            for(PetResponse pet : petList){

                treatmentList = treatmentRepository.findAllByOwner_OwnerIdAndIsCompletedAndPet_PetId(ownerId,true,pet.getPetId());
                List<Map<String, Object>> treatmentsList  = treatmentList.stream()
                        .map(treatments -> {
                            Map<String, Object> map = new HashMap<>();
                            map.put("treatementInfo", TreatementResponse.toResponse(treatments));
                            map.put("reservationId",treatments.getReservation().getReservationId());
                            map.put("vetName",treatments.getVet().getName());
                            map.put("reservationDay", treatments.getReservation().getReservationDay());
                            map.put("subject", treatments.getReservation().getSubject());
                            return map;
                        })
                        .toList();

                Map<String, Object> map = new HashMap<>();
                map.put("petResponse", pet);
                map.put("treatments", treatmentsList);

                result.add(map);
            }
        }
        else{
            throw new CustomException(ErrorCode.INVALID_INPUT_VALUE);
        }



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

    public void saveResult(Long treatmentId,String result){
        Treatment treatment = treatmentRepository.findByTreatmentId(treatmentId).orElseThrow(() -> new CustomException(ErrorCode.RESOURCE_NOT_FOUND));
        treatment.setResult(result);
        treatmentRepository.save(treatment);
    }

    public void saveAIResult(Long treatmentId,String aiResult) {
        Treatment treatment = treatmentRepository.findByTreatmentId(treatmentId).orElseThrow(() -> new CustomException(ErrorCode.RESOURCE_NOT_FOUND));
        treatment.setAiSummary(aiResult);
        treatmentRepository.save(treatment);
    }

    public List<VetResponse> getRencetTreatments(Long ownerId){

        List<Treatment> treatmentList = treatmentRepository.findAllByOwner_OwnerId(ownerId);
        List<VetResponse> result = new ArrayList<>();

        for (Treatment treatment : treatmentList) {

            List<WorkingHourDto> workingHours = workingHourService.getWorkingHourByVetId(treatment.getVet().getVetId());

            VetResponse vetResponse = VetResponse.toResponse(treatment.getVet());
            vetResponse.setWorkingHours(workingHours);

            result.add(vetResponse);
        }



        return result;
    }
}
