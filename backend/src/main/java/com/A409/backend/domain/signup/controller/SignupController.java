package com.A409.backend.domain.signup.controller;

import com.A409.backend.domain.user.owner.dto.OwnerRequest;
import com.A409.backend.domain.user.owner.service.OwnerService;
import com.A409.backend.domain.user.staff.service.StaffService;
import com.A409.backend.domain.user.staff.dto.StaffRequest;
import com.A409.backend.domain.user.vet.dto.VetRequest;
import com.A409.backend.domain.user.vet.service.VetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/signup")
@RequiredArgsConstructor
public class SignupController {

    private final OwnerService ownerService;
    private final VetService vetService;
    private final StaffService staffService;

    @PostMapping("/owner")
    public ResponseEntity<Map<String, String>> ownerSignup(@RequestParam Long authId, @RequestBody OwnerRequest ownerRequest) {
        ownerService.insertOwnerInfo(authId, ownerRequest);
        return ResponseEntity.ok(Map.of("message", "Owner signup completed"));
    }

    @PostMapping("/vet")
    public ResponseEntity<Map<String, String>> vetSignup(@RequestParam Long authId, @RequestBody VetRequest vetRequest) {
        vetService.insertVetInfo(authId, vetRequest);
        return ResponseEntity.ok(Map.of("messege", "Vet signup completed"));
    }

    @PostMapping("/staff")
    public ResponseEntity<Map<String, String>> signup(@RequestParam Long authId, @RequestBody StaffRequest staffRequest) {
        staffService.insertStaffInfo(authId, staffRequest);
        return ResponseEntity.ok(Map.of("message", "Staff signup completed"));
    }
}
