package com.example.cookie.cookiemanagement.service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.example.cookie.cookiemanagement.entity.CookieEntity;
import com.example.cookie.cookiemanagement.repo.CookieRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CookieService {

    @Autowired
    private CookieRepo repo;

    public Page<CookieEntity> getCookiesWithPaginationAndSorting(Pageable pageable) {
    return repo.findAll(pageable);
}

    // Get all cookies
    public List<CookieEntity> getAllCookies() {
        return repo.findAll();
    }

    // Get a cookie by ID
    public CookieEntity getCookieById(Long id) {
        return repo.findById(id).orElse(null);
    }

    // Create a new cookie
    public CookieEntity createCookie(CookieEntity cookie) {
        // Set default quantity if not provided
        if (cookie.getQuantityAvailable() == null) {
            cookie.setQuantityAvailable(0);
        }
        return repo.save(cookie);
    }

    // Update cookie details
    public CookieEntity updateCookie(Long id, CookieEntity updatedCookie) {
        return repo.findById(id).map(existingCookie -> {
            if (updatedCookie.getName() != null) {
                existingCookie.setName(updatedCookie.getName());
            }
            if (updatedCookie.getFlavor() != null) {
                existingCookie.setFlavor(updatedCookie.getFlavor());
            }
            if (updatedCookie.getPrice() != null) {
                existingCookie.setPrice(updatedCookie.getPrice());
            }
            if (updatedCookie.getQuantityAvailable() != null) {
                existingCookie.setQuantityAvailable(updatedCookie.getQuantityAvailable());
            }
            if (updatedCookie.getImageUrl() != null) {
                existingCookie.setImageUrl(updatedCookie.getImageUrl());
            }
            return repo.save(existingCookie);
        }).orElse(null);
    }

    // Delete a cookie
    public String deleteCookie(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return "Cookie deleted successfully";
        }
        return "Cookie not found with ID: " + id;
    }
}
