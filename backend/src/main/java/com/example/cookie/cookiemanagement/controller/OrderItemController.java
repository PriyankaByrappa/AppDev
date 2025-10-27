package com.example.cookie.cookiemanagement.controller;

import com.example.cookie.cookiemanagement.entity.OrderItemEntity;
import com.example.cookie.cookiemanagement.service.OrderItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/order-items")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class OrderItemController {

    @Autowired
    private OrderItemService orderItemService;

    // Get all order items
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<OrderItemEntity> getAllOrderItems() {
        return orderItemService.getAllOrderItems();
    }

    // Get an order item by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public OrderItemEntity getOrderItemById(@PathVariable Long id) {
        return orderItemService.getOrderItemById(id);
    }

    // Create a new order item
    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public OrderItemEntity createOrderItem(@RequestBody OrderItemEntity orderItem) {
        return orderItemService.createOrderItem(orderItem);
    }

    // Update an order item
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public OrderItemEntity updateOrderItem(@PathVariable Long id, @RequestBody OrderItemEntity orderItem) {
        return orderItemService.updateOrderItem(id, orderItem);
    }

    // Delete an order item
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteOrderItem(@PathVariable Long id) {
        return orderItemService.deleteOrderItem(id);
    }
}
