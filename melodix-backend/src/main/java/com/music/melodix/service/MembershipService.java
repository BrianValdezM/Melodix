package com.music.melodix.service;

import com.music.melodix.dto.MembershipResponse;
import com.music.melodix.dto.PaymentRequest;
import com.music.melodix.dto.PaymentResponse;
import com.music.melodix.model.Payment;
import com.music.melodix.model.User;
import com.music.melodix.repository.PaymentRepository;
import com.music.melodix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MembershipService {

    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;

    private static final double MONTHLY_PRICE = 99.00;
    private static final double ANNUAL_PRICE = 799.00;

    public MembershipResponse getMembership(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        MembershipResponse response = new MembershipResponse();
        response.setMonthlyPrice(MONTHLY_PRICE);
        response.setAnnualPrice(ANNUAL_PRICE);
        response.setPlan(user.getMembershipPlan().name());
        response.setMembershipStart(user.getMembershipStart());
        response.setMembershipEnd(user.getMembershipEnd());

        boolean isPremium = user.getMembershipEnd() != null &&
                user.getMembershipEnd().isAfter(LocalDateTime.now());
        response.setPremium(isPremium);

        if (isPremium) {
            long days = ChronoUnit.DAYS.between(LocalDateTime.now(), user.getMembershipEnd());
            response.setDaysRemaining(days);
        } else {
            response.setDaysRemaining(0);
            user.setMembershipPlan(User.MembershipPlan.FREE);
            userRepository.save(user);
        }

        return response;
    }

    public PaymentResponse subscribe(String email, PaymentRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Simular validacion de tarjeta
        if (request.getCardNumber().startsWith("0000")) {
            throw new RuntimeException("Tarjeta rechazada");
        }

        boolean isMonthly = request.getPlan().equals("PREMIUM_MONTHLY");
        double amount = isMonthly ? MONTHLY_PRICE : ANNUAL_PRICE;

        // Calcular nueva fecha fin
        LocalDateTime start = LocalDateTime.now();
        LocalDateTime end = isMonthly ? start.plusMonths(1) : start.plusYears(1);

        // Si ya tiene membresia activa, extender desde la fecha actual
        if (user.getMembershipEnd() != null && user.getMembershipEnd().isAfter(start)) {
            end = isMonthly ?
                    user.getMembershipEnd().plusMonths(1) :
                    user.getMembershipEnd().plusYears(1);
        }

        user.setMembershipPlan(isMonthly ?
                User.MembershipPlan.PREMIUM_MONTHLY :
                User.MembershipPlan.PREMIUM_ANNUAL);
        user.setMembershipStart(start);
        user.setMembershipEnd(end);
        userRepository.save(user);

        // Guardar pago
        Payment payment = new Payment();
        payment.setUser(user);
        payment.setCardholderName(request.getCardholderName());
        payment.setLastFourDigits(request.getCardNumber().substring(12));
        payment.setAmount(amount);
        payment.setPlan(request.getPlan());
        payment.setStatus(Payment.PaymentStatus.COMPLETED);
        paymentRepository.save(payment);

        PaymentResponse response = new PaymentResponse();
        response.setId(payment.getId());
        response.setPlan(request.getPlan());
        response.setAmount(amount);
        response.setLastFourDigits(payment.getLastFourDigits());
        response.setCardholderName(request.getCardholderName());
        response.setStatus("COMPLETED");
        response.setPaidAt(payment.getPaidAt());
        response.setMembershipEnd(end);
        return response;
    }

    public List<PaymentResponse> getPaymentHistory(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return paymentRepository.findByUserIdOrderByPaidAtDesc(user.getId())
                .stream().map(p -> {
                    PaymentResponse r = new PaymentResponse();
                    r.setId(p.getId());
                    r.setPlan(p.getPlan());
                    r.setAmount(p.getAmount());
                    r.setLastFourDigits(p.getLastFourDigits());
                    r.setCardholderName(p.getCardholderName());
                    r.setStatus(p.getStatus().name());
                    r.setPaidAt(p.getPaidAt());
                    return r;
                }).collect(Collectors.toList());
    }

    public void cancelMembership(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        user.setMembershipPlan(User.MembershipPlan.FREE);
        user.setMembershipEnd(LocalDateTime.now());
        userRepository.save(user);
    }
}