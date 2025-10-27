package com.example.cookie.cookiemanagement.controller;

import com.example.cookie.cookiemanagement.entity.CartItemEntity;
import com.example.cookie.cookiemanagement.service.CartItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/cart-items")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class CartItemController {

    @Autowired
    private CartItemService cartItemService;

    // Get all cart items
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<CartItemEntity> getAllCartItems() {
        return cartItemService.getAllCartItems();
    }

    // Get a cart item by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public CartItemEntity getCartItemById(@PathVariable Long id) {
        return cartItemService.getCartItemById(id);
    }

    // Create a new cart item
    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public CartItemEntity createCartItem(@RequestBody CartItemEntity cartItem) {
        return cartItemService.createCartItem(cartItem);
    }

    // Update a cart item
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public CartItemEntity updateCartItem(@PathVariable Long id, @RequestBody CartItemEntity cartItem) {
        return cartItemService.updateCartItem(id, cartItem);
    }

    // Delete a cart item
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public String deleteCartItem(@PathVariable Long id) {
        return cartItemService.deleteCartItem(id);
    }
}
