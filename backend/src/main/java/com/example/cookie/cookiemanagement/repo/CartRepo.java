package com.example.cookie.cookiemanagement.repo;

import com.example.cookie.cookiemanagement.entity.CartEntity;
import com.example.cookie.cookiemanagement.entity.CustomerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepo extends JpaRepository<CartEntity, Long> {
    Optional<CartEntity> findByCustomer(CustomerEntity customer);
}
