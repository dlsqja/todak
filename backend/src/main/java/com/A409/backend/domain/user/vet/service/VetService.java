package com.A409.backend.domain.user.vet.service;

import com.A409.backend.domain.hospital.entity.Hospital;
import com.A409.backend.domain.hospital.repository.HospitalRepository;
import com.A409.backend.domain.user.auth.entity.Auth;
import com.A409.backend.domain.user.vet.dto.VetRequest;
import com.A409.backend.domain.user.vet.dto.VetResponse;
import com.A409.backend.domain.user.vet.entity.Vet;
import com.A409.backend.domain.user.vet.entity.WorkingHour;
import com.A409.backend.domain.user.vet.repository.VetRepository;
import com.A409.backend.domain.user.vet.repository.WorkingHourRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class VetService {

    private final VetRepository vetRepository;
    private final HospitalRepository hospitalRepository;
    private final WorkingHourRepository workingHourRepository;

    public List<VetResponse> getVetsByHospitalId(Long hospitalId){
        return vetRepository.findVetsByHospital_HospitalId(hospitalId).stream().map(VetResponse::toResponse).toList();
    }

    @Transactional
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

        List<WorkingHour> workingHours = IntStream.rangeClosed(0, 6)
                .mapToObj(day -> WorkingHour.builder()
                        .day(day + "")
                        .startTime((byte) 0)
                        .endTime((byte) 0)
                        .vet(newVet)
                        .build()
                ).toList();

        workingHourRepository.saveAll(workingHours);
        return newVet;
    }
}
