package com.music.melodix.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MembershipResponse {
    private String plan;
    private boolean isPremium;
    private LocalDateTime membershipStart;
    private LocalDateTime membershipEnd;
    private long daysRemaining;
    private double monthlyPrice;
    private double annualPrice;
}