import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { royalEdgeService } from '../../services/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole = 'ROLE_ADMIN',
}) => {
  const location = useLocation();
  const isAuth = royalEdgeService.isAdminAuthenticated();
  const role = royalEdgeService.getAdminRole();

  if (!isAuth || (requiredRole && role !== requiredRole)) {
    // Unauthenticated or unauthorized users are redirected directly to /admin/login
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
