package com.A409.backend.domain.user.vet.service;

import com.A409.backend.domain.hospital.entity.Hospital;
import com.A409.backend.domain.hospital.repository.HospitalRepository;
import com.A409.backend.domain.treatment.entity.Treatment;
import com.A409.backend.domain.user.auth.entity.Auth;
import com.A409.backend.domain.user.auth.repository.AuthRepository;
import com.A409.backend.domain.user.owner.dto.OwnerRequest;
import com.A409.backend.domain.user.owner.entity.Owner;
import com.A409.backend.domain.user.vet.dto.*;
import com.A409.backend.domain.user.vet.entity.Vet;
import com.A409.backend.domain.user.vet.entity.WorkingHour;
import com.A409.backend.domain.user.vet.repository.VetRepository;
import com.A409.backend.domain.user.vet.repository.WorkingHourRepository;
import com.A409.backend.global.enums.Day;
import com.A409.backend.global.enums.ErrorCode;
import com.A409.backend.global.exception.CustomException;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class VetService {

    private final VetRepository vetRepository;
    private final AuthRepository authRepository;
    private final HospitalRepository hospitalRepository;
    private final WorkingHourRepository workingHourRepository;

    public List<VetResponse> getVetsByHospitalId(Long hospitalId){

        List<VetResponse>  vetResponses = vetRepository.findVetsByHospital_HospitalId(hospitalId).stream().map(VetResponse::toResponse).toList();
        for (VetResponse vet : vetResponses) {
            List<WorkingHour> workingHours = workingHourRepository.findAllByVet_VetId(vet.getVetId());
            List<WorkingHourDto> workingHourDtos = workingHours.stream().map(WorkingHourDto::toResponse).toList();
            vet.setWorkingHours(workingHourDtos);
        }

        return vetResponses;
    }


    public Long getHospitalIdByVetId(Long vetId){
        Vet vet = vetRepository.findById(vetId).orElseThrow((() -> new CustomException(ErrorCode.RESOURCE_NOT_FOUND)));
        return vet.getHospital().getHospitalId();
    }

    public VetResponseDetail getVetById(Long vetId){
        Vet vet = vetRepository.findVetByVetId(vetId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        return  VetResponseDetail.toResponse(vet);
    }

    @Transactional
    public void insertVetInfo(Long authId, VetRequest vetRequest) {
        Auth auth = Auth.builder().authId(authId).build();
        Hospital hospital = hospitalRepository.findByHospitalCode(vetRequest.getHospitalCode())
                .orElseThrow(() -> new CustomException(ErrorCode.HOSPITAL_NOT_FOUND));;

        Vet vet = Vet.builder()
                .auth(auth)
                .hospital(hospital)
                .name(vetRequest.getName())
                .license(vetRequest.getLicense())
                .profile(vetRequest.getProfile())
                .photo(vetRequest.getPhoto())
                .build();
        vetRepository.save(vet);

        List<WorkingHour> workingHours = IntStream.rangeClosed(0, 6)
                .mapToObj(day -> WorkingHour.builder()
                        .day(Day.values()[day])
                        .startTime((byte) 0)
                        .endTime((byte) 0)
                        .vet(vet)
                        .build()
                ).toList();

        workingHourRepository.saveAll(workingHours);
    }

    @Transactional
    public void updateVet(Long vetId, @NotNull VetUpdateRequest vetUpdateRequest) {
        // 기존 Vet 조회 (영속 상태로 만듦)
        Vet existingVet = vetRepository.findById(vetId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 기존 엔티티 기반으로 builder 사용 (id 유지)
        Vet updateVet = existingVet.toBuilder()
                .name(vetUpdateRequest.getName())
                .license(vetUpdateRequest.getLicense())
                .profile(vetUpdateRequest.getProfile())
                .photo(vetUpdateRequest.getPhoto())
                .build();

        // 저장
        vetRepository.save(updateVet);
    }
}
