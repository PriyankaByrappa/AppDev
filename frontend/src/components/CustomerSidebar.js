import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaUser, 
  FaShoppingCart, 
  FaClipboardList, 
  FaCog, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes,
  FaHome
} from 'react-icons/fa';

const CustomerSidebar = ({ user, onLogout, isCollapsed, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'home', label: 'Home', icon: FaHome, path: '/customer' },
    { id: 'cart', label: 'Add to Cart', icon: FaShoppingCart, path: '/customer/cart' },
    { id: 'orders', label: 'Order Details', icon: FaClipboardList, path: '/customer/orders' },
    { id: 'profile', label: 'Profile', icon: FaUser, path: '/customer/profile' },
    { id: 'settings', label: 'Settings', icon: FaCog, path: '/customer/settings' }
  ];

  const handleMenuClick = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const sidebarStyle = {
    width: isCollapsed ? '64px' : '256px',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(to bottom, #FB923C, #EA580C)',
    color: 'white',
    transition: 'all 0.3s ease-in-out',
    boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderBottom: '1px solid rgba(255,255,255,0.3)'
  };

  const userInfoStyle = {
    padding: '16px',
    borderBottom: '1px solid rgba(255,255,255,0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const userAvatarStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FB923C'
  };

  const navStyle = { flex: 1, padding: '16px' };
  const navItemStyle = (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: '8px',
    width: '100%',
    backgroundColor: active ? 'white' : 'transparent',
    color: active ? '#EA580C' : 'white',
    boxShadow: active ? '0 2px 6px rgba(0,0,0,0.15)' : 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontWeight: 500,
    textAlign: 'left'
  });

  const logoutStyle = {
    padding: '16px',
    borderTop: '1px solid rgba(255,255,255,0.3)'
  };

  const logoutButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontWeight: 500
  };

  const toggleButtonStyle = {
    padding: '8px',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white'
  };

  return (
    <div style={sidebarStyle}>
      {/* Header */}
      <div style={headerStyle}>
        {!isCollapsed && <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Dashboard</h2>}
        <button onClick={onToggle} style={toggleButtonStyle}>
          {isCollapsed ? <FaBars size={20} /> : <FaTimes size={20} />}
        </button>
      </div>

      {/* User Info */}
      <div style={userInfoStyle}>
        <div style={userAvatarStyle}>
          <FaUser size={24} />
        </div>
        {!isCollapsed && (
          <div style={{ overflow: 'hidden' }}>
            <p style={{ margin: 0, fontWeight: 500, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.name || 'Customer'}
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.email || 'customer@example.com'}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav style={navStyle}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {menuItems.map(item => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <li key={item.id}>
                <div
                  onClick={() => handleMenuClick(item.path)}
                  style={navItemStyle(active)}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon size={20} />
                  {!isCollapsed && <span>{item.label}</span>}
                </div>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div style={logoutStyle}>
        <button onClick={handleLogout} style={logoutButtonStyle} title={isCollapsed ? 'Logout' : ''}>
          <FaSignOutAlt size={20} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default CustomerSidebar;
