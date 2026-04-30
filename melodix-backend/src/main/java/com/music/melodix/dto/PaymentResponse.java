package com.music.melodix.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PaymentResponse {
    private Long id;
    private String plan;
    private Double amount;
    private String lastFourDigits;
    private String cardholderName;
    private String status;
    private LocalDateTime paidAt;
    private LocalDateTime membershipEnd;
}