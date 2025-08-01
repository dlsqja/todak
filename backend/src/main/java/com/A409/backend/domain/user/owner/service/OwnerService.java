package com.A409.backend.domain.user.owner.service; // 가상의 서비스 패키지

import com.A409.backend.domain.user.auth.entity.Auth;
import com.A409.backend.domain.user.auth.repository.AuthRepository;
import com.A409.backend.domain.user.owner.dto.OwnerRequest;
import com.A409.backend.domain.user.owner.dto.OwnerResponse;
import com.A409.backend.domain.user.owner.entity.Owner;
import com.A409.backend.domain.user.owner.repository.OwnerRepository;
import com.A409.backend.global.enums.ErrorCode;
import com.A409.backend.global.exceptin.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OwnerService {

    private final OwnerRepository ownerRepository;
    private final AuthRepository authRepository;

    @Transactional(readOnly = true)
    public OwnerResponse getOwnerInfo(Long ownerId) {

       Owner owner = ownerRepository.findById(ownerId)
                .orElseThrow(() -> new CustomException(ErrorCode.RESOURCE_NOT_FOUND));

       return OwnerResponse.toResponse(owner);
    }

    @Transactional
    public void updateOwnerInfo(Long ownerId, OwnerRequest ownerRequest) {

        Owner owner = ownerRepository.findById(ownerId).orElseThrow(() -> new CustomException(ErrorCode.RESOURCE_NOT_FOUND));

        owner.setName(ownerRequest.getName());
        owner.setPhone(ownerRequest.getPhone());
        owner.setBirth(ownerRequest.getBirth());

        ownerRepository.save(owner);
    }

    @Transactional
    public void insertOwnerInfo(Long authId, OwnerRequest ownerRequest) {
        Auth auth = authRepository.findById(authId)
                .orElseThrow(() -> new CustomException(ErrorCode.RESOURCE_NOT_FOUND));

        Owner owner = Owner.builder()
                .auth(auth)
                .name(ownerRequest.getName())
                .phone(ownerRequest.getPhone())
                .birth(ownerRequest.getBirth())
                .build();

        ownerRepository.save(owner);
    }
}