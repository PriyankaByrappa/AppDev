package com.example.cookie.cookiemanagement.service;

import com.example.cookie.cookiemanagement.entity.CartEntity;
import com.example.cookie.cookiemanagement.entity.CartItemEntity;
import com.example.cookie.cookiemanagement.entity.CookieEntity;
import com.example.cookie.cookiemanagement.entity.CustomerEntity;
import com.example.cookie.cookiemanagement.repo.CartRepo;
import com.example.cookie.cookiemanagement.repo.CartItemRepo;
import com.example.cookie.cookiemanagement.repo.CookieRepo;
import com.example.cookie.cookiemanagement.repo.CustomerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CartService {

    @Autowired
    private CartRepo cartRepo;

    @Autowired
    private CartItemRepo cartItemRepo;

    @Autowired
    private CookieRepo cookieRepo;

    @Autowired
    private CustomerRepo customerRepo;

    // Get all carts
    public List<CartEntity> getAllCarts() {
        return cartRepo.findAll();
    }

    // Get a cart by ID
    public CartEntity getCartById(Long id) {
        return cartRepo.findById(id).orElse(null);
    }

    // Get cart by customer email
    public CartEntity getCartByCustomerEmail(String email) {
        CustomerEntity customer = customerRepo.findByEmail(email).orElse(null);
        if (customer == null) {
            return null;
        }
        return cartRepo.findByCustomer(customer).orElse(null);
    }

    // Get or create cart for customer
    public CartEntity getOrCreateCartForCustomer(String email) {
        CustomerEntity customer = customerRepo.findByEmail(email).orElse(null);
        if (customer == null) {
            throw new RuntimeException("Customer not found with email: " + email);
        }

        Optional<CartEntity> existingCart = cartRepo.findByCustomer(customer);
        if (existingCart.isPresent()) {
            return existingCart.get();
        }

        // Create new cart for customer
        CartEntity newCart = new CartEntity();
        newCart.setCustomer(customer);
        newCart.setTotalAmount(0.0);
        newCart.setStatus("ACTIVE");
        return cartRepo.save(newCart);
    }

    // Add item to cart
    public CartItemEntity addItemToCart(String email, Long cookieId, Integer quantity) {
        CartEntity cart = getOrCreateCartForCustomer(email);
        CookieEntity cookie = cookieRepo.findById(cookieId).orElse(null);
        
        if (cookie == null) {
            throw new RuntimeException("Cookie not found with ID: " + cookieId);
        }

        // Check stock availability
        if (cookie.getQuantityAvailable() < quantity) {
            throw new RuntimeException("Insufficient stock. Available: " + cookie.getQuantityAvailable() + ", Requested: " + quantity);
        }

        // Check if item already exists in cart
        Optional<CartItemEntity> existingItem = cartItemRepo.findByCartAndCookie(cart, cookie);
        
        if (existingItem.isPresent()) {
            // Update quantity
            CartItemEntity item = existingItem.get();
            int newQuantity = item.getQuantity() + quantity;
            
            // Check if total quantity exceeds available stock
            if (cookie.getQuantityAvailable() < newQuantity) {
                throw new RuntimeException("Insufficient stock. Available: " + cookie.getQuantityAvailable() + ", Total requested: " + newQuantity);
            }
            
            item.setQuantity(newQuantity);
            item.setPrice(cookie.getPrice());
            cartItemRepo.save(item);
            
            // Reduce stock
            cookie.setQuantityAvailable(cookie.getQuantityAvailable() - quantity);
            cookieRepo.save(cookie);
            
            updateCartTotal(cart);
            return item;
        } else {
            // Create new cart item
            CartItemEntity newItem = new CartItemEntity();
            newItem.setCart(cart);
            newItem.setCookie(cookie);
            newItem.setQuantity(quantity);
            newItem.setPrice(cookie.getPrice());
            cartItemRepo.save(newItem);
            
            // Reduce stock
            cookie.setQuantityAvailable(cookie.getQuantityAvailable() - quantity);
            cookieRepo.save(cookie);
            
            updateCartTotal(cart);
            return newItem;
        }
    }

    // Update cart item quantity
    public CartItemEntity updateCartItemQuantity(Long itemId, Integer quantity) {
        CartItemEntity item = cartItemRepo.findById(itemId).orElse(null);
        if (item == null) {
            throw new RuntimeException("Cart item not found with ID: " + itemId);
        }

        CookieEntity cookie = item.getCookie();
        int currentQuantity = item.getQuantity();
        int quantityDifference = quantity - currentQuantity;

        if (quantity <= 0) {
            // Remove item from cart and restore stock
            cookie.setQuantityAvailable(cookie.getQuantityAvailable() + currentQuantity);
            cookieRepo.save(cookie);
            cartItemRepo.delete(item);
            updateCartTotal(item.getCart());
            return null;
        }

        // Check if we're increasing quantity and have enough stock
        if (quantityDifference > 0) {
            if (cookie.getQuantityAvailable() < quantityDifference) {
                throw new RuntimeException("Insufficient stock. Available: " + cookie.getQuantityAvailable() + ", Requested additional: " + quantityDifference);
            }
            // Reduce stock for additional quantity
            cookie.setQuantityAvailable(cookie.getQuantityAvailable() - quantityDifference);
        } else if (quantityDifference < 0) {
            // Increase stock for reduced quantity
            cookie.setQuantityAvailable(cookie.getQuantityAvailable() + Math.abs(quantityDifference));
        }

        cookieRepo.save(cookie);
        item.setQuantity(quantity);
        cartItemRepo.save(item);
        updateCartTotal(item.getCart());
        return item;
    }

    // Remove item from cart
    public String removeItemFromCart(Long itemId) {
        CartItemEntity item = cartItemRepo.findById(itemId).orElse(null);
        if (item == null) {
            return "Cart item not found with ID: " + itemId;
        }

        CartEntity cart = item.getCart();
        CookieEntity cookie = item.getCookie();
        
        // Restore stock
        cookie.setQuantityAvailable(cookie.getQuantityAvailable() + item.getQuantity());
        cookieRepo.save(cookie);
        
        cartItemRepo.delete(item);
        updateCartTotal(cart);
        return "Item removed from cart successfully";
    }

    // Clear cart
    public String clearCart(String email) {
        CartEntity cart = getCartByCustomerEmail(email);
        if (cart == null) {
            return "Cart not found for user: " + email;
        }

        // Restore stock for all items before clearing
        if (cart.getCartItems() != null) {
            for (CartItemEntity item : cart.getCartItems()) {
                CookieEntity cookie = item.getCookie();
                cookie.setQuantityAvailable(cookie.getQuantityAvailable() + item.getQuantity());
                cookieRepo.save(cookie);
            }
        }

        cartItemRepo.deleteByCart(cart);
        cart.setTotalAmount(0.0);
        cartRepo.save(cart);
        return "Cart cleared successfully";
    }

    // Update cart total
    private void updateCartTotal(CartEntity cart) {
        List<CartItemEntity> items = cartItemRepo.findByCart(cart);
        double total = items.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
        cart.setTotalAmount(total);
        cartRepo.save(cart);
    }

    // Create a new cart
    public CartEntity createCart(CartEntity cart) {
        return cartRepo.save(cart);
    }

    // Update cart details
    public CartEntity updateCart(Long id, CartEntity updatedCart) {
        return cartRepo.findById(id).map(existingCart -> {
            existingCart.setTotalAmount(updatedCart.getTotalAmount());
            existingCart.setStatus(updatedCart.getStatus());
            return cartRepo.save(existingCart);
        }).orElse(null);
    }

    // Delete a cart
    public String deleteCart(Long id) {
        if (cartRepo.existsById(id)) {
            cartRepo.deleteById(id);
            return "Cart deleted successfully";
        }
        return "Cart not found with ID: " + id;
    }
}
