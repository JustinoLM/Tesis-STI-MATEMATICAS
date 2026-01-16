/**
 * Componente de ruta protegida.
 * Verifica autenticación y rol del usuario.
 */

import { Navigate } from 'react-router-dom';
import { TipoUsuario } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: TipoUsuario;
  isAuthenticated: boolean;
  userRole?: TipoUsuario;
}

export function ProtectedRoute({
  children,
  requiredRole,
  isAuthenticated,
  userRole,
}: ProtectedRouteProps) {
  // No autenticado -> Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Autenticado pero rol incorrecto -> Redirect a su dashboard
  if (requiredRole && userRole !== requiredRole) {
    const redirectPath = userRole === 'estudiante' 
      ? '/student/dashboard' 
      : '/teacher/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}
