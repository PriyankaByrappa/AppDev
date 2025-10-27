package com.example.cookie.cookiemanagement.repo;

import com.example.cookie.cookiemanagement.entity.PaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepo extends JpaRepository<PaymentEntity, Long> {
    // Example custom query:
    // List<PaymentEntity> findByOrderId(Long orderId);
}
