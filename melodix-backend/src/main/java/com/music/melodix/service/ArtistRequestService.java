package com.music.melodix.service;

import com.music.melodix.dto.ArtistRequestDto;
import com.music.melodix.model.ArtistRequest;
import com.music.melodix.model.User;
import com.music.melodix.repository.ArtistRequestRepository;
import com.music.melodix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ArtistRequestService {

    private final ArtistRequestRepository artistRequestRepository;
    private final UserRepository userRepository;

    public ArtistRequestDto submitRequest(String email, String motivation) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (user.getRole() == User.Role.ARTIST) {
            throw new RuntimeException("Ya eres artista");
        }

        if (artistRequestRepository.existsByUserIdAndStatus(user.getId(), ArtistRequest.RequestStatus.PENDING)) {
            throw new RuntimeException("Ya tienes una solicitud pendiente");
        }

        ArtistRequest request = new ArtistRequest();
        request.setUser(user);
        request.setMotivation(motivation);

        return toDto(artistRequestRepository.save(request));
    }

    public List<ArtistRequestDto> getPendingRequests() {
        return artistRequestRepository.findByStatus(ArtistRequest.RequestStatus.PENDING)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<ArtistRequestDto> getAllRequests() {
        return artistRequestRepository.findAll()
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public ArtistRequestDto approveRequest(Long requestId, String comment) {
        ArtistRequest request = artistRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        request.setStatus(ArtistRequest.RequestStatus.APPROVED);
        request.setAdminComment(comment);
        request.setReviewedAt(LocalDateTime.now());
        artistRequestRepository.save(request);

        User user = request.getUser();
        user.setRole(User.Role.ARTIST);
        userRepository.save(user);

        return toDto(request);
    }

    public ArtistRequestDto rejectRequest(Long requestId, String comment) {
        ArtistRequest request = artistRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        request.setStatus(ArtistRequest.RequestStatus.REJECTED);
        request.setAdminComment(comment);
        request.setReviewedAt(LocalDateTime.now());

        return toDto(artistRequestRepository.save(request));
    }

    private ArtistRequestDto toDto(ArtistRequest r) {
        ArtistRequestDto dto = new ArtistRequestDto();
        dto.setId(r.getId());
        dto.setUserId(r.getUser().getId());
        dto.setUsername(r.getUser().getUsername());
        dto.setEmail(r.getUser().getEmail());
        dto.setMotivation(r.getMotivation());
        dto.setStatus(r.getStatus().name());
        dto.setAdminComment(r.getAdminComment());
        dto.setRequestedAt(r.getRequestedAt());
        return dto;
    }
}