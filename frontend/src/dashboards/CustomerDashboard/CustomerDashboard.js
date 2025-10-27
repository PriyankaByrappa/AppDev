import React, { useState, useContext } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import CustomerSidebar from '../../components/CustomerSidebar';
import HomeSection from '../../components/dashboard/HomeSection';
import CartSection from '../../components/dashboard/CartSection';
import OrdersSection from '../../components/dashboard/OrdersSection';
import ProfileSection from '../../components/dashboard/ProfileSection';
import SettingsSection from '../../components/dashboard/SettingsSection';
const CustomerDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <CustomerSidebar 
        user={user} 
        onLogout={handleLogout}
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-800 ml-2 sm:ml-4">
                {location.pathname === '/customer' && 'Home'}
                {location.pathname === '/customer/cart' && 'Shopping Cart'}
                {location.pathname === '/customer/orders' && 'Order History'}
                {location.pathname === '/customer/profile' && 'Profile'}
                {location.pathname === '/customer/settings' && 'Settings'}
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">Welcome, {user?.name || 'Customer'}</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<HomeSection />} />
            <Route path="/cart" element={<CartSection />} />
            <Route path="/orders" element={<OrdersSection />} />
            <Route path="/profile" element={<ProfileSection />} />
            <Route path="/settings" element={<SettingsSection />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
