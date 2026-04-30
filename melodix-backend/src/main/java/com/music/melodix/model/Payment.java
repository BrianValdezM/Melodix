package com.music.melodix.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String cardholderName;
    private String lastFourDigits;
    private Double amount;
    private String plan;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status = PaymentStatus.COMPLETED;

    private LocalDateTime paidAt = LocalDateTime.now();

    public enum PaymentStatus { COMPLETED, FAILED, REFUNDED }
}