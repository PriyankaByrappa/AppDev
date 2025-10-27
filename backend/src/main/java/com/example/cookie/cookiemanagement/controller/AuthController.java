package com.example.cookie.cookiemanagement.controller;

import com.example.cookie.cookiemanagement.dto.LoginRequest;
import com.example.cookie.cookiemanagement.dto.LoginResponse;
import com.example.cookie.cookiemanagement.entity.AdminEntity;
import com.example.cookie.cookiemanagement.entity.CustomerEntity;
import com.example.cookie.cookiemanagement.security.JwtUtil;
import com.example.cookie.cookiemanagement.service.AdminService;
import com.example.cookie.cookiemanagement.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private AdminService adminService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );

            // Generate JWT token
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtUtil.generateToken(userDetails);

            // Get user role
            String role = userDetails.getAuthorities().iterator().next().getAuthority();

            // Create user object
            LoginResponse.User user = new LoginResponse.User();
            user.setId(userDetails.getUsername()); // Using email as ID for now
            user.setEmail(loginRequest.getEmail());
            user.setName(loginRequest.getEmail().split("@")[0]); // Extract name from email
            user.setRole(role);
            user.setCreatedAt(java.time.Instant.now().toString());
            user.setLastLogin(java.time.Instant.now().toString());

            LoginResponse response = new LoginResponse(token, null, user);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid credentials");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody CustomerEntity customer) {
        try {
            // Check if customer already exists
            if (customerService.getCustomerByEmail(customer.getEmail()) != null) {
                return ResponseEntity.badRequest().body("Customer already exists with this email");
            }

            customerService.createCustomer(customer);
            return ResponseEntity.ok("Customer registered successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/admin/register")
    public ResponseEntity<?> registerAdmin(@RequestBody AdminEntity admin) {
        try {
            // Check if admin already exists
            if (adminService.getAdminByEmail(admin.getEmail()) != null) {
                return ResponseEntity.badRequest().body("Admin already exists with this email");
            }

            adminService.createAdmin(admin);
            return ResponseEntity.ok("Admin registered successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Admin registration failed: " + e.getMessage());
        }
    }
}
