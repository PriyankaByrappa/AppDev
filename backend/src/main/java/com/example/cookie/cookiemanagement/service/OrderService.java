package com.example.cookie.cookiemanagement.service;

import com.example.cookie.cookiemanagement.entity.OrderEntity;
import com.example.cookie.cookiemanagement.entity.OrderItemEntity;
import com.example.cookie.cookiemanagement.entity.CartEntity;
import com.example.cookie.cookiemanagement.entity.CartItemEntity;
import com.example.cookie.cookiemanagement.entity.CustomerEntity;
import com.example.cookie.cookiemanagement.repo.OrderRepo;
import com.example.cookie.cookiemanagement.repo.OrderItemRepo;
import com.example.cookie.cookiemanagement.repo.CartRepo;
import com.example.cookie.cookiemanagement.repo.CartItemRepo;
import com.example.cookie.cookiemanagement.repo.CustomerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class OrderService {

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private OrderItemRepo orderItemRepo;

    @Autowired
    private CartRepo cartRepo;

    @Autowired
    private CartItemRepo cartItemRepo;

    @Autowired
    private CustomerRepo customerRepo;

    // Get all orders
    public List<OrderEntity> getAllOrders() {
        return orderRepo.findAll();
    }

    // Get orders by customer email
    public List<OrderEntity> getOrdersByCustomerEmail(String email) {
        CustomerEntity customer = customerRepo.findByEmail(email).orElse(null);
        if (customer == null) {
            throw new RuntimeException("Customer not found with email: " + email);
        }
        return orderRepo.findByCustomer(customer);
    }

    // Get an order by ID
    public OrderEntity getOrderById(Long id) {
        return orderRepo.findById(id).orElse(null);
    }

    // Create order from cart
    public OrderEntity createOrderFromCart(String email) {
        CustomerEntity customer = customerRepo.findByEmail(email).orElse(null);
        if (customer == null) {
            throw new RuntimeException("Customer not found with email: " + email);
        }

        CartEntity cart = cartRepo.findByCustomer(customer).orElse(null);
        if (cart == null || cart.getCartItems() == null || cart.getCartItems().isEmpty()) {
            throw new RuntimeException("Cart is empty or not found");
        }

        // Create new order
        OrderEntity order = new OrderEntity();
        order.setCustomer(customer);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PENDING");
        order.setTotalAmount(cart.getTotalAmount());
        order = orderRepo.save(order);

        // Create order items from cart items
        for (CartItemEntity cartItem : cart.getCartItems()) {
            OrderItemEntity orderItem = new OrderItemEntity();
            orderItem.setOrder(order);
            orderItem.setCookie(cartItem.getCookie());
            orderItem.setProduct(cartItem.getCookie().getName());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getPrice());
            orderItemRepo.save(orderItem);
        }

        // Clear the cart after creating order
        // Clear the cart items collection first to avoid ObjectDeletedException
        cart.getCartItems().clear();
        cart.setTotalAmount(0.0);
        cartRepo.save(cart);
        
        // Then delete the cart items from database
        cartItemRepo.deleteByCart(cart);

        return order;
    }

    // Create a new order
    public OrderEntity createOrder(OrderEntity order) {
        if (order.getOrderDate() == null) {
            order.setOrderDate(LocalDateTime.now());
        }
        return orderRepo.save(order);
    }

    // Update order status
    public OrderEntity updateOrderStatus(Long id, String status) {
        return orderRepo.findById(id).map(existingOrder -> {
            existingOrder.setStatus(status);
            return orderRepo.save(existingOrder);
        }).orElse(null);
    }

    // Update order details
    public OrderEntity updateOrder(Long id, OrderEntity updatedOrder) {
        return orderRepo.findById(id).map(existingOrder -> {
            existingOrder.setOrderDate(updatedOrder.getOrderDate());
            existingOrder.setTotalAmount(updatedOrder.getTotalAmount());
            existingOrder.setStatus(updatedOrder.getStatus());
            return orderRepo.save(existingOrder);
        }).orElse(null);
    }

    // Delete an order
    public String deleteOrder(Long id) {
        if (orderRepo.existsById(id)) {
            orderRepo.deleteById(id);
            return "Order deleted successfully";
        }
        return "Order not found with ID: " + id;
    }
}
