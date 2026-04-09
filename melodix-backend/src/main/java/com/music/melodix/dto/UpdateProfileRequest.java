package com.music.melodix.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String username;
    private String address;
    private String phone;
}
