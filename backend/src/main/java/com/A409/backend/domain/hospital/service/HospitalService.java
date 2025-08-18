package com.A409.backend.domain.hospital.service;

import com.A409.backend.domain.hospital.dto.HospitalRequest;
import com.A409.backend.domain.hospital.dto.HospitalResponse;
import com.A409.backend.domain.hospital.entity.Hospital;
import com.A409.backend.domain.hospital.repository.HospitalRepository;
import com.A409.backend.domain.user.staff.dto.StaffResponse;
import com.A409.backend.domain.user.staff.entity.Staff;
import com.A409.backend.domain.user.staff.repository.StaffRepository;
import com.A409.backend.domain.user.vet.dto.VetWorkingHourResponse;
import com.A409.backend.domain.user.vet.entity.Vet;
import com.A409.backend.domain.user.vet.entity.WorkingHour;
import com.A409.backend.domain.user.vet.repository.VetRepository;
import com.A409.backend.domain.user.vet.repository.WorkingHourRepository;
import com.A409.backend.global.enums.ErrorCode;
import com.A409.backend.global.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

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

    @Transactional
    public HospitalResponse getHospitalDetailByVetId(Long vetId) {
        Vet vet = vetRepository.findById(vetId).orElseThrow(()->new CustomException(ErrorCode.USER_NOT_FOUND));
        return getHospitalDetail(vet.getHospital().getHospitalId());
    }

    @Transactional
    public void updateHospitalByVetId(Long vetId, HospitalRequest hospitalRequest){
        Vet vet = vetRepository.findById(vetId).orElseThrow(()->new CustomException(ErrorCode.USER_NOT_FOUND));
        updateHospital(vet.getHospital().getHospitalId(), hospitalRequest);
    }


    public List<StaffResponse> getHospitalStaffs(Long hospitalId){

        List<Staff> staffs = staffRepository.findAllByHospital_HospitalId(hospitalId);

        return staffs.stream().map(StaffResponse::toResponse).toList();
    }

    public List<VetWorkingHourResponse> getWorkingHours(Long hospitalId) {
        List<Vet> vets = vetRepository.findVetsByHospital_HospitalId(hospitalId);
        List<VetWorkingHourResponse> vetWorkingHourResponses = new ArrayList<>();

        for(Vet vet : vets){
            List<WorkingHour> workingHours = workingHourRepository.findAllByVet(vet);
            vetWorkingHourResponses.add(VetWorkingHourResponse.toResponse(workingHours));
        }

        return vetWorkingHourResponses;
    }

}
