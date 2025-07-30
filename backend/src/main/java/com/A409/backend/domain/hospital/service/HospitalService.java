package com.A409.backend.domain.hospital.service;

import com.A409.backend.domain.hospital.dto.HospitalResponse;
import com.A409.backend.domain.hospital.entity.Hospital;
import com.A409.backend.domain.hospital.repository.HospitalRepository;
import com.A409.backend.domain.user.vet.repository.VetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HospitalService {

    private final HospitalRepository hospitalRepository;

    public List<HospitalResponse> getHospitals(){

        List<Hospital> hospitals = hospitalRepository.findAll();

        return hospitals.stream().map(HospitalResponse::toResponse).toList();
    }
}
