import axios from 'axios';

// Axios instance with base config
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // proxied to http://localhost:8080/api
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // Add cache control for GET requests
    if (config.method === 'get') {
      config.headers['Cache-Control'] = 'max-age=300'; // 5 minutes cache
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      if (error.response.status === 403) {
        alert('Access forbidden');
      }
    }
    return Promise.reject(error);
  }
);

// ===================== Auth =====================
export const auth = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// ===================== Customers =====================
export const customers = {
  getAll: () => api.get('/customers'),
  getOne: (id) => api.get(`/customers/${id}`),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
};

// ===================== Cookies =====================
export const cookies = {
  getAll: () => api.get('/cookies'),
  getOne: (id) => api.get(`/cookies/${id}`),
  create: (data) => api.post('/cookies', data),
  update: (id, data) => api.put(`/cookies/${id}`, data),
  delete: (id) => api.delete(`/cookies/${id}`),
};

// ===================== Orders =====================
export const orders = {
  getAll: () => api.get('/orders'),
  getOne: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  delete: (id) => api.delete(`/orders/${id}`),
};

// ===================== Order Items =====================
export const orderItems = {
  getAll: () => api.get('/order-items'),
  getOne: (id) => api.get(`/order-items/${id}`),
  create: (data) => api.post('/order-items', data),
  update: (id, data) => api.put(`/order-items/${id}`, data),
  delete: (id) => api.delete(`/order-items/${id}`),
};

// ===================== Cart Items =====================
export const cartItems = {
  getAll: () => api.get('/cart-items'),
  getOne: (id) => api.get(`/cart-items/${id}`),
  add: (data) => api.post('/cart-items', data),
  update: (id, data) => api.put(`/cart-items/${id}`, data),
  remove: (id) => api.delete(`/cart-items/${id}`),
};

// ===================== Payments =====================
export const payments = {
  getAll: () => api.get('/payments'),
  getOne: (id) => api.get(`/payments/${id}`),
  create: (data) => api.post('/payments', data),
  update: (id, data) => api.put(`/payments/${id}`, data),
  delete: (id) => api.delete(`/payments/${id}`),
};

// ===================== Admins =====================
export const admins = {
  getAll: () => api.get('/admin/admins'),
  getOne: (id) => api.get(`/admin/admins/${id}`),
  create: (data) => api.post('/admin/admins', data),
  update: (id, data) => api.put(`/admin/admins/${id}`, data),
  delete: (id) => api.delete(`/admin/admins/${id}`),
};

export default api;
