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
import com.A409.backend.global.util.uploader.S3Uploader;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class VetService {

    private final VetRepository vetRepository;
    private final AuthRepository authRepository;
    private final HospitalRepository hospitalRepository;
    private final WorkingHourRepository workingHourRepository;
    private final S3Uploader s3Uploader;

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
    public void insertVetInfo(Long authId, VetRequest vetRequest,  MultipartFile photo) {
        Auth auth = Auth.builder().authId(authId).build();
        Hospital hospital = hospitalRepository.findByHospitalCode(vetRequest.getHospitalCode())
                .orElseThrow(() -> new CustomException(ErrorCode.HOSPITAL_NOT_FOUND));

        Vet resisterVet = vetRequest.toEntity();
        resisterVet.setHospital(hospital);
        resisterVet.setAuth(auth);

        if(photo != null){
            try{
                String url = s3Uploader.upload(photo, "vet");
                resisterVet.setPhoto(url);
            } catch(IOException e){
                throw new RuntimeException(e);
            }
        }

        vetRepository.save(resisterVet);

        List<WorkingHour> workingHours = IntStream.rangeClosed(0, 6)
                .mapToObj(day -> WorkingHour.builder()
                        .day(Day.values()[day])
                        .startTime((byte) 0)
                        .endTime((byte) 0)
                        .vet(resisterVet)
                        .build()
                ).toList();

        workingHourRepository.saveAll(workingHours);
    }

    @Transactional
    public void updateVet(Long vetId, @NotNull VetUpdateRequest vetUpdateRequest, MultipartFile photo) {
        // 기존 Vet 조회 (영속 상태로 만듦)
        Vet findVet = vetRepository.findById(vetId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        findVet.setName(vetUpdateRequest.getName());
        findVet.setProfile(vetUpdateRequest.getProfile());

        if(photo != null){
            try{
                String url = s3Uploader.upload(photo, "vet");
                findVet.setPhoto(url);
            } catch(IOException e){
                throw new RuntimeException(e);
            }
        } else if (vetUpdateRequest.isUpdatePhoto()) {
            String photoUrl = findVet.getPhoto();
            if (photoUrl != null) {
                s3Uploader.deleteFile(photoUrl);
                findVet.setPhoto(null);
            }
        }

        vetRepository.save(findVet);
    }
}
