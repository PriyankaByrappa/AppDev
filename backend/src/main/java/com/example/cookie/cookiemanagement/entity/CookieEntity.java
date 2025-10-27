package com.example.cookie.cookiemanagement.entity;

import java.util.List;
import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "cookies")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CookieEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cookie_id")
    private Long cookieId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "flavor")
    private String flavor;

    @Column(name = "price", nullable = false)
    private Double price;

    @Column(name = "quantity_available", nullable = false)
    private Integer quantityAvailable;
    
    @Column(name = "image_url")
    private String imageUrl;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "cookie", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<CartItemEntity> cartItems;

    @OneToMany(mappedBy = "cookie", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<OrderItemEntity> orderItems;
}
