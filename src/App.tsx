import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicHomePage } from './pages/PublicHomePage';
import { AdminPortalPage } from './pages/AdminPortalPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import './App.css';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Public Customer-Facing Website Route */}
        <Route path="/" element={<PublicHomePage />} />

        {/* 2. Dedicated Admin Login Route (Directly Accessible via URL) */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* 3. Protected Admin Dashboard Routes (ROLE_ADMIN Required) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="ROLE_ADMIN">
              <AdminPortalPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="ROLE_ADMIN">
              <AdminPortalPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback to Public Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
