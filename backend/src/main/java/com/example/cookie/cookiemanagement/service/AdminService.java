package com.example.cookie.cookiemanagement.service;

import com.example.cookie.cookiemanagement.entity.AdminEntity;
import com.example.cookie.cookiemanagement.repo.AdminRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private AdminRepo repo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Get all admins
    public List<AdminEntity> getAllAdmins() {
        return repo.findAll();
    }

    // Get admin by ID
    public AdminEntity getAdminById(Long id) {
        return repo.findById(id).orElse(null);
    }

    // Get admin by email
    public AdminEntity getAdminByEmail(String email) {
        Optional<AdminEntity> admin = repo.findByEmail(email);
        return admin.orElse(null);
    }

    // Create a new admin (with encrypted password)
    public AdminEntity createAdmin(AdminEntity admin) {
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        return repo.save(admin);
    }

    // Update admin details
    public AdminEntity updateAdmin(Long id, AdminEntity updatedAdmin) {
        return repo.findById(id).map(existingAdmin -> {
            existingAdmin.setName(updatedAdmin.getName());
            existingAdmin.setEmail(updatedAdmin.getEmail());

            // Re-encode password only if changed
            if (!updatedAdmin.getPassword().equals(existingAdmin.getPassword())) {
                existingAdmin.setPassword(passwordEncoder.encode(updatedAdmin.getPassword()));
            }

            existingAdmin.setRole(updatedAdmin.getRole());
            return repo.save(existingAdmin);
        }).orElse(null);
    }

    // Delete an admin
    public String deleteAdmin(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return "Admin deleted successfully";
        }
        return "Admin not found with ID: " + id;
    }

    // Fix admin roles - remove double ROLE_ prefix
    public String fixAdminRoles() {
        List<AdminEntity> admins = repo.findAll();
        int fixed = 0;
        
        for (AdminEntity admin : admins) {
            String role = admin.getRole();
            if (role != null && role.startsWith("ROLE_ROLE_")) {
                // Remove the double ROLE_ prefix
                role = role.substring(5); // Remove "ROLE_" from the beginning
                admin.setRole(role);
                repo.save(admin);
                fixed++;
            }
        }
        
        return "Fixed " + fixed + " admin roles";
    }
}
