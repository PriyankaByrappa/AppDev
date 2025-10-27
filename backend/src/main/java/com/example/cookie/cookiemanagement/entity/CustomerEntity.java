package com.example.cookie.cookiemanagement.entity;

import java.util.List;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonManagedReference;
// import com.fasterxml.jackson.annotation.JsonProperty;
@Entity
@Data
@Table(name = "customers")
@NoArgsConstructor
@AllArgsConstructor
public class CustomerEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "email", unique = true, nullable = false)
    private String email;
    
    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "phonenumber", nullable = false)
    private String phonenumber;

    @Column(name = "address")
    private String address;

    @Column(name = "role")
    private String role = "CUSTOMER";

    @OneToOne(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("customer-cart")
    private CartEntity cart;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("customer-orders")
    private List<OrderEntity> orders;
}
