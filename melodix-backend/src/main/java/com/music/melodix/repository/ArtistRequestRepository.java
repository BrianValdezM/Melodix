package com.music.melodix.repository;

import com.music.melodix.model.ArtistRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ArtistRequestRepository extends JpaRepository<ArtistRequest, Long> {
    List<ArtistRequest> findByStatus(ArtistRequest.RequestStatus status);
    Optional<ArtistRequest> findByUserIdAndStatus(Long userId, ArtistRequest.RequestStatus status);
    boolean existsByUserIdAndStatus(Long userId, ArtistRequest.RequestStatus status);
}