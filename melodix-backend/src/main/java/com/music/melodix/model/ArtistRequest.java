package com.music.melodix.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "artist_requests")
public class ArtistRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String motivation;

    @Enumerated(EnumType.STRING)
    private RequestStatus status = RequestStatus.PENDING;

    private String adminComment;

    private LocalDateTime requestedAt = LocalDateTime.now();
    private LocalDateTime reviewedAt;

    public enum RequestStatus { PENDING, APPROVED, REJECTED }
}