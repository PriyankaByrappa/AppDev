package com.example.cookie.cookiemanagement.repo;

import com.example.cookie.cookiemanagement.entity.OrderEntity;
import com.example.cookie.cookiemanagement.entity.CustomerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepo extends JpaRepository<OrderEntity, Long> {
    List<OrderEntity> findByCustomer(CustomerEntity customer);
}
