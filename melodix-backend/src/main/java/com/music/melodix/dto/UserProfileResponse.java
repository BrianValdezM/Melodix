package com.music.melodix.dto;

import lombok.Data;

@Data
public class UserProfileResponse {
    private Long id;
    private String username;
    private String email;
    private String avatarUrl;
    private String address;
    private String phone;
    private String role;  
}