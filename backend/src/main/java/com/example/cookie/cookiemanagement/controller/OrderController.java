package com.example.cookie.cookiemanagement.controller;

import com.example.cookie.cookiemanagement.entity.OrderEntity;
import com.example.cookie.cookiemanagement.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // Get all orders (Admin only)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<OrderEntity> getAllOrders() {
        return orderService.getAllOrders();
    }

    // Get current user's orders
    @GetMapping("/my-orders")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public List<OrderEntity> getMyOrders() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = auth.getName();
        return orderService.getOrdersByCustomerEmail(userEmail);
    }

    // Get an order by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public OrderEntity getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }

    // Create order from cart
    @PostMapping("/create-from-cart")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public OrderEntity createOrderFromCart() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = auth.getName();
        return orderService.createOrderFromCart(userEmail);
    }

    // Create a new order
    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public OrderEntity createOrder(@RequestBody OrderEntity order) {
        return orderService.createOrder(order);
    }

    // Update order status
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public OrderEntity updateOrderStatus(@PathVariable Long id, @RequestBody String status) {
        return orderService.updateOrderStatus(id, status);
    }

    // Update an order
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public OrderEntity updateOrder(@PathVariable Long id, @RequestBody OrderEntity order) {
        return orderService.updateOrder(id, order);
    }

    // Delete an order
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteOrder(@PathVariable Long id) {
        return orderService.deleteOrder(id);
    }
}
