package com.music.melodix.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SongResponse {
    private Long id;
    private String title;
    private String artist;
    private String album;
    private String genre;
    private Integer duration;
    private String coverUrl;
    private Long plays;
    private String status;
    private String rejectionReason;
    private String uploadedBy;
    private LocalDateTime uploadedAt;
    private String streamUrl;
}