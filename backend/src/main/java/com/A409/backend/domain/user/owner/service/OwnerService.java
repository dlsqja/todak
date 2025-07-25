package com.A409.backend.domain.user.owner.service; // 가상의 서비스 패키지

import com.A409.backend.domain.user.owner.entity.Owner;
import com.A409.backend.domain.user.owner.repository.OwnerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OwnerService {

    private final OwnerRepository ownerRepository;

    @Transactional
    public Owner createOwner(Owner newOwner) {

        return ownerRepository.save(newOwner);
    }

    @Transactional(readOnly = true)
    public Owner findOwnerById(Long ownerId) {

       return ownerRepository.findById(ownerId)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 Owner를 찾을 수 없습니다: " + ownerId));
    }

    @Transactional
    public void deleteOwner(Long ownerId) {

        if (!ownerRepository.existsById(ownerId)) {
            throw new IllegalArgumentException("삭제하려는 Owner가 존재하지 않습니다: " + ownerId);
        }
        ownerRepository.deleteById(ownerId);
    }
}