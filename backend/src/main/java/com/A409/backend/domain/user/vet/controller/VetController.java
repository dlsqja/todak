package com.A409.backend.domain.user.vet.controller;

import com.A409.backend.domain.user.vet.service.VetService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;

@RestController("/vets")
@RequiredArgsConstructor
public class VetController {

    private final VetService vetService;
}
