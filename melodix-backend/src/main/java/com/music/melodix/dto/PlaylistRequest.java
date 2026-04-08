package com.music.melodix.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PlaylistRequest {

    @NotBlank
    private String name;

    private String description;
}