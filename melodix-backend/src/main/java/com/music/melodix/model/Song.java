package com.music.melodix.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "songs")
public class Song {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    @NotBlank
    private String artist;

    private String album;
    private String genre;
    private Integer duration;
    private String filePath;
    private String coverUrl;
    private Long plays = 0L;

    @Enumerated(EnumType.STRING)
    private SongStatus status = SongStatus.PENDING;

    private String rejectionReason;

    @ManyToOne
    @JoinColumn(name = "uploaded_by")
    private User uploadedBy;

    private LocalDateTime uploadedAt = LocalDateTime.now();

    @ManyToMany(mappedBy = "songs")
    private List<Playlist> playlists;

    @OneToMany(mappedBy = "song", cascade = CascadeType.ALL)
    private List<Favorite> favorites;

    public enum SongStatus { PENDING, APPROVED, REJECTED }
}