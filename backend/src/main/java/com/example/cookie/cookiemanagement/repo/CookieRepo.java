package com.example.cookie.cookiemanagement.repo;

import com.example.cookie.cookiemanagement.entity.CookieEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CookieRepo extends JpaRepository<CookieEntity, Long> {
    // Add custom query methods if needed, e.g.
    // List<CookieEntity> findByFlavor(String flavor);
}
