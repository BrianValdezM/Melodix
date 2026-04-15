package com.music.melodix.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ArtistRequestDto {
    private Long id;
    private Long userId;
    private String username;
    private String email;
    private String motivation;
    private String status;
    private String adminComment;
    private LocalDateTime requestedAt;
}