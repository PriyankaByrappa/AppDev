package com.example.cookie.cookiemanagement.controller;

import com.example.cookie.cookiemanagement.entity.AdminEntity;
import com.example.cookie.cookiemanagement.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // Get all admins - Only ADMIN can access
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<AdminEntity> getAllAdmins() {
        return adminService.getAllAdmins();
    }

    // Get admin by ID
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public AdminEntity getAdminById(@PathVariable Long id) {
        return adminService.getAdminById(id);
    }

    // Create a new admin
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public AdminEntity createAdmin(@RequestBody AdminEntity admin) {
        return adminService.createAdmin(admin);
    }

    // Update admin details
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public AdminEntity updateAdmin(@PathVariable Long id, @RequestBody AdminEntity admin) {
        return adminService.updateAdmin(id, admin);
    }

    // Delete admin
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public String deleteAdmin(@PathVariable Long id) {
        return adminService.deleteAdmin(id);
    }

    // Debug endpoint to check admin data
    @GetMapping("/debug")
    public List<AdminEntity> debugAdmins() {
        return adminService.getAllAdmins();
    }

    // Fix admin role endpoint
    @PostMapping("/fix-roles")
    public String fixAdminRoles() {
        return adminService.fixAdminRoles();
    }

    // Public fix admin role endpoint (no auth required for debugging)
    @PostMapping("/public/fix-roles")
    public String fixAdminRolesPublic() {
        return adminService.fixAdminRoles();
    }
}