package com.A409.backend.domain.hospital.service;

import com.A409.backend.domain.hospital.dto.HospitalRequest;
import com.A409.backend.domain.hospital.dto.HospitalResponse;
import com.A409.backend.domain.hospital.entity.Hospital;
import com.A409.backend.domain.hospital.repository.HospitalRepository;
import com.A409.backend.domain.user.staff.dto.StaffResponse;
import com.A409.backend.domain.user.staff.entity.Staff;
import com.A409.backend.domain.user.staff.repository.StaffRepository;
import com.A409.backend.domain.user.vet.dto.WorkingHourResponse;
import com.A409.backend.domain.user.vet.entity.Vet;
import com.A409.backend.domain.user.vet.entity.WorkingHour;
import com.A409.backend.domain.user.vet.repository.VetRepository;
import com.A409.backend.domain.user.vet.repository.WorkingHourRepository;
import com.A409.backend.global.enums.ErrorCode;
import com.A409.backend.global.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class HospitalService {

    private final HospitalRepository hospitalRepository;
    private final StaffRepository staffRepository;
    private final VetRepository vetRepository;
    private final WorkingHourRepository workingHourRepository;

    public List<HospitalResponse> getHospitals(){

        List<Hospital> hospitals = hospitalRepository.findAll();

        return hospitals.stream().map(HospitalResponse::toResponse).toList();
    }

    public HospitalResponse getHospitalDetail(Long hospitalId){

        Hospital hospital = hospitalRepository.findById(hospitalId).orElseThrow(()->new CustomException(ErrorCode.RESOURCE_NOT_FOUND));

        return HospitalResponse.toResponse(hospital);
    }

    public void updateHospital(Long hospitalId, HospitalRequest hospitalRequest){

        Hospital hospital = hospitalRepository.findById(hospitalId).orElseThrow(()->new CustomException(ErrorCode.RESOURCE_NOT_FOUND));

        hospital.setName(hospitalRequest.getName());
        hospital.setProfile(hospitalRequest.getProfile());
        hospital.setLocation(hospitalRequest.getLocation());
        hospital.setContact(hospitalRequest.getContact());

        hospitalRepository.save(hospital);

    }

    public List<StaffResponse> getHospitalStaffs(Long hospitalId){

        List<Staff> staffs = staffRepository.findAllByHospital_HospitalId(hospitalId);

        return staffs.stream().map(StaffResponse::toResponse).toList();
    }

    public Map<String, List<WorkingHourResponse>> getWorkingHours(Long hospitalId) {
        List<Vet> vets = vetRepository.findVetsByHospital_HospitalId(hospitalId);

        Map<String, List<WorkingHourResponse>> result = new HashMap<>();
        for (Vet vet : vets) {
            List<WorkingHour> hours = workingHourRepository.findByVet_VetId(vet.getVetId());
            List<WorkingHourResponse> hourResponses = hours.stream()
                    .map(WorkingHourResponse::toResponse)
                    .toList();
            result.put(vet.getName(), hourResponses);
        }
        return result;
    }

}
