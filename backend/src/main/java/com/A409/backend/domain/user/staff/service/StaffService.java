package com.A409.backend.domain.user.staff.service;

import com.A409.backend.domain.hospital.entity.Hospital;
import com.A409.backend.domain.hospital.repository.HospitalRepository;
import com.A409.backend.domain.user.auth.entity.Auth;
import com.A409.backend.domain.user.auth.repository.AuthRepository;
import com.A409.backend.domain.user.staff.dto.StaffRequest;
import com.A409.backend.domain.user.staff.entity.Staff;
import com.A409.backend.domain.user.staff.repository.StaffRepository;
import com.A409.backend.global.enums.ErrorCode;
import com.A409.backend.global.exceptin.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final AuthRepository authRepository;
    private final StaffRepository staffRepository;
    private final HospitalRepository hospitalRepository;

    @Transactional
    public void insertStaffInfo(Long authId, StaffRequest staffRequest){
        Auth auth = authRepository.findById(authId)
                .orElseThrow(() -> new CustomException(ErrorCode.RESOURCE_NOT_FOUND));
        Hospital hospital = hospitalRepository.findByHospitalCode(staffRequest.getHospitalCode());

        Staff staff = Staff.builder()
                .auth(auth)
                .hospital(hospital)
                .name(staffRequest.getName())
                .build();

        staffRepository.save(staff);
    }
}
