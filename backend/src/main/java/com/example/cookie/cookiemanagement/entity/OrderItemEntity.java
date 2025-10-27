package com.example.cookie.cookiemanagement.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_item_id")
    private Long orderItemId;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "price", nullable = false)
    private Double price;
    
    @Column(name = "product", nullable = false)
    private String product;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    @JsonBackReference("order-items")
    private OrderEntity order;

    @ManyToOne
    @JoinColumn(name = "cookie_id", nullable = false)
    @JsonBackReference("cookie-order-items")
    private CookieEntity cookie;
}
