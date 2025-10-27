package com.example.cookie.cookiemanagement.entity;

import java.time.LocalDateTime;
import java.util.List;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long orderId;

    @Column(name = "order_date", nullable = false)
    private LocalDateTime orderDate;

    @Column(name = "status")
    private String status = "PENDING";

    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    @JsonBackReference("customer-orders")
    private CustomerEntity customer;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("order-items")
    private List<OrderItemEntity> orderItems;

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("order-payment")
    private PaymentEntity payment;
}
