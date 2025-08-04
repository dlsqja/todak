package com.A409.backend.domain.user.vet.service;

import com.A409.backend.domain.hospital.entity.Hospital;
import com.A409.backend.domain.hospital.repository.HospitalRepository;
import com.A409.backend.domain.user.auth.entity.Auth;
import com.A409.backend.domain.user.auth.repository.AuthRepository;
import com.A409.backend.domain.user.owner.dto.OwnerRequest;
import com.A409.backend.domain.user.owner.entity.Owner;
import com.A409.backend.domain.user.vet.dto.VetRequest;
import com.A409.backend.domain.user.vet.dto.VetResponse;
import com.A409.backend.domain.user.vet.entity.Vet;
import com.A409.backend.domain.user.vet.repository.VetRepository;
import com.A409.backend.global.enums.ErrorCode;
import com.A409.backend.global.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VetService {

    private final VetRepository vetRepository;
    private final AuthRepository authRepository;
    private final HospitalRepository hospitalRepository;

    public List<VetResponse> getVetsByHospitalId(Long hospitalId){
        return vetRepository.findVetsByHospital_HospitalId(hospitalId).stream().map(VetResponse::toResponse).toList();
    }


    public Long getHospitalIdByVetId(Long vetId){
        Vet vet = vetRepository.findById(vetId).orElseThrow((() -> new CustomException(ErrorCode.RESOURCE_NOT_FOUND)));
        return vet.getHospital().getHospitalId();
    }


    @Transactional
    public void insertVetInfo(Long authId, VetRequest vetRequest) {
        Auth auth = Auth.builder().authId(authId).build();
        Hospital hospital = hospitalRepository.findByHospitalCode(vetRequest.getHospitalCode());

        Vet vet = Vet.builder()
                .auth(auth)
                .hospital(hospital)
                .name(vetRequest.getName())
                .license(vetRequest.getLicense())
                .profile(vetRequest.getProfile())
                .photo(vetRequest.getPhoto())
                .build();
        vetRepository.save(vet);
    }
}
