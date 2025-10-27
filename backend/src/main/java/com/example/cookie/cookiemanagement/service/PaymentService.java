package com.example.cookie.cookiemanagement.service;

import com.example.cookie.cookiemanagement.entity.PaymentEntity;
import com.example.cookie.cookiemanagement.repo.PaymentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepo repo;

    // Get all payments
    public List<PaymentEntity> getAllPayments() {
        return repo.findAll();
    }

    // Get a payment by ID
    public PaymentEntity getPaymentById(Long id) {
        return repo.findById(id).orElse(null);
    }

    // Create a new payment
    public PaymentEntity createPayment(PaymentEntity payment) {
        return repo.save(payment);
    }

    // Update payment details
    public PaymentEntity updatePayment(Long id, PaymentEntity updatedPayment) {
        return repo.findById(id).map(existingPayment -> {
            // existingPayment.setOrder(updatedPayment.getOrder()); // link to order entity
            existingPayment.setAmount(updatedPayment.getAmount());
            existingPayment.setPaymentDate(updatedPayment.getPaymentDate());
            existingPayment.setPaymentMethod(updatedPayment.getPaymentMethod());
            existingPayment.setStatus(updatedPayment.getStatus());
            return repo.save(existingPayment);
        }).orElse(null);
    }

    // Delete a payment
    public String deletePayment(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return "Payment deleted successfully";
        }
        return "Payment not found with ID: " + id;
    }
}
