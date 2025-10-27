import React, { useState } from 'react';
import axios from 'axios';

const SignupModal = ({ onClose }) => {
  const [form, setForm] = useState({
    customer_id: '',
    name: '',
    email: '',
    password: '',
    phonenumber: '',
    address: '',
    role: 'ROLE_USER'
  });

  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('📨 Sending signup data:', form);

    try {
      const response = await axios.post('http://localhost:8080/api/auth/register', form);

      console.log('✅ Signup success:', response.data);

      setSuccessMessage('Signup successful! You can now log in.');
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      console.error('❌ Signup failed:', error.response?.data || error.message);
      alert(
        error.response?.data?.message ||
          'Signup failed. Please check your details and try again.'
      );
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Signup</h2>

        {successMessage ? (
          <p style={styles.success}>{successMessage}</p>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="text"
              name="customer_id"
              placeholder="Customer ID"
              value={form.customer_id}
              onChange={handleChange}
              style={styles.input}
              required
            />

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              style={styles.input}
              required
            />

            <input
              type="email"
              name="email"
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

            <input
              type="text"
              name="phonenumber"
              placeholder="Phone Number"
              value={form.phonenumber}
              onChange={handleChange}
              style={styles.input}
              required
            />

            <input
              type="text"
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              style={styles.input}
              required
            />

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="ROLE_USER">Customer</option>
              <option value="ROLE_ADMIN">Admin</option>
            </select>

            <button type="submit" style={styles.submit}>
              Signup
            </button>
            <button type="button" onClick={onClose} style={styles.cancel}>
              Cancel
            </button>
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
    backgroundColor: '#4CAF50', border: 'none', padding: '10px',
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

export default SignupModal;
