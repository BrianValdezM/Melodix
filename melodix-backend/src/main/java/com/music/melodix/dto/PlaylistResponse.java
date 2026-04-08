package com.music.melodix.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PlaylistResponse {
    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private List<SongResponse> songs;
    private int totalSongs;
}