// API Configuration
export const API_BASE_URL = 'http://localhost:8080/api';

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  COOKIES: '/cookies',
  ORDERS: '/orders',
  ORDER_ITEMS: '/order-items',
  CUSTOMERS: '/customers',
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'ROLE_ADMIN',
  CUSTOMER: 'ROLE_USER',
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
  DELIVERED: 'Delivered',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
};

// Theme Colors
export const THEME_COLORS = {
  PRIMARY: '#ff8c42',
  SECONDARY: '#ffb347',
  SUCCESS: '#28a745',
  DANGER: '#dc3545',
  WARNING: '#ffc107',
  INFO: '#17a2b8',
  LIGHT: '#f8f9fa',
  DARK: '#343a40',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
  CART: 'customerCart',
  THEME: 'theme',
  SETTINGS: 'userSettings',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 6,
  MAX_PAGE_SIZE: 50,
};

// Cache Settings
export const CACHE = {
  COOKIES_TTL: 300000, // 5 minutes
  ORDERS_TTL: 60000,   // 1 minute
};
