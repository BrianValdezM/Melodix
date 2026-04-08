package com.music.melodix.controller;

import com.music.melodix.dto.SongResponse;
import com.music.melodix.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping("/{songId}")
    public ResponseEntity<String> toggleFavorite(
            @PathVariable Long songId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(favoriteService.toggleFavorite(songId, userDetails.getUsername()));
    }

    @GetMapping
    public List<SongResponse> getUserFavorites(
            @AuthenticationPrincipal UserDetails userDetails) {
        return favoriteService.getUserFavorites(userDetails.getUsername());
    }

    @GetMapping("/{songId}/check")
    public ResponseEntity<Boolean> isFavorite(
            @PathVariable Long songId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(favoriteService.isFavorite(songId, userDetails.getUsername()));
    }
}