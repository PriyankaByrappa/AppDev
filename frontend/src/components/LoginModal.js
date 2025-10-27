import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const LoginModal = ({ onClose }) => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext); 

  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'ROLE_USER' 
  });
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('📨 Sending login data:', form);

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email: form.email,
        password: form.password
      });

      const loggedUser = response.data.user;
      const token = response.data.token;

      console.log('✅ API Response:', response.data);

      if (!loggedUser || !loggedUser.role) {
        alert('No user found with these credentials.');
        return;
      }

      const backendRole = loggedUser.role?.toUpperCase() || '';

      // ✅ Save user in AuthContext and token in localStorage
      setUser(loggedUser);
      localStorage.setItem('token', token);

      // Check role matches selection
      if (form.role === 'ROLE_ADMIN' && !backendRole.includes('ADMIN')) {
        alert('Invalid login: You are not an Admin.');
        return;
      }
      if (form.role === 'ROLE_USER' && !backendRole.includes('CUSTOMER') && !backendRole.includes('USER')) {
        alert('Invalid login: You are not a Customer.');
        return;
      }

      setSuccessMessage('Logged in successfully!');
      setTimeout(() => {
        onClose(); 
        if (form.role === 'ROLE_ADMIN') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/customer', { replace: true });
        }
      }, 1500);
    } catch (error) {
      console.error('❌ Login failed:', error.response?.data || error.message);
      alert(
        error.response?.data?.message || 
        'Invalid credentials or user not found. Please try again.'
      );
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Login</h2>

        {successMessage ? (
          <p style={styles.success}>{successMessage}</p>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              style={styles.input}
              required
            >
              <option value="ROLE_USER">Customer</option>
              <option value="ROLE_ADMIN">Admin</option>
            </select>

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              style={styles.input}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              style={styles.input}
              required
            />

            <button type="submit" style={styles.submit}>Login</button>
            <button type="button" onClick={onClose} style={styles.cancel}>Cancel</button>
          </form>
        )}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    background: 'rgba(0,0,0,0.5)', display: 'flex',
    justifyContent: 'center', alignItems: 'center', zIndex: 1000
  },
  modal: {
    background: '#fff', padding: '30px', borderRadius: '10px',
    width: '350px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)', textAlign: 'center'
  },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: { padding: '10px', borderRadius: '6px', border: '1px solid #ccc' },
  submit: {
    backgroundColor: '#ffb347', border: 'none', padding: '10px',
    borderRadius: '6px', color: '#fff', fontWeight: 'bold'
  },
  cancel: {
    backgroundColor: '#ccc', border: 'none', padding: '8px',
    borderRadius: '6px', color: '#333'
  },
  success: {
    color: 'green', fontWeight: 'bold', fontSize: '16px'
  }
};

export default LoginModal;
