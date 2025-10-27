import React, { useState, useEffect, useContext, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CookieCard from '../../components/CookieCard';
import { AuthContext } from '../../context/AuthContext';
import { FaBars, FaBell, FaSun, FaSignOutAlt, FaCookie, FaHome, FaUsers, FaClipboardList, FaMoon, FaDollarSign, FaBox } from 'react-icons/fa';

const AdminDashboard = () => {
  const { logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('cookies');
  const [cookies, setCookies] = useState([]);
  const [filteredCookies, setFilteredCookies] = useState([]);
  const [newCookie, setNewCookie] = useState({ name: '', flavor: '', imageUrl: '', price: '', quantityAvailable: 0 });
  const [editingCookie, setEditingCookie] = useState(null);
  const [viewCookie, setViewCookie] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [ordersCurrentPage, setOrdersCurrentPage] = useState(1);
  const [usersCurrentPage, setUsersCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [usersPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('adminTheme');
    return savedTheme || 'light';
  });
  
  // New state for admin features
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalCookies: 0,
    recentOrders: []
  });
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [userRoleFilter, setUserRoleFilter] = useState('all');

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const axiosConfig = useMemo(() => ({ headers: { Authorization: `Bearer ${token}` } }), [token]);
  
  // Ref to track if data has been fetched to prevent repeated calls
  const dataFetched = useRef(false);

  // Debug logging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('Current user:', user);
    console.log('User role:', user.role);
    console.log('Token exists:', !!token);
  }

  // Redirect if not admin
  useEffect(() => {
    if (!loading && user && !user.role?.includes('ADMIN')) {
      console.warn('Non-admin user trying to access admin dashboard. Redirecting...');
      navigate('/customer', { replace: true });
    }
  }, [user, loading, navigate]);

  // Reset dataFetched when user changes
  useEffect(() => {
    dataFetched.current = false;
  }, [user?.id]);

  const fetchCookies = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get('http://localhost:8080/api/cookies', axiosConfig);
      setCookies(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load cookies. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [axiosConfig]);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('Fetching orders with token:', token);
        console.log('Axios config:', axiosConfig);
      }
      const res = await axios.get('http://localhost:8080/api/orders', axiosConfig);
      const ordersData = res.data.map(order => ({
        id: order.orderId,
        customerName: order.customer?.name || 'Unknown Customer',
        customerEmail: order.customer?.email || '',
        items: order.orderItems?.map(item => ({
          name: item.product,
          quantity: item.quantity,
          price: item.price
        })) || [],
        total: order.totalAmount,
        status: order.status,
        date: order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'Unknown Date',
        orderDate: order.orderDate
      }));
      setOrders(ordersData);
      // Calculate analytics with current users and cookies
      setAnalytics(prev => {
        const totalRevenue = ordersData.reduce((sum, order) => sum + (order.total || 0), 0);
        const totalOrders = ordersData.length;
        const totalUsers = users.length;
        const totalCookies = cookies.length;
        
        return {
          totalRevenue: totalRevenue.toFixed(2),
          totalOrders,
          totalUsers,
          totalCookies,
          recentOrders: ordersData.slice(0, 5)
        };
      });
    } catch (err) {
      console.error('Failed to load orders:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      setOrders([]);
      showNotification('Failed to load orders. Please check your connection.', 'error');
    }
  }, [axiosConfig, token, users.length, cookies.length]);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('Fetching users with token:', token);
      }
      const res = await axios.get('http://localhost:8080/api/customers', axiosConfig);
      const usersData = res.data.map(customer => ({
        id: customer.customerId,
        name: customer.name,
        email: customer.email,
        role: customer.role || 'CUSTOMER',
        joinedDate: customer.customerId ? '2024-01-01' : 'Unknown', // Backend doesn't have join date
        ordersCount: customer.orders?.length || 0,
        phoneNumber: customer.phonenumber,
        address: customer.address
      }));
      setUsers(usersData);
    } catch (err) {
      console.error('Failed to load users:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      setUsers([]);
      showNotification('Failed to load users. Please check your connection.', 'error');
    }
  }, [axiosConfig, token]);


  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      const updatedOrder = {
        ...order,
        status: newStatus
      };

      await axios.put(`http://localhost:8080/api/orders/${orderId}`, updatedOrder, axiosConfig);
      
      // Update local state
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      showNotification(`Order #${orderId} status updated to ${newStatus}`, 'success');
    } catch (err) {
      console.error('Failed to update order status:', err);
      showNotification('Failed to update order status', 'error');
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await axios.delete(`http://localhost:8080/api/customers/${userId}`, axiosConfig);
      setUsers(prev => prev.filter(u => u.id !== userId));
      showNotification('User deleted successfully', 'success');
    } catch (err) {
      console.error('Failed to delete user:', err);
      showNotification('Failed to delete user', 'error');
    }
  };

  // Update user role
  const updateUserRole = async (userId, newRole) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      const updatedUser = {
        ...user,
        role: newRole
      };

      await axios.put(`http://localhost:8080/api/customers/${userId}`, updatedUser, axiosConfig);
      
      // Update local state
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      showNotification(`User role updated to ${newRole}`, 'success');
    } catch (err) {
      console.error('Failed to update user role:', err);
      showNotification('Failed to update user role', 'error');
    }
  };


  const handleEditCookie = (cookie) => {
    setEditingCookie(cookie);
    setNewCookie({ 
      name: cookie.name, 
      flavor: cookie.flavor, 
      imageUrl: cookie.imageUrl, 
      price: cookie.price, 
      quantityAvailable: cookie.quantityAvailable || 0 
    });
  };

  const handleCancelEdit = () => {
      setEditingCookie(null);
    setNewCookie({ name: '', flavor: '', imageUrl: '', price: '', quantityAvailable: 0 });
  };





  const handleFilterSort = useCallback(() => {
    let temp = [...cookies];
    if (searchTerm) {
      temp = temp.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.flavor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (sortKey) {
      temp.sort((a, b) =>
        sortOrder === 'asc' ? (a[sortKey] > b[sortKey] ? 1 : -1) : (a[sortKey] < b[sortKey] ? 1 : -1)
      );
    }
    setFilteredCookies(temp);
    setCurrentPage(1);
  }, [cookies, searchTerm, sortKey, sortOrder]);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentCookies = filteredCookies.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCookies.length / itemsPerPage);
  
  // Pagination logic for orders
  const filteredOrders = orders.filter(order => orderStatusFilter === 'all' || order.status === orderStatusFilter);
  const ordersIndexOfLast = ordersCurrentPage * ordersPerPage;
  const ordersIndexOfFirst = ordersIndexOfLast - ordersPerPage;
  const currentOrders = filteredOrders.slice(ordersIndexOfFirst, ordersIndexOfLast);
  const ordersTotalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  
  // Pagination logic for users
  const filteredUsers = users.filter(user => userRoleFilter === 'all' || user.role === userRoleFilter);
  const usersIndexOfLast = usersCurrentPage * usersPerPage;
  const usersIndexOfFirst = usersIndexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(usersIndexOfFirst, usersIndexOfLast);
  const usersTotalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const sidebarStyle = {
    width: sidebarOpen ? '220px' : (window.innerWidth > 768 ? '60px' : '0'),
    backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
    borderRight: `1px solid ${theme === 'dark' ? '#374151' : '#eee'}`,
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s',
    zIndex: 900,
    overflow: 'hidden',
    transform: window.innerWidth <= 768 && !sidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
  };

  const mainStyle = {
    marginLeft: sidebarOpen ? (window.innerWidth > 768 ? '220px' : '0') : (window.innerWidth > 768 ? '60px' : '0'),
    padding: '16px',
    marginTop: '70px',
    transition: 'margin-left 0.3s',
    fontFamily: 'Arial, sans-serif',
    minHeight: 'calc(100vh - 70px)',
    backgroundColor: theme === 'dark' ? '#111827' : '#f8fafc',
    color: theme === 'dark' ? '#f9fafb' : '#111827',
  };

  const navbarStyle = {
    position: 'fixed',
    top: 0,
    left: sidebarOpen ? '220px' : '60px',
    right: 0,
    height: '70px',
    background: theme === 'dark' 
      ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' 
      : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    borderBottom: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 24px',
    transition: 'left 0.3s ease',
    zIndex: 1000,
    boxShadow: theme === 'dark' 
      ? '0 4px 20px rgba(0,0,0,0.3)' 
      : '0 4px 20px rgba(0,0,0,0.08)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)'
  };

  const menuItemStyle = (active) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    cursor: 'pointer',
    backgroundColor: active ? (theme === 'dark' ? '#374151' : '#f5f5f5') : 'transparent',
    color: active ? (theme === 'dark' ? '#f9fafb' : '#111827') : (theme === 'dark' ? '#9ca3af' : '#6b7280'),
    marginBottom: '5px',
    fontWeight: active ? 'bold' : 'normal',
    transition: 'background 0.2s',
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddCookie = async () => {
    if (!newCookie.name || !newCookie.flavor || !newCookie.price || newCookie.quantityAvailable === '') {
      showNotification('Please fill in all required fields (Name, Flavor, Price, Quantity)', 'error');
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:8080/api/cookies', newCookie, axiosConfig);
      setCookies(prev => [...prev, res.data]);
      setNewCookie({ name: '', flavor: '', imageUrl: '', price: '', quantityAvailable: 0 });
      showNotification('Cookie added successfully!', 'success');
    } catch (err) { 
      console.error(err);
      showNotification('Failed to add cookie. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCookie = async () => {
    if (!editingCookie) return;
    if (!newCookie.name || !newCookie.flavor || !newCookie.price || newCookie.quantityAvailable === '') {
      showNotification('Please fill in all required fields', 'error');
      return;
    }
    setIsLoading(true);
    try {
      await axios.put(`http://localhost:8080/api/cookies/${editingCookie.id}`, newCookie, axiosConfig);
      await fetchCookies();
      setEditingCookie(null);
      setNewCookie({ name: '', flavor: '', imageUrl: '', price: '' });
      showNotification('Cookie updated successfully!', 'success');
    } catch (err) { 
      console.error(err);
      showNotification('Failed to update cookie. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCookie = async (id) => {
    if (!window.confirm('Are you sure you want to delete this cookie?')) return;
    setIsLoading(true);
    try {
      await axios.delete(`http://localhost:8080/api/cookies/${id}`, axiosConfig);
      setCookies(prev => prev.filter(c => c.id !== id));
      showNotification('Cookie deleted successfully!', 'success');
    } catch (err) { 
      console.error(err);
      showNotification('Failed to delete cookie. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('adminTheme', newTheme);
      return newTheme;
    });
  };

  // useEffect calls
  useEffect(() => { fetchCookies(); }, [fetchCookies]);
  useEffect(() => { handleFilterSort(); }, [handleFilterSort]);
  
  // Only fetch orders and users once when component mounts and user is admin
  useEffect(() => { 
    if (user && (user.role === 'ROLE_ADMIN' || user.role === 'ROLE_ROLE_ADMIN' || user.role?.includes('ADMIN'))) {
      if (!dataFetched.current) {
        dataFetched.current = true;
        if (process.env.NODE_ENV === 'development') {
          console.log('Fetching admin data for role:', user.role);
        }
        fetchOrders(); 
        fetchUsers(); 
      }
    } else if (user && !user.role?.includes('ADMIN')) {
      console.warn('User does not have ADMIN role. Current role:', user.role);
      showNotification('Access denied. Admin role required.', 'error');
    }
  }, [user, fetchOrders, fetchUsers]); // Include all dependencies

  // Update analytics when users or cookies change
  useEffect(() => {
    setAnalytics(prev => ({
      ...prev,
      totalUsers: users.length,
      totalCookies: cookies.length
    }));
  }, [users.length, cookies.length]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div>
      {/* Notification Toast */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          padding: '15px 20px',
          backgroundColor: notification.type === 'success' ? '#28a745' : '#dc3545',
          color: '#fff',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          animation: 'slideIn 0.3s ease-out',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          minWidth: '250px'
        }}>
          <div style={{ fontSize: '20px' }}>
            {notification.type === 'success' ? '✓' : '⚠️'}
          </div>
          <div>{notification.message}</div>
        </div>
      )}
      {/* Sidebar */}
      <div style={sidebarStyle}>
        {/* Logo Section - Fixed at top */}
        <div style={{ 
          padding: '20px', 
          borderBottom: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
          marginBottom: '10px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
          zIndex: 10
        }}>
          {sidebarOpen ? (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              justifyContent: 'center'
            }}>
              
              <h3 style={{ 
                margin: 0, 
                fontSize: '18px', 
                fontWeight: 'bold',
                color: theme === 'dark' ? '#f9fafb' : '#111827'
              }}>
                Admin
              </h3>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <FaCookie style={{ fontSize: '28px', color: theme === 'dark' ? '#fbbf24' : '#f59e0b' }} />
            </div>
          )}
        </div>

        {/* Menu Items - Scrollable */}
        <div style={{ flex: 1, padding: '10px 0', overflowY: 'auto' }}>
          <div 
            style={menuItemStyle(activeMenu === 'home')} 
            onClick={() => setActiveMenu('home')}
            onMouseEnter={e => {
              if (activeMenu !== 'home') {
                e.currentTarget.style.backgroundColor = theme === 'dark' ? '#374151' : '#f3f4f6';
              }
            }}
            onMouseLeave={e => {
              if (activeMenu !== 'home') {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <FaHome style={{ marginRight: sidebarOpen ? '10px' : '0', fontSize: '18px' }} />
            {sidebarOpen && <span>Dashboard</span>}
          </div>
          <div 
            style={menuItemStyle(activeMenu === 'cookies')} 
            onClick={() => setActiveMenu('cookies')}
            onMouseEnter={e => {
              if (activeMenu !== 'cookies') {
                e.currentTarget.style.backgroundColor = theme === 'dark' ? '#374151' : '#f3f4f6';
              }
            }}
            onMouseLeave={e => {
              if (activeMenu !== 'cookies') {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <FaCookie style={{ marginRight: sidebarOpen ? '10px' : '0', fontSize: '18px' }} />
            {sidebarOpen && <span>Cookies</span>}
          </div>
          <div 
            style={menuItemStyle(activeMenu === 'users')} 
            onClick={() => setActiveMenu('users')}
            onMouseEnter={e => {
              if (activeMenu !== 'users') {
                e.currentTarget.style.backgroundColor = theme === 'dark' ? '#374151' : '#f3f4f6';
              }
            }}
            onMouseLeave={e => {
              if (activeMenu !== 'users') {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <FaUsers style={{ marginRight: sidebarOpen ? '10px' : '0', fontSize: '18px' }} />
            {sidebarOpen && <span>Users</span>}
          </div>
          <div 
            style={menuItemStyle(activeMenu === 'orders')} 
            onClick={() => setActiveMenu('orders')}
            onMouseEnter={e => {
              if (activeMenu !== 'orders') {
                e.currentTarget.style.backgroundColor = theme === 'dark' ? '#374151' : '#f3f4f6';
              }
            }}
            onMouseLeave={e => {
              if (activeMenu !== 'orders') {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <FaClipboardList style={{ marginRight: sidebarOpen ? '10px' : '0', fontSize: '18px' }} />
            {sidebarOpen && <span>Orders</span>}
          </div>
        </div>
        
        {/* Bottom Section - Fixed at bottom */}
        <div style={{ 
          padding: '10px', 
          borderTop: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
          backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
          marginTop: 'auto' // Push to bottom
        }}>
          {/* Theme Toggle */}
          <div 
            onClick={toggleTheme}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              cursor: 'pointer',
              backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
              borderRadius: '8px',
              marginBottom: '10px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = theme === 'dark' ? '#4b5563' : '#e5e7eb';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = theme === 'dark' ? '#374151' : '#f3f4f6';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {theme === 'dark' ? (
              <>
                <FaSun style={{ marginRight: sidebarOpen ? '10px' : '0', fontSize: '16px', color: '#fbbf24' }} />
                {sidebarOpen && <span style={{ fontSize: '14px' }}>Light Mode</span>}
              </>
            ) : (
              <>
                <FaMoon style={{ marginRight: sidebarOpen ? '10px' : '0', fontSize: '16px', color: theme === 'dark' ? '#9ca3af' : '#6b7280' }} />
                {sidebarOpen && <span style={{ fontSize: '14px' }}>Dark Mode</span>}
              </>
            )}
          </div>

          {/* Logout Button */}
          <div 
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              cursor: 'pointer',
              backgroundColor: '#dc2626',
              color: '#fff',
              borderRadius: '8px',
              transition: 'all 0.2s',
              fontWeight: '500',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#b91c1c';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#dc2626';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <FaSignOutAlt style={{ marginRight: sidebarOpen ? '10px' : '0', fontSize: '16px' }} />
            {sidebarOpen && <span>Logout</span>}
          </div>
        </div>

        {/* Toggle Sidebar Button */}
        <div 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            position: 'absolute',
            top: '50%',
            right: '-15px',
            width: '30px',
            height: '30px',
            backgroundColor: theme === 'dark' ? '#374151' : '#fff',
            border: `2px solid ${theme === 'dark' ? '#4b5563' : '#e5e7eb'}`,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = theme === 'dark' ? '#4b5563' : '#f3f4f6';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = theme === 'dark' ? '#374151' : '#fff';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <FaBars style={{ fontSize: '14px', color: theme === 'dark' ? '#9ca3af' : '#6b7280' }} />
        </div>
      </div>

      {/* Enhanced Navbar */}
      <div className="navbar-enhanced" style={{...navbarStyle, left: sidebarOpen ? (window.innerWidth > 768 ? '220px' : '0') : (window.innerWidth > 768 ? '60px' : '0')}}>
        {/* Left Section - Brand & Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {window.innerWidth <= 768 && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme === 'dark' ? '#f9fafb' : '#111827'
              }}
            >
              <FaBars style={{ fontSize: '18px' }} />
            </button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ff8c42 0%, #ff6b35 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(255, 140, 66, 0.3)'
            }}>
              🍪
            </div>
            <div style={{ display: window.innerWidth > 640 ? 'block' : 'none' }}>
              <h2 style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                margin: 0,
                fontWeight: '700',
                fontSize: '20px',
                letterSpacing: '-0.5px'
              }}>
                Cookie Store Admin
              </h2>
              <div style={{ 
                fontSize: '12px', 
                color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                fontWeight: '500',
                marginTop: '-2px'
              }}>
                Management Dashboard
              </div>
            </div>
          </div>
          
          {/* Breadcrumb */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            padding: '6px 12px',
            borderRadius: '8px',
            backgroundColor: theme === 'dark' ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.8)',
            fontSize: '14px',
            fontWeight: '500',
            color: theme === 'dark' ? '#d1d5db' : '#6b7280'
          }}>
            <span>🏠</span>
            <span>{activeMenu === 'home' ? 'Dashboard' : 
                   activeMenu === 'cookies' ? 'Cookie Inventory' :
                   activeMenu === 'orders' ? 'Order Management' :
                   activeMenu === 'users' ? 'User Management' : 'Dashboard'}</span>
          </div>
        </div>
        {/* Right Section - Actions & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>


          {/* Notifications */}
          <div style={{ position: 'relative' }}>
            <div style={{
              padding: '8px',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={e => { 
              e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.8)'; 
            }}
            onMouseLeave={e => { 
              e.currentTarget.style.backgroundColor = 'transparent'; 
            }}
            >
              <FaBell style={{ 
                fontSize: '18px', 
                color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                transition: 'color 0.2s ease'
              }} />
            </div>
            <span className="notification-badge" style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              backgroundColor: '#ef4444',
              color: '#fff',
              borderRadius: '50%',
              width: '16px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: '600',
              boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)'
            }}></span>
          </div>

          {/* Profile Section */}
          <div className="profile-section" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            cursor: 'pointer',
            padding: '8px 16px',
            borderRadius: '12px',
            transition: 'all 0.2s ease',
            backgroundColor: 'transparent',
            border: `1px solid ${theme === 'dark' ? 'rgba(55, 65, 81, 0.5)' : 'rgba(229, 231, 235, 0.5)'}`
          }}
          onMouseEnter={e => { 
            e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(55, 65, 81, 0.3)' : 'rgba(243, 244, 246, 0.5)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => { 
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: '700',
              fontSize: '16px',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
            }}>
              A
            </div>
            <div>
              <div style={{ 
                fontWeight: '600', 
                fontSize: '14px', 
                color: theme === 'dark' ? '#f9fafb' : '#111827',
                lineHeight: '1.2'
              }}>
                {user?.name || 'Admin'}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                fontWeight: '500'
              }}>
                Administrator
              </div>
            </div>
            <div className="profile-arrow" style={{
              color: theme === 'dark' ? '#9ca3af' : '#6b7280',
              fontSize: '12px',
              transition: 'transform 0.2s ease'
            }}>
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={mainStyle}>
        {activeMenu === 'home' && (
          <>
            <h2 style={{ color: theme === 'dark' ? '#f9fafb' : '#333', marginBottom: '20px' }}>📊 Dashboard Overview</h2>
            
            {/* Analytics Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ margin: '0', color: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: '14px' }}>Total Revenue</p>
                    <h3 style={{ margin: '5px 0 0 0', color: theme === 'dark' ? '#f9fafb' : '#111827', fontSize: '28px' }}>₹{analytics.totalRevenue}</h3>
                  </div>
                  <div style={{ width: '50px', height: '50px', borderRadius: '10px', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaDollarSign style={{ fontSize: '24px', color: '#2563eb' }} />
                  </div>
                </div>
              </div>
              
              <div style={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ margin: '0', color: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: '14px' }}>Total Orders</p>
                    <h3 style={{ margin: '5px 0 0 0', color: theme === 'dark' ? '#f9fafb' : '#111827', fontSize: '28px' }}>{analytics.totalOrders}</h3>
                  </div>
                  <div style={{ width: '50px', height: '50px', borderRadius: '10px', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaClipboardList style={{ fontSize: '24px', color: '#16a34a' }} />
                  </div>
                </div>
              </div>
              
              <div style={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ margin: '0', color: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: '14px' }}>Total Users</p>
                    <h3 style={{ margin: '5px 0 0 0', color: theme === 'dark' ? '#f9fafb' : '#111827', fontSize: '28px' }}>{analytics.totalUsers}</h3>
                  </div>
                  <div style={{ width: '50px', height: '50px', borderRadius: '10px', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaUsers style={{ fontSize: '24px', color: '#d97706' }} />
                  </div>
                </div>
              </div>
              
              <div style={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ margin: '0', color: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: '14px' }}>Total Products</p>
                    <h3 style={{ margin: '5px 0 0 0', color: theme === 'dark' ? '#f9fafb' : '#111827', fontSize: '28px' }}>{cookies.length}</h3>
                  </div>
                  <div style={{ width: '50px', height: '50px', borderRadius: '10px', backgroundColor: '#fce7f3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaBox style={{ fontSize: '24px', color: '#db2777' }} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Orders */}
            <div style={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h3 style={{ marginTop: '0', marginBottom: '20px', color: '#111827' }}>Recent Orders</h3>
              {orders.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} style={{ 
                      padding: '16px', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <p style={{ margin: '0', fontWeight: '600', color: '#111827' }}>{order.customerName}</p>
                        <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
                          {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: '0', fontWeight: '600', color: '#111827' }}>₹{order.total}</p>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          fontSize: '12px',
                          backgroundColor: order.status === 'DELIVERED' ? '#dcfce7' : 
                                         order.status === 'PENDING' ? '#fef3c7' : 
                                         order.status === 'CONFIRMED' ? '#dbeafe' : 
                                         order.status === 'PROCESSED' ? '#e0e7ff' : 
                                         order.status === 'CANCELLED' ? '#fecaca' : '#f3f4f6',
                          color: order.status === 'DELIVERED' ? '#16a34a' : 
                                order.status === 'PENDING' ? '#d97706' : 
                                order.status === 'CONFIRMED' ? '#2563eb' : 
                                order.status === 'PROCESSED' ? '#7c3aed' : 
                                order.status === 'CANCELLED' ? '#dc2626' : '#6b7280'
                        }}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px 20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #e9ecef'
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '15px' }}>📦</div>
                  <h3 style={{ color: '#6c757d', marginBottom: '10px' }}>No Recent Orders</h3>
                  <p style={{ color: '#6c757d' }}>Recent orders will appear here when customers place them.</p>
                </div>
              )}
            </div>
          </>
        )}
        
        {activeMenu === 'orders' && (
          <>
            <h2 style={{ color: theme === 'dark' ? '#f9fafb' : '#333', marginBottom: '20px' }}>📋 Orders Management</h2>
            
            <div style={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: '0', color: theme === 'dark' ? '#f9fafb' : '#111827' }}>All Orders</h3>
                <select 
                  value={orderStatusFilter} 
                  onChange={e => setOrderStatusFilter(e.target.value)}
                  style={{ 
                    padding: '8px 12px', 
                    borderRadius: '6px', 
                    border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
                    backgroundColor: theme === 'dark' ? '#374151' : '#fff',
                    color: theme === 'dark' ? '#f9fafb' : '#111827'
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PROCESSED">Processed</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              
              {orders.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '60px 20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #e9ecef'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>📦</div>
                  <h3 style={{ color: '#6c757d', marginBottom: '10px' }}>No Orders Found</h3>
                  <p style={{ color: '#6c757d', marginBottom: '20px' }}>Orders will appear here when customers place them.</p>
                  <button 
                    onClick={fetchOrders}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '6px',
                      backgroundColor: '#007bff',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    🔄 Refresh Orders
                  </button>
                </div>
              ) : currentOrders.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {currentOrders.map(order => (
                    <div key={order.id} style={{ 
                      padding: '20px', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      transition: 'all 0.2s'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                        <div>
                          <p style={{ margin: '0 0 4px 0', fontWeight: '600', color: '#111827' }}>Order #{order.id}</p>
                          <p style={{ margin: '0', color: '#6b7280', fontSize: '14px' }}>Customer: {order.customerName}</p>
                          <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>Date: {order.date}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ margin: '0 0 8px 0', fontWeight: '600', fontSize: '18px', color: '#111827' }}>₹{order.total}</p>
                          <span style={{ 
                            padding: '6px 12px', 
                            borderRadius: '6px', 
                            fontSize: '13px',
                            backgroundColor: order.status === 'DELIVERED' ? '#dcfce7' : 
                                           order.status === 'PENDING' ? '#fef3c7' : 
                                           order.status === 'CONFIRMED' ? '#dbeafe' : 
                                           order.status === 'PROCESSED' ? '#e0e7ff' : 
                                           order.status === 'CANCELLED' ? '#fecaca' : '#f3f4f6',
                            color: order.status === 'DELIVERED' ? '#16a34a' : 
                                  order.status === 'PENDING' ? '#d97706' : 
                                  order.status === 'CONFIRMED' ? '#2563eb' : 
                                  order.status === 'PROCESSED' ? '#7c3aed' : 
                                  order.status === 'CANCELLED' ? '#dc2626' : '#6b7280'
                          }}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      
                      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px' }}>
                        {order.items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ color: '#6b7280', fontSize: '14px' }}>{item.quantity}x {item.name}</span>
                            <span style={{ color: '#111827', fontWeight: '600', fontSize: '14px' }}>₹{(item.quantity * item.price).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button style={{ 
                          padding: '6px 12px', 
                          borderRadius: '6px', 
                          border: '1px solid #d1d5db', 
                          backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
                          cursor: 'pointer',
                          fontSize: '13px'
                        }}>
                          View Details
                        </button>
                        {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                          <select 
                            value={order.status}
                            onChange={e => updateOrderStatus(order.id, e.target.value)}
                            style={{ 
                              padding: '6px 12px', 
                              borderRadius: '6px', 
                              border: '1px solid #d1d5db',
                              backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
                              cursor: 'pointer',
                              fontSize: '13px'
                            }}
                          >
                            <option value="PENDING">Mark as Pending</option>
                            <option value="CONFIRMED">Mark as Confirmed</option>
                            <option value="PROCESSED">Mark as Processed</option>
                            <option value="DELIVERED">Mark as Delivered</option>
                            <option value="CANCELLED">Cancel Order</option>
                          </select>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px 20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #e9ecef'
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '15px' }}>🔍</div>
                  <h3 style={{ color: '#6c757d', marginBottom: '10px' }}>No Orders Match Filter</h3>
                  <p style={{ color: '#6c757d' }}>Try changing the status filter to see more orders.</p>
                </div>
              )}
              
              {/* Orders Pagination */}
              {currentOrders.length > 0 && ordersTotalPages > 1 && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  gap: '8px', 
                  marginTop: '20px',
                  padding: '16px 0'
                }}>
                  <button
                    onClick={() => setOrdersCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={ordersCurrentPage === 1}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #d1d5db',
                      backgroundColor: ordersCurrentPage === 1 ? '#e9ecef' : '#fff',
                      color: ordersCurrentPage === 1 ? '#adb5bd' : '#000',
                      cursor: ordersCurrentPage === 1 ? 'not-allowed' : 'pointer',
                      opacity: ordersCurrentPage === 1 ? 0.6 : 1
                    }}
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, ordersTotalPages) }, (_, i) => {
                    let pageNum;
                    if (ordersTotalPages <= 5) {
                      pageNum = i + 1;
                    } else if (ordersCurrentPage <= 3) {
                      pageNum = i + 1;
                    } else if (ordersCurrentPage >= ordersTotalPages - 2) {
                      pageNum = ordersTotalPages - 4 + i;
                    } else {
                      pageNum = ordersCurrentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setOrdersCurrentPage(pageNum)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid #d1d5db',
                          backgroundColor: ordersCurrentPage === pageNum ? '#0d6efd' : '#fff',
                          color: ordersCurrentPage === pageNum ? '#fff' : '#000',
                          cursor: 'pointer'
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setOrdersCurrentPage(prev => Math.min(prev + 1, ordersTotalPages))}
                    disabled={ordersCurrentPage === ordersTotalPages}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #d1d5db',
                      backgroundColor: ordersCurrentPage === ordersTotalPages ? '#e9ecef' : '#fff',
                      color: ordersCurrentPage === ordersTotalPages ? '#adb5bd' : '#000',
                      cursor: ordersCurrentPage === ordersTotalPages ? 'not-allowed' : 'pointer',
                      opacity: ordersCurrentPage === ordersTotalPages ? 0.6 : 1
                    }}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </>
        )}
        
        {activeMenu === 'users' && (
          <>
            <h2 style={{ color: theme === 'dark' ? '#f9fafb' : '#333', marginBottom: '20px' }}>👥 Users Management</h2>
            
            <div style={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: '0', color: theme === 'dark' ? '#f9fafb' : '#111827' }}>All Users</h3>
                <select 
                  value={userRoleFilter} 
                  onChange={e => setUserRoleFilter(e.target.value)}
                  style={{ 
                    padding: '8px 12px', 
                    borderRadius: '6px', 
                    border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
                    backgroundColor: theme === 'dark' ? '#374151' : '#fff',
                    color: theme === 'dark' ? '#f9fafb' : '#111827'
                  }}
                >
                  <option value="all">All Roles</option>
                  <option value="CUSTOMER">Customers</option>
                  <option value="ADMIN">Admins</option>
                </select>
              </div>
              
              {users.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '60px 20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #e9ecef'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>👥</div>
                  <h3 style={{ color: '#6c757d', marginBottom: '10px' }}>No Users Found</h3>
                  <p style={{ color: '#6c757d', marginBottom: '20px' }}>Users will appear here when they register.</p>
                  <button 
                    onClick={fetchUsers}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '6px',
                      backgroundColor: '#007bff',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    🔄 Refresh Users
                  </button>
                </div>
              ) : currentUsers.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {currentUsers.map(user => (
                    <div key={user.id} style={{ 
                      padding: '20px', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ 
                          width: '48px', 
                          height: '48px', 
                          borderRadius: '50%', 
                          backgroundColor: '#e5e7eb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                          fontWeight: '600'
                        }}>
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p style={{ margin: '0', fontWeight: '600', color: '#111827' }}>{user.name}</p>
                          <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '14px' }}>{user.email}</p>
                          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#6b7280' }}>
                            Joined: {user.joinedDate} • Orders: {user.ordersCount}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ 
                          padding: '4px 12px', 
                          borderRadius: '6px', 
                          fontSize: '13px',
                          backgroundColor: user.role === 'ADMIN' ? '#fef3c7' : '#dbeafe',
                          color: user.role === 'ADMIN' ? '#d97706' : '#2563eb'
                        }}>
                          {user.role}
                        </span>
                        {user.role === 'CUSTOMER' && (
                          <select 
                            value={user.role}
                            onChange={e => updateUserRole(user.id, e.target.value)}
                            style={{ 
                              padding: '4px 8px', 
                              borderRadius: '4px', 
                              border: '1px solid #d1d5db',
                              backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            <option value="CUSTOMER">Customer</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        )}
                        <button 
                          onClick={() => deleteUser(user.id)}
                          style={{ 
                            padding: '6px 12px', 
                            borderRadius: '6px', 
                            border: '1px solid #dc2626', 
                            backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
                            color: '#dc2626',
                            cursor: 'pointer',
                            fontSize: '13px'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px 20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #e9ecef'
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '15px' }}>🔍</div>
                  <h3 style={{ color: '#6c757d', marginBottom: '10px' }}>No Users Match Filter</h3>
                  <p style={{ color: '#6c757d' }}>Try changing the role filter to see more users.</p>
                </div>
              )}
              
              {/* Users Pagination */}
              {currentUsers.length > 0 && usersTotalPages > 1 && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  gap: '8px', 
                  marginTop: '20px',
                  padding: '16px 0'
                }}>
                  <button
                    onClick={() => setUsersCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={usersCurrentPage === 1}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #d1d5db',
                      backgroundColor: usersCurrentPage === 1 ? '#e9ecef' : '#fff',
                      color: usersCurrentPage === 1 ? '#adb5bd' : '#000',
                      cursor: usersCurrentPage === 1 ? 'not-allowed' : 'pointer',
                      opacity: usersCurrentPage === 1 ? 0.6 : 1
                    }}
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, usersTotalPages) }, (_, i) => {
                    let pageNum;
                    if (usersTotalPages <= 5) {
                      pageNum = i + 1;
                    } else if (usersCurrentPage <= 3) {
                      pageNum = i + 1;
                    } else if (usersCurrentPage >= usersTotalPages - 2) {
                      pageNum = usersTotalPages - 4 + i;
                    } else {
                      pageNum = usersCurrentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setUsersCurrentPage(pageNum)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid #d1d5db',
                          backgroundColor: usersCurrentPage === pageNum ? '#0d6efd' : '#fff',
                          color: usersCurrentPage === pageNum ? '#fff' : '#000',
                          cursor: 'pointer'
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setUsersCurrentPage(prev => Math.min(prev + 1, usersTotalPages))}
                    disabled={usersCurrentPage === usersTotalPages}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #d1d5db',
                      backgroundColor: usersCurrentPage === usersTotalPages ? '#e9ecef' : '#fff',
                      color: usersCurrentPage === usersTotalPages ? '#adb5bd' : '#000',
                      cursor: usersCurrentPage === usersTotalPages ? 'not-allowed' : 'pointer',
                      opacity: usersCurrentPage === usersTotalPages ? 0.6 : 1
                    }}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </>
        )}
        
        {activeMenu === 'cookies' && (
          <>
        <h2 style={{ color: theme === 'dark' ? '#f9fafb' : '#333', marginBottom: '15px' }}>Cookie Inventory</h2>

        {/* Search & Sort */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
          <input
            placeholder="Search by name or flavor"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ 
              padding: '10px', 
              borderRadius: '8px', 
              border: `1px solid ${theme === 'dark' ? '#4b5563' : '#ccc'}`, 
              flex: 1,
              backgroundColor: theme === 'dark' ? '#374151' : '#fff',
              color: theme === 'dark' ? '#f9fafb' : '#111827'
            }}
            className={theme === 'dark' ? 'dark-input' : ''}
          />
          <select value={sortKey} onChange={e => setSortKey(e.target.value)} style={{ 
            padding: '10px', 
            borderRadius: '8px', 
            border: `1px solid ${theme === 'dark' ? '#4b5563' : '#ccc'}`,
            backgroundColor: theme === 'dark' ? '#374151' : '#fff',
            color: theme === 'dark' ? '#f9fafb' : '#111827'
          }}>
            <option value="">Sort By</option>
            <option value="name">Name</option>
            <option value="flavor">Flavor</option>
            <option value="price">Price</option>
          </select>
          <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} style={{ 
            padding: '10px', 
            borderRadius: '8px', 
            border: `1px solid ${theme === 'dark' ? '#4b5563' : '#ccc'}`,
            backgroundColor: theme === 'dark' ? '#374151' : '#fff',
            color: theme === 'dark' ? '#f9fafb' : '#111827'
          }}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

                 {/* Add / Edit Cookie Form */}
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#495057' }}>
            {editingCookie ? '✏️ Edit Cookie' : '➕ Add New Cookie'}
          </h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
            <input 
              placeholder="Name *" 
              value={newCookie.name} 
              onChange={e => setNewCookie({ ...newCookie, name: e.target.value })} 
              style={{ 
                padding: '10px', 
                borderRadius: '8px', 
                border: `1px solid ${theme === 'dark' ? '#4b5563' : '#ccc'}`, 
                flex: 1, 
                minWidth: '150px',
                backgroundColor: theme === 'dark' ? '#374151' : '#fff',
                color: theme === 'dark' ? '#f9fafb' : '#111827'
              }} 
            />
            <input 
              placeholder="Flavor *" 
              value={newCookie.flavor} 
              onChange={e => setNewCookie({ ...newCookie, flavor: e.target.value })} 
              style={{ 
                padding: '10px', 
                borderRadius: '8px', 
                border: `1px solid ${theme === 'dark' ? '#4b5563' : '#ccc'}`, 
                flex: 1, 
                minWidth: '150px',
                backgroundColor: theme === 'dark' ? '#374151' : '#fff',
                color: theme === 'dark' ? '#f9fafb' : '#111827'
              }} 
            />
            <input 
              placeholder="Price *" 
              type="number" 
              step="0.01"
              value={newCookie.price} 
              onChange={e => setNewCookie({ ...newCookie, price: e.target.value })} 
              style={{ 
                padding: '10px', 
                borderRadius: '8px', 
                border: `1px solid ${theme === 'dark' ? '#4b5563' : '#ccc'}`, 
                width: '120px',
                backgroundColor: theme === 'dark' ? '#374151' : '#fff',
                color: theme === 'dark' ? '#f9fafb' : '#111827'
              }} 
            />
            <input 
              placeholder="Quantity *" 
              type="number" 
              min="0"
              value={newCookie.quantityAvailable} 
              onChange={e => setNewCookie({ ...newCookie, quantityAvailable: parseInt(e.target.value) || 0 })} 
              style={{ 
                padding: '10px', 
                borderRadius: '8px', 
                border: `1px solid ${theme === 'dark' ? '#4b5563' : '#ccc'}`, 
                width: '120px',
                backgroundColor: theme === 'dark' ? '#374151' : '#fff',
                color: theme === 'dark' ? '#f9fafb' : '#111827'
              }} 
            />
          </div>
          <input 
            placeholder="Image URL (optional)" 
            value={newCookie.imageUrl} 
            onChange={e => setNewCookie({ ...newCookie, imageUrl: e.target.value })} 
            style={{ 
              padding: '10px', 
              borderRadius: '8px', 
              border: `1px solid ${theme === 'dark' ? '#4b5563' : '#ccc'}`, 
              width: '100%', 
              marginBottom: '10px',
              backgroundColor: theme === 'dark' ? '#374151' : '#fff',
              color: theme === 'dark' ? '#f9fafb' : '#111827'
            }} 
          />
          <div style={{ display: 'flex', gap: '10px' }}>
          {editingCookie ? (
              <>
                <button 
                  onClick={handleUpdateCookie} 
                  style={{ 
                    padding: '10px 20px', 
                    borderRadius: '8px', 
                    backgroundColor: '#0d6efd', 
                    color: '#fff', 
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  ✓ Update Cookie
                </button>
                <button 
                  onClick={handleCancelEdit} 
                  style={{ 
                    padding: '10px 20px', 
                    borderRadius: '8px', 
                    backgroundColor: '#6c757d', 
                    color: '#fff', 
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  ✕ Cancel
                </button>
              </>
            ) : (
              <button 
                onClick={handleAddCookie} 
                style={{ 
                  padding: '10px 20px', 
                  borderRadius: '8px', 
                  backgroundColor: '#28a745', 
                  color: '#fff', 
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                ➕ Add Cookie
              </button>
            )}
          </div>
        </div>

        {/* Cookie Cards */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
            <p style={{ color: '#6c757d' }}>Loading cookies...</p>
          </div>
        ) : error ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            backgroundColor: '#fff3cd',
            borderRadius: '8px',
            border: '1px solid #ffc107'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>⚠️</div>
            <p style={{ color: '#856404', marginBottom: '10px' }}>{error}</p>
            <button 
              onClick={fetchCookies}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                backgroundColor: '#ffc107',
                color: '#000',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        ) : currentCookies.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px',
            backgroundColor: '#e9ecef',
            borderRadius: '8px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>📭</div>
            <h3 style={{ color: '#6c757d', marginBottom: '10px' }}>No Cookies Found</h3>
            <p style={{ color: '#6c757d' }}>Start by adding your first cookie!</p>
          </div>
        ) : (
        <div className="admin-cookie-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '20px',
          maxWidth: '100%'
        }}>
          {currentCookies.map(c =>
            <CookieCard
              key={c.id}
              cookie={c}
              onEdit={handleEditCookie}
              onDelete={handleDeleteCookie}
              onView={() => setViewCookie(c)}
              showActions={true}
            />
          )}
        </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !isLoading && !error && currentCookies.length > 0 && (
          <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                backgroundColor: currentPage === 1 ? '#e9ecef' : '#fff',
                color: currentPage === 1 ? '#adb5bd' : '#000',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.6 : 1
              }}
            >
              ← Prev
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    backgroundColor: currentPage === pageNum ? '#0d6efd' : '#fff',
                    color: currentPage === pageNum ? '#fff' : '#000',
                    cursor: 'pointer',
                    minWidth: '40px'
                  }}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                backgroundColor: currentPage === totalPages ? '#e9ecef' : '#fff',
                color: currentPage === totalPages ? '#adb5bd' : '#000',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages ? 0.6 : 1
              }}
            >
              Next →
            </button>
          </div>
        )}
        
        {/* Stats */}
        {!isLoading && !error && cookies.length > 0 && (
          <div style={{ 
            marginTop: '30px', 
            display: 'flex', 
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              flex: 1,
              minWidth: '150px',
              padding: '15px',
              backgroundColor: '#e7f3ff',
              borderRadius: '8px',
              border: '1px solid #b8daff'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#004085' }}>
                {cookies.length}
              </div>
              <div style={{ fontSize: '14px', color: '#004085' }}>
                Total Cookies
              </div>
            </div>
            <div style={{
              flex: 1,
              minWidth: '150px',
              padding: '15px',
              backgroundColor: '#d4edda',
              borderRadius: '8px',
              border: '1px solid #c3e6cb'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#155724' }}>
                ₹{cookies.reduce((sum, c) => sum + ((parseFloat(c.price) || 0) * (parseInt(c.quantityAvailable) || 0)), 0).toFixed(2)}
              </div>
              <div style={{ fontSize: '14px', color: '#155724' }}>
                Total Value
              </div>
            </div>
            <div style={{
              flex: 1,
              minWidth: '150px',
              padding: '15px',
              backgroundColor: '#fff3cd',
              borderRadius: '8px',
              border: '1px solid #ffeaa7'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#856404' }}>
                {[...new Set(cookies.map(c => c.flavor))].length}
              </div>
              <div style={{ fontSize: '14px', color: '#856404' }}>
                Unique Flavors
              </div>
        </div>
        </div>
        )}
          </>
        )}
      </div>

      {/* View Details Modal */}
      {viewCookie && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
           backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 20
         }}>
           <div style={{ 
             backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', 
             padding: '30px', 
             borderRadius: '16px', 
             width: '90%',
             maxWidth: '500px',
             position: 'relative',
             boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
           }}>
             <button 
               onClick={() => setViewCookie(null)} 
               style={{ 
                 position: 'absolute',
                 top: '15px',
                 right: '15px',
                 background: 'none',
                 border: 'none',
                 fontSize: '24px',
                 cursor: 'pointer',
                 color: '#6c757d'
               }}
             >
               ✕
             </button>
             <h2 style={{ marginBottom: '20px', color: '#333', fontSize: '28px' }}>{viewCookie.name}</h2>
             <img 
               src={viewCookie.imageUrl || 'https://cdn.pixabay.com/photo/2023/06/04/21/27/cookies-8040940_960_720.jpg'} 
               alt={viewCookie.name} 
               style={{ 
                 width: '100%', 
                 height: '250px', 
                 objectFit: 'cover', 
                 borderRadius: '12px', 
                 marginBottom: '20px',
                 boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
               }} 
             />
             <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', marginBottom: '15px' }}>
               <p style={{ marginBottom: '10px', fontSize: '16px' }}>
                 <strong style={{ color: '#495057' }}>Flavor:</strong> 
                 <span style={{ marginLeft: '10px', color: '#6c757d' }}>{viewCookie.flavor}</span>
               </p>
               <p style={{ marginBottom: '10px', fontSize: '16px' }}>
                 <strong style={{ color: '#495057' }}>Price:</strong> 
                 <span style={{ marginLeft: '10px', color: '#28a745', fontWeight: 'bold' }}>₹{viewCookie.price}</span>
               </p>
               {viewCookie.quantityAvailable !== undefined && (
                 <p style={{ marginBottom: '0', fontSize: '16px' }}>
                   <strong style={{ color: '#495057' }}>Stock:</strong> 
                   <span style={{ marginLeft: '10px', color: viewCookie.quantityAvailable > 0 ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>
                     {viewCookie.quantityAvailable}
                   </span>
                 </p>
               )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
