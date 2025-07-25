package com.A409.backend.domain.user.staff.controller;

import com.A409.backend.domain.user.staff.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;

@RestController("/staffs")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;
}
