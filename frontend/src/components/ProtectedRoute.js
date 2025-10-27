import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const normalizeRole = (role) => {
  if (!role) return '';
  const r = role.toUpperCase();
  if (r.includes('ADMIN')) return 'ADMIN';
  if (r.includes('USER') || r.includes('CUSTOMER')) return 'USER';
  if (r.includes('MODERATOR')) return 'MODERATOR';
  return r;
};

const getRoleName = (role) => {
  const normalized = normalizeRole(role);
  if (normalized === 'ADMIN') return 'admin';
  if (normalized === 'USER') return 'customer';
  if (normalized === 'MODERATOR') return 'moderator';
  return '';
};

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>; // Wait until user is loaded

  if (!user) return <Navigate to="/" replace />; // redirect to landing if not logged in

  const userRole = normalizeRole(user.role);
  const requiredRole = role ? normalizeRole(role) : null;

  if (requiredRole && userRole !== requiredRole) {
    const roleName = getRoleName(userRole);
    if (roleName) {
      return <Navigate to={`/${roleName}`} replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
