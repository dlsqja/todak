package com.A409.backend.domain.user.vet.controller;

import com.A409.backend.domain.user.vet.dto.VetRequest;
import com.A409.backend.domain.user.vet.entity.Vet;
import com.A409.backend.domain.user.vet.service.VetService;
import com.A409.backend.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/vets")
@RequiredArgsConstructor
public class VetController {



}
