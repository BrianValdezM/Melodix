package com.music.melodix.controller;

import com.music.melodix.dto.UpdateProfileRequest;
import com.music.melodix.dto.UserProfileResponse;
import com.music.melodix.model.User;
import com.music.melodix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @Value("${melodix.upload.dir}")
    private String uploadDir;

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return ResponseEntity.ok(toResponse(user));
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @RequestBody UpdateProfileRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (request.getUsername() != null) user.setUsername(request.getUsername());
        if (request.getAddress() != null) user.setAddress(request.getAddress());
        if (request.getPhone() != null) user.setPhone(request.getPhone());

        return ResponseEntity.ok(toResponse(userRepository.save(user)));
    }

    @PostMapping("/me/avatar")
    public ResponseEntity<UserProfileResponse> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) throws IOException {

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Path uploadPath = Paths.get(uploadDir + "/avatars");
        if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

        String fileName = "avatar_" + user.getId() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        user.setAvatarUrl("http://localhost:8080/api/users/me/avatar/" + fileName);
        userRepository.save(user);

        return ResponseEntity.ok(toResponse(user));
    }

    @GetMapping("/me/avatar/{filename}")
    public ResponseEntity<org.springframework.core.io.Resource> getAvatar(
            @PathVariable String filename) throws IOException {
        Path filePath = Paths.get(uploadDir + "/avatars").resolve(filename);
        org.springframework.core.io.Resource resource =
                new org.springframework.core.io.UrlResource(filePath.toUri());
        return ResponseEntity.ok()
                .contentType(org.springframework.http.MediaType.IMAGE_JPEG)
                .body(resource);
    }

    private UserProfileResponse toResponse(User user) {
        UserProfileResponse r = new UserProfileResponse();
        r.setId(user.getId());
        r.setUsername(user.getUsername());
        r.setEmail(user.getEmail());
        r.setAvatarUrl(user.getAvatarUrl());
        r.setAddress(user.getAddress());
        r.setPhone(user.getPhone());
        return r;
    }
}