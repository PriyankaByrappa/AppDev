package com.example.cookie.cookiemanagement.service;

import com.example.cookie.cookiemanagement.entity.OrderItemEntity;
import com.example.cookie.cookiemanagement.repo.OrderItemRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderItemService {

    @Autowired
    private OrderItemRepo repo;

    // Get all order items
    public List<OrderItemEntity> getAllOrderItems() {
        return repo.findAll();
    }

    // Get an order item by ID
    public OrderItemEntity getOrderItemById(Long id) {
        return repo.findById(id).orElse(null);
    }

    // Create a new order item
    public OrderItemEntity createOrderItem(OrderItemEntity orderItem) {
        return repo.save(orderItem);
    }

    // Update order item details
    public OrderItemEntity updateOrderItem(Long id, OrderItemEntity updatedOrderItem) {
        return repo.findById(id).map(existingOrderItem -> {
            existingOrderItem.setProduct(updatedOrderItem.getProduct()); // if linked to a product entity
            existingOrderItem.setQuantity(updatedOrderItem.getQuantity());
            existingOrderItem.setPrice(updatedOrderItem.getPrice());
            // existingOrderItem.setOrder(updatedOrderItem.getOrder()); // if linked to an order entity
            return repo.save(existingOrderItem);
        }).orElse(null);
    }

    // Delete an order item
    public String deleteOrderItem(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return "Order item deleted successfully";
        }
        return "Order item not found with ID: " + id;
    }
}
