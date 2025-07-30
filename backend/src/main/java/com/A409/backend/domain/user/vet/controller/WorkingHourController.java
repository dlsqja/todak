package com.A409.backend.domain.user.vet.controller;

import com.A409.backend.domain.user.vet.service.WorkingHourService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/vets")
@RequiredArgsConstructor
public class WorkingHourController {
    private final WorkingHourService workingHourService;
}
