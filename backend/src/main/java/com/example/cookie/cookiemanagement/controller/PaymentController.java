package com.example.cookie.cookiemanagement.controller;

import com.example.cookie.cookiemanagement.entity.PaymentEntity;
import com.example.cookie.cookiemanagement.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // Get all payments
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<PaymentEntity> getAllPayments() {
        return paymentService.getAllPayments();
    }

    // Get a payment by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public PaymentEntity getPaymentById(@PathVariable Long id) {
        return paymentService.getPaymentById(id);
    }

    // Create a new payment
    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public PaymentEntity createPayment(@RequestBody PaymentEntity payment) {
        return paymentService.createPayment(payment);
    }

    // Update a payment
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public PaymentEntity updatePayment(@PathVariable Long id, @RequestBody PaymentEntity payment) {
        return paymentService.updatePayment(id, payment);
    }

    // Delete a payment
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deletePayment(@PathVariable Long id) {
        return paymentService.deletePayment(id);
    }
}
