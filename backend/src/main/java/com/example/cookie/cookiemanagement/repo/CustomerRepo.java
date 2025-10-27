package com.example.cookie.cookiemanagement.repo;

import com.example.cookie.cookiemanagement.entity.CustomerEntity;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepo extends JpaRepository<CustomerEntity, Long> {
    // Example of a custom query method:
    Optional<CustomerEntity> findByEmail(String email);
}
