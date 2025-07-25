package com.A409.backend.domain.user.owner.controller;

import com.A409.backend.domain.user.owner.service.OwnerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("/owners")
@RequiredArgsConstructor
public class OwnerController {

    private final OwnerService ownerService;

    @GetMapping("/")
    public String getOwner() {
        return "owner get";
    }

    @PostMapping("/")
    public String postOwner() {
        return "owner get";
    }




}
