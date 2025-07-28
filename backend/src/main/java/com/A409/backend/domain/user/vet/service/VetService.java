package com.A409.backend.domain.user.vet.service;

import com.A409.backend.domain.user.vet.repository.VetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VetService {

    private final VetRepository vetRepository;
}
