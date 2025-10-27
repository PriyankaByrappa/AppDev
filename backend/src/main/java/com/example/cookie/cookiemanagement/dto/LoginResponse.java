package com.example.cookie.cookiemanagement.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String refreshToken;
    private User user;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class User {
        private String id;
        private String email;
        private String name;
        private String role;
        private String avatar;
        private String createdAt;
        private String lastLogin;
    }
}
