package com.example.cookie.cookiemanagement.service;

import com.example.cookie.cookiemanagement.entity.CartItemEntity;
import com.example.cookie.cookiemanagement.repo.CartItemRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartItemService {

    @Autowired
    private CartItemRepo repo;

    // Get all cart items
    public List<CartItemEntity> getAllCartItems() {
        return repo.findAll();
    }

    // Get a cart item by ID
    public CartItemEntity getCartItemById(Long id) {
        return repo.findById(id).orElse(null);
    }

    // Create a new cart item
    public CartItemEntity createCartItem(CartItemEntity cartItem) {
        return repo.save(cartItem);
    }

    // Update cart item details
    public CartItemEntity updateCartItem(Long id, CartItemEntity updatedCartItem) {
        return repo.findById(id).map(existingCartItem -> {
            existingCartItem.setQuantity(updatedCartItem.getQuantity());
            existingCartItem.setPrice(updatedCartItem.getPrice());
            existingCartItem.setCart(updatedCartItem.getCart());
            existingCartItem.setCookie(updatedCartItem.getCookie());
            return repo.save(existingCartItem);
        }).orElse(null);
    }

    // Delete a cart item
    public String deleteCartItem(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return "Cart item deleted successfully";
        }
        return "Cart item not found with ID: " + id;
    }
}
