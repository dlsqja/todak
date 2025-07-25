package com.A409.backend.domain.user.owner.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("/owners")
public class OwnerController {

    @GetMapping("/")
    public String getOwner() {
        return "owner get";
    }

    @PostMapping("/")
    public String postOwner() {
        return "owner get";
    }




}
