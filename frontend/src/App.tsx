/**
 * Componente raíz de la aplicación con sistema de rutas.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';

// Layout
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/routing/ProtectedRoute';

// Auth
import { LoginPage } from '@/pages/auth/LoginPage';

// Student
import { StudentDashboard } from '@/pages/student/StudentDashboard';
import { PracticePage } from '@/pages/student/PracticePage';
import { ShopPage } from '@/pages/student/ShopPage';
import { ProfilePage } from '@/pages/student/ProfilePage';

// Teacher
import { TeacherDashboard } from '@/pages/teacher/TeacherDashboard';
import { GroupsPage } from '@/pages/teacher/GroupsPage';
import { ChallengesPage } from '@/pages/teacher/ChallengesPage';
import { ConfigurationPage } from '@/pages/teacher/ConfigurationPage';

import { TipoUsuario } from '@/types';

function App() {
  // TODO: Reemplazar con Zustand store en 4.4.3
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<TipoUsuario | undefined>();
  const [userName, setUserName] = useState('');

  const handleLogin = async (codigo: string, password: string) => {
    // TODO: Implementar autenticación real en 4.4.3
    console.log('Login:', codigo, password);
    
    // Mock login
    setIsAuthenticated(true);
    setUserRole(codigo.startsWith('EST') ? 'estudiante' : 'profesor');
    setUserName(codigo);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(undefined);
    setUserName('');
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública: Login */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate
                to={userRole === 'estudiante' ? '/student/dashboard' : '/teacher/dashboard'}
                replace
              />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />

        {/* Rutas protegidas: Estudiante */}
        <Route
          path="/student/*"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              userRole={userRole}
              requiredRole="estudiante"
            >
              <MainLayout
                userName={userName}
                userRole="estudiante"
                onLogout={handleLogout}
              >
                <Routes>
                  <Route path="dashboard" element={<StudentDashboard />} />
                  <Route path="practice" element={<PracticePage />} />
                  <Route path="shop" element={<ShopPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Rutas protegidas: Profesor */}
        <Route
          path="/teacher/*"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              userRole={userRole}
              requiredRole="profesor"
            >
              <MainLayout
                userName={userName}
                userRole="profesor"
                onLogout={handleLogout}
              >
                <Routes>
                  <Route path="dashboard" element={<TeacherDashboard />} />
                  <Route path="groups" element={<GroupsPage />} />
                  <Route path="challenges" element={<ChallengesPage />} />
                  <Route path="configuration" element={<ConfigurationPage />} />
                  <Route path="*" element={<Navigate to="/teacher/dashboard" replace />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Raíz: Redirect según autenticación */}
        <Route
          path="/"
          element={
            <Navigate
              to={
                isAuthenticated
                  ? userRole === 'estudiante'
                    ? '/student/dashboard'
                    : '/teacher/dashboard'
                  : '/login'
              }
              replace
            />
          }
        />

        {/* 404: Redirect a login o dashboard */}
        <Route
          path="*"
          element={
            <Navigate
              to={
                isAuthenticated
                  ? userRole === 'estudiante'
                    ? '/student/dashboard'
                    : '/teacher/dashboard'
                  : '/login'
              }
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
