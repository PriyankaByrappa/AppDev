import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { FaCookie, FaSearch, FaShoppingCart } from 'react-icons/fa';

const HomeSection = () => {
  const { user } = useContext(AuthContext);
  const [cookies, setCookies] = useState([]);
  const [filteredCookies, setFilteredCookies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const API_BASE = 'http://localhost:8080/api';

  useEffect(() => {
    const fetchCookies = async () => {
      try {
        const res = await fetch(`${API_BASE}/cookies`);
        if (res.ok) {
          const data = await res.json();
          setCookies(data);
          setFilteredCookies(data);
        }
      } catch (err) {
        console.error('Failed to fetch cookies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCookies();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = cookies.filter(cookie =>
        cookie.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cookie.flavor?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCookies(filtered);
    } else {
      setFilteredCookies(cookies);
    }
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, cookies]);

  const handleAddToCart = async (cookie) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to add items to cart');
        return;
      }

      const response = await fetch(`${API_BASE}/carts/add-item`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cookieId: cookie.id,
          quantity: 1
        })
      });

      if (response.ok) {
        alert(`Added ${cookie.name} to cart!`);
        // Trigger cart refresh by dispatching a custom event
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } else {
        const errorData = await response.json();
        alert(`Failed to add to cart: ${errorData.message || response.statusText}`);
      }
    } catch (err) {
      console.error('Failed to add to cart:', err);
      alert('Failed to add to cart. Please try again.');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-block',
          width: '36px',
          height: '36px',
          border: '4px solid #FFB347',
          borderBottomColor: '#FF774D',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ marginTop: '12px', color: '#374151', fontWeight: '500' }}>Loading...</p>
        <style>
          {`@keyframes spin { from {transform: rotate(0deg);} to {transform: rotate(360deg);} }`}
        </style>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px 32px', backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: 'clamp(20px, 5vw, 28px)', fontWeight: '700', color: '#111827', display: 'flex', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
          <FaCookie style={{ color: '#FF7F50' }} />
          Welcome, {user?.name || 'Customer'}!
        </h1>
        <p style={{ color: '#6B7280', fontSize: 'clamp(14px, 3vw, 16px)' }}>Browse our delicious cookie collection</p>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ position: 'relative', maxWidth: '100%', width: '100%' }}>
          <FaSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input
            type="text"
            placeholder="Search cookies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 48px',
              border: '2px solid #E5E7EB',
              borderRadius: '12px',
              fontSize: '16px',
              outline: 'none',
              transition: 'all 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#FF7F50'}
            onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
          />
        </div>
      </div>

      {/* Cookie Grid */}
      {filteredCookies.length === 0 ? (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          padding: '48px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '18px', color: '#6B7280' }}>No cookies found</p>
        </div>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            marginBottom: '32px'
          }}>
            {filteredCookies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(cookie => (
            <div
              key={cookie.id}
              style={{
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                borderRadius: '16px', 
                overflow: 'hidden', 
                backgroundColor: '#fff',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)', 
                cursor: 'pointer', 
                width: '100%',
                maxWidth: '300px',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(0,0,0,0.05)',
                position: 'relative'
              }}
              onMouseEnter={e => { 
                e.currentTarget.style.transform = 'translateY(-8px)'; 
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)'; 
              }}
              onMouseLeave={e => { 
                e.currentTarget.style.transform = 'translateY(0)'; 
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'; 
              }}
            >
              {/* Image Container */}
              <div style={{ position: 'relative', height: '180px', overflow: 'hidden', background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)' }}>
                <img 
                  src={cookie.imageUrl || cookie.image || 'https://cdn.pixabay.com/photo/2023/06/04/21/27/cookies-8040940_960_720.jpg'} 
                  alt={cookie.name} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }} 
                />
                {/* Stock Badge */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: cookie.quantityAvailable > 10 ? '#10b981' : cookie.quantityAvailable > 5 ? '#f59e0b' : '#ef4444',
                  color: '#fff',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '600',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}>
                  {cookie.quantityAvailable > 0 ? `${cookie.quantityAvailable} left` : 'Out of stock'}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ 
                  margin: '0 0 8px 0', 
                  fontSize: '18px', 
                  fontWeight: '700', 
                  color: '#1f2937',
                  lineHeight: '1.3',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {cookie.name}
                </h3>
                
                <p style={{ 
                  margin: '0 0 12px 0', 
                  fontSize: '14px', 
                  color: '#6b7280',
                  fontWeight: '500',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {cookie.flavor}
                </p>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginTop: 'auto'
                }}>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#059669',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    ₹{cookie.price || '0.00'}
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div style={{ padding: '16px' }}>
                <button 
                  onClick={() => handleAddToCart(cookie)}
                  disabled={!cookie.quantityAvailable || cookie.quantityAvailable <= 0}
                  style={{
                    width: '100%', 
                    padding: '12px 16px', 
                    borderRadius: '12px',
                    border: 'none', 
                    background: 'linear-gradient(135deg, #ff8c42, #ff6b35)', 
                    color: '#fff', 
                    cursor: cookie.quantityAvailable > 0 ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontWeight: '600',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    opacity: (!cookie.quantityAvailable || cookie.quantityAvailable <= 0) ? 0.6 : 1,
                    boxShadow: '0 4px 12px rgba(255, 140, 66, 0.3)'
                  }}
                  onMouseEnter={e => {
                    if (cookie.quantityAvailable && cookie.quantityAvailable > 0) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(255, 140, 66, 0.4)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (cookie.quantityAvailable && cookie.quantityAvailable > 0) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 12px rgba(255, 140, 66, 0.3)';
                    }
                  }}
                >
                  <FaShoppingCart size={14} />
                  {cookie.quantityAvailable > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
            ))}
          </div>

          {/* Pagination */}
          {Math.ceil(filteredCookies.length / itemsPerPage) > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              marginTop: '32px',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '10px 20px',
                  backgroundColor: currentPage === 1 ? '#E5E7EB' : '#FF7F50',
                  color: currentPage === 1 ? '#9CA3AF' : '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'all 0.3s',
                  boxShadow: currentPage === 1 ? 'none' : '0 2px 8px rgba(255, 127, 80, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== 1) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(255, 127, 80, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== 1) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 8px rgba(255, 127, 80, 0.3)';
                  }
                }}
              >
                Previous
              </button>

              {Array.from({ length: Math.ceil(filteredCookies.length / itemsPerPage) }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{
                    padding: '8px 14px',
                    minWidth: '40px',
                    backgroundColor: currentPage === page ? '#FF7F50' : '#fff',
                    color: currentPage === page ? '#fff' : '#374151',
                    border: currentPage === page ? 'none' : '2px solid #E5E7EB',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px',
                    transition: 'all 0.3s',
                    boxShadow: currentPage === page ? '0 2px 8px rgba(255, 127, 80, 0.3)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== page) {
                      e.target.style.backgroundColor = '#F3F4F6';
                      e.target.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== page) {
                      e.target.style.backgroundColor = '#fff';
                      e.target.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredCookies.length / itemsPerPage)))}
                disabled={currentPage === Math.ceil(filteredCookies.length / itemsPerPage)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: currentPage === Math.ceil(filteredCookies.length / itemsPerPage) ? '#E5E7EB' : '#FF7F50',
                  color: currentPage === Math.ceil(filteredCookies.length / itemsPerPage) ? '#9CA3AF' : '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: currentPage === Math.ceil(filteredCookies.length / itemsPerPage) ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'all 0.3s',
                  boxShadow: currentPage === Math.ceil(filteredCookies.length / itemsPerPage) ? 'none' : '0 2px 8px rgba(255, 127, 80, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== Math.ceil(filteredCookies.length / itemsPerPage)) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(255, 127, 80, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== Math.ceil(filteredCookies.length / itemsPerPage)) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 8px rgba(255, 127, 80, 0.3)';
                  }
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomeSection;
