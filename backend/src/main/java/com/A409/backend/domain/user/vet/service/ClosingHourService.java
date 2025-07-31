package com.A409.backend.domain.user.vet.service;

import com.A409.backend.domain.user.vet.entity.ClosingHour;
import com.A409.backend.domain.user.vet.repository.ClosingHourRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClosingHourService {
    private final ClosingHourRepository closingHourRepository;

    public List<ClosingHour> getClosingHoursByVetId(Long vetId) {
        return closingHourRepository.findByVet_VetId(vetId);
    }
}
