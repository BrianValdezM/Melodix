package com.music.melodix.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PaymentRequest {

    @NotBlank
    private String cardholderName;

    @NotBlank
    @Size(min = 16, max = 16, message = "El numero de tarjeta debe tener 16 digitos")
    private String cardNumber;

    @NotBlank
    private String expiryDate;

    @NotBlank
    @Size(min = 3, max = 4)
    private String cvv;

    @NotBlank
    private String plan; // PREMIUM_MONTHLY o PREMIUM_ANNUAL
}