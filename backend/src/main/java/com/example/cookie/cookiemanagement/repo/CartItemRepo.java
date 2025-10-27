package com.example.cookie.cookiemanagement.repo;

import com.example.cookie.cookiemanagement.entity.CartItemEntity;
import com.example.cookie.cookiemanagement.entity.CartEntity;
import com.example.cookie.cookiemanagement.entity.CookieEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepo extends JpaRepository<CartItemEntity, Long> {
    List<CartItemEntity> findByCart(CartEntity cart);
    Optional<CartItemEntity> findByCartAndCookie(CartEntity cart, CookieEntity cookie);
    void deleteByCart(CartEntity cart);
}
