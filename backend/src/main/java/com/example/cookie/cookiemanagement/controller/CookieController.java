package com.example.cookie.cookiemanagement.controller;

import org.springframework.web.bind.annotation.*;
import com.example.cookie.cookiemanagement.entity.CookieEntity;
import com.example.cookie.cookiemanagement.dto.CookieDto;
import com.example.cookie.cookiemanagement.dto.CookieMapper;
import com.example.cookie.cookiemanagement.service.CookieService;

import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cookies")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class CookieController {

    @Autowired
    private CookieService cookieService;
    
    @Autowired
    private CookieMapper cookieMapper;

    // Get all cookies
    @GetMapping
    public List<CookieDto> getAllCookies() {
        return cookieService.getAllCookies().stream()
                .map(cookieMapper::toDto)
                .collect(Collectors.toList());
    }

    // Get a cookie by ID
    @GetMapping("/{id}")
    public CookieDto getCookieById(@PathVariable Long id) {
        return cookieMapper.toDto(cookieService.getCookieById(id));
    }

    // Create a new cookie
    @PostMapping
    public CookieDto createCookie(@RequestBody CookieDto cookieDto) {
        CookieEntity entity = cookieMapper.toEntity(cookieDto);
        CookieEntity savedEntity = cookieService.createCookie(entity);
        return cookieMapper.toDto(savedEntity);
    }

    // Update a cookie
    @PutMapping("/{id}")
    public CookieDto updateCookie(@PathVariable Long id, @RequestBody CookieDto cookieDto) {
        cookieDto.setId(id); // Ensure ID matches path variable
        CookieEntity entity = cookieMapper.toEntity(cookieDto);
        CookieEntity updatedEntity = cookieService.updateCookie(id, entity);
        return cookieMapper.toDto(updatedEntity);
    }

    // Delete a cookie
    @DeleteMapping("/{id}")
    public String deleteCookie(@PathVariable Long id) {
        return cookieService.deleteCookie(id);
    }
}
