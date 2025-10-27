import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './components/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load dashboard components for better performance
const AdminDashboard = lazy(() => import('./dashboards/AdminDashboard/AdminDashboard'));
const CustomerDashboard = lazy(() => import('./dashboards/CustomerDashboard/CustomerDashboard'));

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <Suspense fallback={<LoadingSpinner text="Loading Admin Dashboard..." size="large" />}>
                    <AdminDashboard />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            <Route
              path="/customer/*"
              element={
                <ProtectedRoute role="customer">
                  <Suspense fallback={<LoadingSpinner text="Loading Customer Dashboard..." size="large" />}>
                    <CustomerDashboard />
                  </Suspense>
                </ProtectedRoute>
              }
            />

          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}


export default App;
