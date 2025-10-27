package com.example.cookie.cookiemanagement.repo;

import com.example.cookie.cookiemanagement.entity.OrderItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepo extends JpaRepository<OrderItemEntity, Long> {
    // Example custom query:
    // List<OrderItemEntity> findByOrderId(Long orderId);
}
