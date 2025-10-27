package com.example.cookie.cookiemanagement.dto;

import com.example.cookie.cookiemanagement.entity.CookieEntity;
import org.springframework.stereotype.Component;

@Component
public class CookieMapper {
    
    public CookieDto toDto(CookieEntity entity) {
        if (entity == null) {
            return null;
        }
        
        CookieDto dto = new CookieDto();
        dto.setId(entity.getCookieId());
        dto.setName(entity.getName());
        dto.setFlavor(entity.getFlavor());
        dto.setPrice(entity.getPrice());
        dto.setQuantityAvailable(entity.getQuantityAvailable());
        dto.setImageUrl(entity.getImageUrl() != null ? entity.getImageUrl() : "");
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        
        return dto;
    }
    
    public CookieEntity toEntity(CookieDto dto) {
        if (dto == null) {
            return null;
        }
        
        CookieEntity entity = new CookieEntity();
        entity.setCookieId(dto.getId());
        entity.setName(dto.getName());
        entity.setFlavor(dto.getFlavor());
        entity.setPrice(dto.getPrice());
        // Set default quantity if not provided
        entity.setQuantityAvailable(dto.getQuantityAvailable() != null ? dto.getQuantityAvailable() : 0);
        entity.setImageUrl(dto.getImageUrl());
        
        return entity;
    }
}
