package com.example.cookie.cookiemanagement.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "cart_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_item_id")
    private Long cartItemId;
    
    @Column(name = "quantity")
    private Integer quantity;
    
    @Column(name = "price")
    private Double price;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    @JsonBackReference("cart-items")
    private CartEntity cart;

    @ManyToOne
    @JoinColumn(name = "cookie_id")
    @JsonIgnoreProperties({"cartItems", "orderItems"})
    private CookieEntity cookie;
}
