package com.example.cookie.cookiemanagement.controller;

import com.example.cookie.cookiemanagement.entity.CartEntity;
import com.example.cookie.cookiemanagement.entity.CartItemEntity;
import com.example.cookie.cookiemanagement.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/carts")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class CartController {

    @Autowired
    private CartService cartService;

    // Get all carts (Admin only)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<CartEntity> getAllCarts() {
        return cartService.getAllCarts();
    }

    // Debug endpoint to check cart status
    @GetMapping("/debug")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public Map<String, Object> debugCart() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = auth.getName();
        
        Map<String, Object> debugInfo = new HashMap<>();
        debugInfo.put("userEmail", userEmail);
        
        CartEntity cart = cartService.getCartByCustomerEmail(userEmail);
        if (cart != null) {
            debugInfo.put("cartId", cart.getCartId());
            debugInfo.put("totalAmount", cart.getTotalAmount());
            debugInfo.put("status", cart.getStatus());
            debugInfo.put("cartItemsCount", cart.getCartItems() != null ? cart.getCartItems().size() : 0);
            debugInfo.put("cartItems", cart.getCartItems());
        } else {
            debugInfo.put("cartExists", false);
        }
        
        return debugInfo;
    }

    // Get current user's cart
    @GetMapping("/my-cart")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public CartEntity getMyCart() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = auth.getName();
        CartEntity cart = cartService.getCartByCustomerEmail(userEmail);
        
        // If no cart exists, create one
        if (cart == null) {
            cart = cartService.getOrCreateCartForCustomer(userEmail);
        }
        
        return cart;
    }

    // Get a cart by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public CartEntity getCartById(@PathVariable Long id) {
        return cartService.getCartById(id);
    }

    // Add item to cart
    @PostMapping("/add-item")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public CartItemEntity addItemToCart(@RequestBody Map<String, Object> request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = auth.getName();
        Long cookieId = Long.valueOf(request.get("cookieId").toString());
        Integer quantity = Integer.valueOf(request.get("quantity").toString());
        return cartService.addItemToCart(userEmail, cookieId, quantity);
    }

    // Update cart item quantity
    @PutMapping("/update-item/{itemId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public CartItemEntity updateCartItemQuantity(@PathVariable Long itemId, @RequestBody Map<String, Object> request) {
        Integer quantity = Integer.valueOf(request.get("quantity").toString());
        return cartService.updateCartItemQuantity(itemId, quantity);
    }

    // Remove item from cart
    @DeleteMapping("/remove-item/{itemId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public String removeItemFromCart(@PathVariable Long itemId) {
        return cartService.removeItemFromCart(itemId);
    }

    // Clear cart
    @DeleteMapping("/clear")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public String clearCart() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = auth.getName();
        return cartService.clearCart(userEmail);
    }

    // Create a new cart
    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public CartEntity createCart(@RequestBody CartEntity cart) {
        return cartService.createCart(cart);
    }

    // Update a cart
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public CartEntity updateCart(@PathVariable Long id, @RequestBody CartEntity cart) {
        return cartService.updateCart(id, cart);
    }

    // Delete a cart
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteCart(@PathVariable Long id) {
        return cartService.deleteCart(id);
    }
}
