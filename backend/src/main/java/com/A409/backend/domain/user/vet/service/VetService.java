package com.A409.backend.domain.user.vet.service;

import com.A409.backend.domain.hospital.entity.Hospital;
import com.A409.backend.domain.hospital.repository.HospitalRepository;
import com.A409.backend.domain.user.auth.entity.Auth;
import com.A409.backend.domain.user.vet.dto.VetRequest;
import com.A409.backend.domain.user.vet.dto.VetResponse;
import com.A409.backend.domain.user.vet.entity.Vet;
import com.A409.backend.domain.user.vet.repository.VetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VetService {

    private final VetRepository vetRepository;
    private final HospitalRepository hospitalRepository;

    public List<VetResponse> getVetsByHospitalId(Long hospitalId){
        return vetRepository.findVetsByHospital_HospitalId(hospitalId).stream().map(VetResponse::toResponse).toList();
    }

    public Vet insertVet(VetRequest vetRequest) {
        Auth auth = Auth.builder().authId(vetRequest.getAuthId()).build();
        Hospital hospital = hospitalRepository.findByHospitalCode(vetRequest.getHospitalCode());

        Vet newVet = Vet.builder()
                .auth(auth)
                .hospital(hospital)
                .name(vetRequest.getName())
                .license(vetRequest.getLicense())
                .profile(vetRequest.getProfile())
                .photo(vetRequest.getPhoto())
                .build();
        vetRepository.save(newVet);
        return newVet;
    }
}
