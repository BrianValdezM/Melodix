package com.music.melodix.controller;

import com.music.melodix.dto.MembershipResponse;
import com.music.melodix.dto.PaymentRequest;
import com.music.melodix.dto.PaymentResponse;
import com.music.melodix.service.MembershipService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/membership")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class MembershipController {

    private final MembershipService membershipService;

    @GetMapping
    public ResponseEntity<MembershipResponse> getMembership(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(membershipService.getMembership(userDetails.getUsername()));
    }

    @PostMapping("/subscribe")
    public ResponseEntity<PaymentResponse> subscribe(
            @Valid @RequestBody PaymentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(membershipService.subscribe(userDetails.getUsername(), request));
    }

    @GetMapping("/history")
    public List<PaymentResponse> getHistory(
            @AuthenticationPrincipal UserDetails userDetails) {
        return membershipService.getPaymentHistory(userDetails.getUsername());
    }

    @DeleteMapping("/cancel")
    public ResponseEntity<String> cancel(
            @AuthenticationPrincipal UserDetails userDetails) {
        membershipService.cancelMembership(userDetails.getUsername());
        return ResponseEntity.ok("Membresia cancelada");
    }
}