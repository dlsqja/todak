package com.A409.backend.domain.user.owner.service; // 가상의 서비스 패키지

import com.A409.backend.domain.user.owner.dto.OwnerRequest;
import com.A409.backend.domain.user.owner.dto.OwnerResponse;
import com.A409.backend.domain.user.owner.entity.Owner;
import com.A409.backend.domain.user.owner.repository.OwnerRepository;
import com.A409.backend.global.enums.ErrorCode;
import com.A409.backend.global.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OwnerService {

    private final OwnerRepository ownerRepository;

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

}