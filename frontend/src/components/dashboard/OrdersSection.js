import React, { useState, useEffect } from 'react';
import { FaClipboardList, FaEye, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';

const OrdersSection = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const API_BASE = 'http://localhost:8080/api';

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No authentication token found');
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE}/orders/my-orders`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const ordersData = await response.json();
          // Transform backend data to frontend format
          const transformedOrders = ordersData.map(order => ({
            id: order.orderId,
            orderNumber: `ORD-${order.orderId.toString().padStart(3, '0')}`,
            date: order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'Unknown Date',
            status: order.status,
            total: order.totalAmount,
            items: order.orderItems ? order.orderItems.map(item => ({
              name: item.product,
              quantity: item.quantity,
              price: item.price
            })) : []
          }));
          setOrders(transformedOrders);
        } else {
          console.error('Failed to fetch orders:', response.statusText);
          setOrders([]);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return { backgroundColor: '#DCFCE7', color: '#166534' };
      case 'processing': return { backgroundColor: '#FEF3C7', color: '#78350F' };
      case 'shipped': return { backgroundColor: '#DBEAFE', color: '#1E3A8A' };
      case 'cancelled': return { backgroundColor: '#FEE2E2', color: '#991B1B' };
      default: return { backgroundColor: '#F3F4F6', color: '#1F2937' };
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  // Styles
  const containerStyle = { padding: '24px', backgroundColor: '#F9FAFB', minHeight: '100vh' };
  const headerStyle = { marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '8px' };
  const titleStyle = { fontSize: '28px', fontWeight: '700', color: '#111827', display: 'flex', alignItems: 'center', gap: '12px' };
  const subtitleStyle = { color: '#6B7280', fontSize: '14px' };
  const orderCardStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    padding: '24px',
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer'
  };
  const orderCardHover = { transform: 'translateY(-4px)', boxShadow: '0 16px 32px rgba(0,0,0,0.12)' };
  const orderNumberStyle = { fontSize: '16px', fontWeight: '600', color: '#1F2937', display: 'flex', alignItems: 'center', gap: '8px' };
  const orderDetailsStyle = { display: 'flex', gap: '24px', fontSize: '14px', color: '#6B7280', alignItems: 'center' };
  const viewButtonStyle = {
    padding: '10px 20px',
    background: 'linear-gradient(90deg, #FF7F50, #FFB347)',
    color: 'white',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'transform 0.2s'
  };
  const modalOverlayStyle = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 50 };
  const modalContentStyle = { backgroundColor: 'white', borderRadius: '12px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto' };
  const modalHeaderStyle = { padding: '24px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
  const modalBodyStyle = { padding: '24px' };
  const modalFooterStyle = { padding: '24px', borderTop: '1px solid #E5E7EB', textAlign: 'right' };
  const closeButtonStyle = { padding: '10px 20px', backgroundColor: '#6B7280', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600' };
  const itemRowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #F3F4F6' };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}><FaClipboardList style={{ color: '#FF7F50' }} /> Order History</h1>
        <p style={subtitleStyle}>Track and view your past orders</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '64px 0' }}>
          <div style={{
            display: 'inline-block',
            width: '36px',
            height: '36px',
            borderBottom: '3px solid #FF7F50',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ marginTop: '8px', color: '#4B5563' }}>Loading orders...</p>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px', color: '#6B7280' }}>
          <FaClipboardList style={{ fontSize: '48px', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#111827' }}>No orders yet</h3>
          <p>Start shopping to see your orders here!</p>
          <button onClick={() => window.location.href = '/customer'} style={viewButtonStyle}>Start Shopping</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map(order => (
            <div
              key={order.id}
              style={orderCardStyle}
              onMouseEnter={e => Object.assign(e.currentTarget.style, orderCardHover)}
              onMouseLeave={e => Object.assign(e.currentTarget.style, { transform: 'translateY(0)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' })}
            >
              <div>
                <div style={orderNumberStyle}>
                  {order.orderNumber}
                  <span style={{ padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', ...getStatusStyle(order.status) }}>
                    {order.status}
                  </span>
                </div>
                <div style={orderDetailsStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FaCalendarAlt /> {new Date(order.date).toLocaleDateString()}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FaDollarSign /> ₹{order.total.toFixed(2)}</div>
                </div>
              </div>
              <button style={viewButtonStyle} onClick={() => handleViewOrder(order)}><FaEye /> View Details</button>
            </div>
          ))}
        </div>
      )}

      {showModal && selectedOrder && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={modalHeaderStyle}>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>Order Details</h2>
              <button onClick={closeModal} style={{ fontSize: '16px', color: '#9CA3AF', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={modalBodyStyle}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <p style={{ fontSize: '12px', color: '#6B7280' }}>Order Number</p>
                  <p style={{ fontWeight: '600' }}>{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#6B7280' }}>Date</p>
                  <p style={{ fontWeight: '600' }}>{new Date(selectedOrder.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#6B7280' }}>Status</p>
                  <span style={{ padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', ...getStatusStyle(selectedOrder.status) }}>{selectedOrder.status}</span>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#6B7280' }}>Total</p>
                  <p style={{ fontWeight: '600', fontSize: '16px' }}>${selectedOrder.total.toFixed(2)}</p>
                </div>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>Items</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedOrder.items.map((item, index) => (
                  <div key={index} style={itemRowStyle}>
                    <div>
                      <p style={{ fontWeight: '500' }}>{item.name}</p>
                      <p style={{ fontSize: '12px', color: '#6B7280' }}>Qty: {item.quantity}</p>
                    </div>
                    <p style={{ fontWeight: '600' }}>${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={modalFooterStyle}>
              <button onClick={closeModal} style={closeButtonStyle}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersSection;
