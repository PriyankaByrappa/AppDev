package com.example.cookie.cookiemanagement.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Long paymentId;

    @Column(name = "amount", nullable = false)
    private Double amount;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "status")
    private String status = "PENDING";

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;

    @OneToOne
    @JoinColumn(name = "order_id", nullable = false)
    @JsonBackReference("order-payment")
    private OrderEntity order;
}
