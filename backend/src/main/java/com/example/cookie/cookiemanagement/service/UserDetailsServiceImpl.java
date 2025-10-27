package com.example.cookie.cookiemanagement.service;
import com.example.cookie.cookiemanagement.entity.AdminEntity;
import com.example.cookie.cookiemanagement.entity.CustomerEntity;
import com.example.cookie.cookiemanagement.repo.AdminRepo; // Assuming your Admin Repository is named AdminRepo
import com.example.cookie.cookiemanagement.repo.CustomerRepo; // Assuming your Customer Repository is named CustomerRepo
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private CustomerRepo customerRepository;

    @Autowired
    private AdminRepo adminRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. Try to find the user as a Customer
        CustomerEntity customer = customerRepository.findByEmail(email).orElse(null);
        if (customer != null) {
            String role = customer.getRole();
            // Clean up the role - handle double ROLE_ prefix
            if (role != null) {
                if (role.startsWith("ROLE_ROLE_")) {
                    // Remove double ROLE_ prefix
                    role = role.substring(10); // Remove "ROLE_ROLE_" prefix
                } else if (role.startsWith("ROLE_")) {
                    // Remove single ROLE_ prefix
                    role = role.substring(5); // Remove "ROLE_" prefix
                }
                role = "ROLE_" + role.toUpperCase();
            } else {
                role = "ROLE_CUSTOMER";
            }
            
            return User.builder()
                       .username(customer.getEmail())
                       .password(customer.getPassword())
                       .authorities(Collections.singletonList(new SimpleGrantedAuthority(role)))
                       .build();
        }

        // 2. Try to find the user as an Admin
        AdminEntity admin = adminRepository.findByEmail(email).orElse(null);
        if (admin != null) {
            // Get the role from the entity, default to ADMIN if null
            String role = admin.getRole() != null ? admin.getRole() : "ADMIN";
            
            // Clean up the role - handle double ROLE_ prefix
            if (role.startsWith("ROLE_ROLE_")) {
                // Remove double ROLE_ prefix
                role = role.substring(10); // Remove "ROLE_ROLE_" prefix
            } else if (role.startsWith("ROLE_")) {
                // Remove single ROLE_ prefix
                role = role.substring(5); // Remove "ROLE_" prefix
            }
            role = "ROLE_" + role.toUpperCase();
            
            return User.builder()
                       .username(admin.getEmail())
                       .password(admin.getPassword())
                       .authorities(Collections.singletonList(new SimpleGrantedAuthority(role)))
                       .build();
        }

        // 3. If not found in either
        throw new UsernameNotFoundException("User not found with email: " + email);
    }
}
