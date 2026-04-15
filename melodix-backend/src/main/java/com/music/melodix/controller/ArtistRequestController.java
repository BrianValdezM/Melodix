package com.music.melodix.controller;

import com.music.melodix.dto.ArtistRequestDto;
import com.music.melodix.dto.ReviewRequest;
import com.music.melodix.service.ArtistRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/artist-requests")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class ArtistRequestController {

    private final ArtistRequestService artistRequestService;

    @PostMapping
    public ResponseEntity<ArtistRequestDto> submitRequest(
            @RequestBody ReviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
            artistRequestService.submitRequest(userDetails.getUsername(), request.getComment())
        );
    }

    @GetMapping("/pending")
    public List<ArtistRequestDto> getPending() {
        return artistRequestService.getPendingRequests();
    }

    @GetMapping
    public List<ArtistRequestDto> getAll() {
        return artistRequestService.getAllRequests();
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<ArtistRequestDto> approve(
            @PathVariable Long id,
            @RequestBody(required = false) ReviewRequest request) {
        String comment = request != null ? request.getComment() : "";
        return ResponseEntity.ok(artistRequestService.approveRequest(id, comment));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<ArtistRequestDto> reject(
            @PathVariable Long id,
            @RequestBody(required = false) ReviewRequest request) {
        String comment = request != null ? request.getComment() : "";
        return ResponseEntity.ok(artistRequestService.rejectRequest(id, comment));
    }
}