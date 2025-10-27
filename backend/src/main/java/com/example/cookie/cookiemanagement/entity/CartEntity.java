package com.example.cookie.cookiemanagement.entity;

import java.util.List;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "carts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_id")
    private Long cartId;

    @OneToOne
    @JoinColumn(name = "customer_id")
    @JsonBackReference("customer-cart")
    private CustomerEntity customer;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("cart-items")
    private List<CartItemEntity> cartItems;

    @Column(name = "total_amount")
    private Double totalAmount = 0.0;

    @Column(name = "status")
    private String status = "ACTIVE";
}
