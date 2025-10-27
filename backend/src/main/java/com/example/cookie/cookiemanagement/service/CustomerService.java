package com.example.cookie.cookiemanagement.service;

import com.example.cookie.cookiemanagement.entity.CustomerEntity;
import com.example.cookie.cookiemanagement.repo.CustomerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepo customerRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    // Get all customers
    public List<CustomerEntity> getAllCustomers() {
        return customerRepository.findAll();
    }

    // Get a single customer
    public CustomerEntity getCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + id));
    }

    // Get customer by email
    public CustomerEntity getCustomerByEmail(String email) {
        Optional<CustomerEntity> customer = customerRepository.findByEmail(email);
        return customer.orElse(null);
    }

    // Create new customer with encrypted password
    public CustomerEntity createCustomer(CustomerEntity customer) {
        customer.setPassword(passwordEncoder.encode(customer.getPassword()));
        return customerRepository.save(customer);
    }

    // Update existing customer (encrypt new password if changed)
    public CustomerEntity updateCustomer(Long id, CustomerEntity updatedCustomer) {
        CustomerEntity existing = getCustomerById(id);

        existing.setName(updatedCustomer.getName());
        existing.setEmail(updatedCustomer.getEmail());
        existing.setPhonenumber(updatedCustomer.getPhonenumber());
        existing.setAddress(updatedCustomer.getAddress());
        if (updatedCustomer.getPassword() != null && !updatedCustomer.getPassword().isEmpty()) {
            existing.setPassword(passwordEncoder.encode(updatedCustomer.getPassword()));
        }

        return customerRepository.save(existing);
    }

    // Delete a customer
    public String deleteCustomer(Long id) {
        customerRepository.deleteById(id);
        return "Customer deleted successfully!";
    }
}
