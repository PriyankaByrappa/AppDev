import React, { memo } from 'react';
import { FaEdit, FaTrash, FaEye, FaShoppingCart } from 'react-icons/fa';

const CookieCard = memo(({ cookie, onEdit, onDelete, onView, showActions = false, onAddToCart }) => {
  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to add items to cart');
        return;
      }

      const response = await fetch('http://localhost:8080/api/carts/add-item', {
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
        if (onAddToCart) {
          onAddToCart();
        } else {
          alert(`${cookie.name} added to cart!`);
        }
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

  return (
    <div style={{
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
            ₹{cookie.price}
          </div>
        </div>
      </div>

      {showActions ? (
        <div style={{ padding: '12px' }}>
          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
          <button onClick={() => onView && onView()} style={{
              flex: 1, padding: '8px', borderRadius: '8px',
              border: 'none', backgroundColor: '#17a2b8', color: '#fff', cursor: 'pointer',
              fontSize: '12px', fontWeight: '500', transition: 'all 0.2s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
            }}>
              <FaEye /> View
            </button>
          <button onClick={() => onEdit(cookie)} style={{
              flex: 1, padding: '8px', borderRadius: '8px',
              border: 'none', backgroundColor: '#0d6efd', color: '#fff', cursor: 'pointer',
              fontSize: '12px', fontWeight: '500', transition: 'all 0.2s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
            }}>
              <FaEdit /> Edit
            </button>
          <button onClick={() => onDelete(cookie.id)} style={{
              flex: 1, padding: '8px', borderRadius: '8px',
              border: 'none', backgroundColor: '#dc3545', color: '#fff', cursor: 'pointer',
              fontSize: '12px', fontWeight: '500', transition: 'all 0.2s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
            }}>
              <FaTrash /> Delete
            </button>
          </div>
        </div>
      ) : (
        <div style={{ padding: '16px' }}>
          <button 
            onClick={handleAddToCart}
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
            <FaShoppingCart /> 
            {cookie.quantityAvailable > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      )}
    </div>
  );
});

CookieCard.displayName = 'CookieCard';

export default CookieCard;
