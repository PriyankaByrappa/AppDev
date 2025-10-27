package com.example.cookie.cookiemanagement.controller;

import com.example.cookie.cookiemanagement.entity.CustomerEntity;
import com.example.cookie.cookiemanagement.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    // Get all customers
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<CustomerEntity> getAllCustomers() {
        return customerService.getAllCustomers();
    }

    // Get a customer by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public CustomerEntity getCustomerById(@PathVariable Long id) {
        return customerService.getCustomerById(id);
    }

    // Update a customer
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public CustomerEntity updateCustomer(@PathVariable Long id, @RequestBody CustomerEntity customer) {
        return customerService.updateCustomer(id, customer);
    }

    // Delete a customer
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteCustomer(@PathVariable Long id) {
        return customerService.deleteCustomer(id);
    }
}
