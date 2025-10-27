import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaTrash, FaPlus, FaMinus } from 'react-icons/fa';

const CartSection = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = 'http://localhost:8080/api';

  // Function to refresh cart data
  const refreshCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch(`${API_BASE}/carts/my-cart`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Cart refresh - API response status:', response.status);
      
      if (response.ok) {
        const cartData = await response.json();
        console.log('Cart refresh - full data received:', JSON.stringify(cartData, null, 2));
        
        // Check if cartData has cartItems array
        if (cartData && Array.isArray(cartData.cartItems) && cartData.cartItems.length > 0) {
          console.log('Cart items found:', cartData.cartItems.length);
          const transformedCart = cartData.cartItems.map(item => {
            console.log('Processing cart item:', item);
            return {
              id: item.cookie?.cookieId || item.cookie?.id,
              cartItemId: item.cartItemId,
              name: item.cookie?.name || 'Unknown Cookie',
              price: item.price || 0,
              quantity: item.quantity || 1,
              image: item.cookie?.image || 'https://via.placeholder.com/200x200?text=Cookie',
              cookie: item.cookie
            };
          });
          console.log('Transformed cart:', transformedCart);
          setCart(transformedCart);
        } else {
          console.log('No cart items found or cart is empty');
          setCart([]);
        }
      } else if (response.status === 404) {
        console.log('Cart not found (404)');
        setCart([]);
      } else {
        console.error('Failed to refresh cart:', response.statusText);
        const errorText = await response.text();
        console.error('Error response:', errorText);
      }
    } catch (err) {
      console.error('Failed to refresh cart:', err);
    }
  };

  // Fetch cart from backend
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No authentication token found');
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE}/carts/my-cart`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Cart API response status:', response.status); // Debug log
        
        if (response.ok) {
          const cartData = await response.json();
          console.log('Cart data received:', JSON.stringify(cartData, null, 2)); // Debug log
          
          // Handle case where cart might be null or cartItems might be null
          if (cartData && Array.isArray(cartData.cartItems) && cartData.cartItems.length > 0) {
            console.log('Cart items found:', cartData.cartItems.length);
            const transformedCart = cartData.cartItems.map(item => {
              console.log('Processing cart item:', item);
              return {
                id: item.cookie?.cookieId || item.cookie?.id,
                cartItemId: item.cartItemId,
                name: item.cookie?.name || 'Unknown Cookie',
                price: item.price || 0,
                quantity: item.quantity || 1,
                image: item.cookie?.image || 'https://via.placeholder.com/200x200?text=Cookie',
                cookie: item.cookie
              };
            });
            console.log('Transformed cart:', transformedCart);
            setCart(transformedCart);
          } else {
            console.log('No cart items found or cart is empty');
            setCart([]);
          }
        } else if (response.status === 404) {
          // Cart doesn't exist yet, which is fine
          console.log('Cart not found - user has no items yet');
          setCart([]);
        } else {
          console.error('Failed to fetch cart:', response.statusText);
          const errorText = await response.text();
          console.error('Error response:', errorText);
          setCart([]);
        }
      } catch (err) {
        console.error('Failed to fetch cart:', err);
        setCart([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
    
    // Listen for cart updates from other components
    const handleCartUpdate = () => {
      refreshCart();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const updateQuantity = async (cartItemId, newQuantity) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      console.log(`Updating quantity for item ${cartItemId} to ${newQuantity}`);

      if (newQuantity <= 0) {
        // Remove item from cart
        const response = await fetch(`${API_BASE}/carts/remove-item/${cartItemId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Remove item response status:', response.status);
        if (response.ok) {
          console.log('Item removed successfully');
          // Refresh cart to get updated data
          refreshCart();
        } else {
          const errorData = await response.json();
          console.error('Failed to remove item:', errorData);
          alert(`Failed to remove item: ${errorData.message || response.statusText}`);
        }
      } else {
        // Update quantity
        const response = await fetch(`${API_BASE}/carts/update-item/${cartItemId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ quantity: newQuantity })
        });

        console.log('Update quantity response status:', response.status);
        if (response.ok) {
          console.log('Quantity updated successfully');
          // Refresh cart to get updated data
          refreshCart();
        } else {
          const errorData = await response.json();
          console.error('Failed to update quantity:', errorData);
          alert(`Failed to update quantity: ${errorData.message || response.statusText}`);
        }
      }
    } catch (err) {
      console.error('Failed to update cart:', err);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_BASE}/carts/remove-item/${cartItemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Refresh cart to get updated data
        refreshCart();
      }
    } catch (err) {
      console.error('Failed to remove item from cart:', err);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to place an order');
        return;
      }

      const response = await fetch(`${API_BASE}/orders/create-from-cart`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        alert(`Order placed successfully!\nTotal: ₹${calculateTotal()}`);
        setCart([]);
        // Refresh the page to update orders
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(`Failed to place order: ${errorData.message || response.statusText}`);
      }
    } catch (err) {
      console.error('Failed to place order:', err);
      alert('Failed to place order. Please try again.');
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
    <div style={{ padding: '16px 24px', backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <h1 style={{ fontSize: 'clamp(20px, 5vw, 28px)', fontWeight: '700', color: '#111827', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <FaShoppingCart style={{ color: '#FF7F50' }} />
            Shopping Cart
          </h1>
        </div>
        <p style={{ color: '#6B7280', fontSize: 'clamp(14px, 3vw, 16px)' }}>Review and manage your items</p>
      </div>

      {cart.length === 0 ? (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          padding: '48px',
          textAlign: 'center'
        }}>
          <FaShoppingCart style={{ fontSize: '56px', color: '#D1D5DB', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '22px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>Your cart is empty</h3>
          <p style={{ color: '#6B7280', marginBottom: '32px', fontSize: '15px' }}>Add some delicious cookies to get started!</p>
          <button
            onClick={() => window.location.href = '/customer'}
            style={{
              padding: '14px 28px',
              background: 'linear-gradient(90deg, #FF7F50, #FFB347)',
              color: 'white',
              borderRadius: '10px',
              fontWeight: '600',
              cursor: 'pointer',
              border: 'none',
              boxShadow: '0 4px 12px rgba(255, 127, 80, 0.4)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            Browse Cookies
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Cart Items */}
          <div style={{ width: '100%', order: '2' }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              overflow: 'hidden'
            }}>
              <div style={{ padding: '24px', borderBottom: '1px solid #E5E7EB' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827' }}>Cart Items ({cart.length})</h2>
              </div>
              <div>
                {cart.map(item => (
                  <div key={item.cartItemId} style={{
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    borderBottom: '1px solid #F3F4F6',
                    transition: 'background 0.2s',
                  }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ flexShrink: 0 }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          backgroundColor: '#FFEDD5',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '28px'
                        }}>
                          🍪
                        </div>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{item.name}</h3>
                        <p style={{ fontSize: '16px', fontWeight: '700', color: '#FF7F50' }}>₹{item.price}</p>
                        <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                          Stock: {item.cookie?.quantityAvailable || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          style={{
                            padding: '6px',
                            borderRadius: '50%',
                            backgroundColor: '#F3F4F6',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#E5E7EB'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                        >
                          <FaMinus size={12} />
                        </button>
                        <span style={{ width: '32px', textAlign: 'center', fontWeight: '600', fontSize: '15px' }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          style={{
                            padding: '6px',
                            borderRadius: '50%',
                            backgroundColor: '#F3F4F6',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#E5E7EB'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        style={{
                          padding: '8px',
                          color: 'white',
                          borderRadius: '8px',
                          backgroundColor: '#EF4444',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'transform 0.2s',
                          fontSize: '14px'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <FaTrash size={14} /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div style={{ width: '100%', order: '1' }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              padding: '24px',
              position: 'static'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>Order Summary</h3>
              <div style={{ marginBottom: '24px' }}>
                {cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
                    <span style={{ color: '#6B7280' }}>{item.name} x {item.quantity}</span>
                    <span style={{ fontWeight: '500' }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 'bold' }}>
                <span>Total:</span>
                <span style={{ color: '#FF7F50' }}>₹{calculateTotal()}</span>
              </div>
              <button
                onClick={handlePlaceOrder}
                style={{
                  width: '100%',
                  marginTop: '24px',
                  padding: '14px',
                  background: 'linear-gradient(90deg, #FF7F50, #FFB347)',
                  color: 'white',
                  borderRadius: '10px',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(255,127,80,0.3)',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartSection;
