/**
 * Componente raíz de la aplicación con sistema de rutas.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';

// Layout
import { MainLayout } from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/routing/ProtectedRoute';

// Auth
import { LoginPage } from '@/pages/auth/LoginPage';

// Student
import { StudentDashboard } from '@/pages/student/StudentDashboard';
import { PracticePage } from '@/pages/student/PracticePage';
import { ShopPage } from '@/pages/student/ShopPage';
import { InventoryPage } from '@/pages/student/InventoryPage';
import { BadgesPage } from '@/pages/student/BadgesPage';
import { ProgressPage } from '@/pages/student/ProgressPage';
import { VideosPage } from '@/pages/student/VideosPage';
import { ChallengesPage as StudentChallengesPage } from '@/pages/student/ChallengesPage';
import { GroupChallengePage } from '@/pages/student/GroupChallengePage';
import { SettingsPage } from '@/pages/student/SettingsPage';

// Teacher
import TeacherDashboard from '@/pages/teacher/TeacherDashboard';
import GroupsPage from '@/pages/teacher/GroupsPage';
import GroupDetailPage from '@/pages/teacher/GroupDetailPage';
import StudentsPage from '@/pages/teacher/StudentsPage';
import StudentDetailPage from '@/pages/teacher/StudentDetailPage';
import AlertsPage from '@/pages/teacher/AlertsPage';
import { ChallengesPage as TeacherChallengesPage } from '@/pages/teacher/ChallengesPage';
import CreateChallengePage from '@/pages/teacher/CreateChallengePage';
import { ConfigurationPage } from '@/pages/teacher/ConfigurationPage';

function App() {
  // Zustand store
  const { isAuthenticated, getUserRole, getUserName, login, logout } = useAuthStore();
  
  const userRole = getUserRole();
  const userName = getUserName();

  const handleLogin = async (codigo: string, password: string) => {
    // Mock login para desarrollo (sin backend)
    // TODO: Reemplazar con authService.login cuando backend esté disponible
    
    const isMockMode = true; // Cambiar a false cuando backend esté listo
    
    if (isMockMode) {
      // Login mock
      const isEstudiante = codigo.toUpperCase().startsWith('EST');
      const mockUser = isEstudiante
        ? {
            id: 1,
            tipo_usuario: 'estudiante' as const,
            codigo_estudiante: codigo,
            nombre_completo: 'Justin W.',
            email: 'estudiante@test.com',
            fecha_creacion: new Date().toISOString(),
            activo: true,
          }
        : {
            id: 1,
            tipo_usuario: 'profesor' as const,
            codigo_profesor: codigo,
            nombre_completo: 'Profesor Demo',
            email: 'profesor@test.com',
            fecha_creacion: new Date().toISOString(),
            activo: true,
            institucion: 'Escuela Demo',
          };
      
      login('mock-token-' + Date.now(), mockUser);
      return;
    }
    
    // Login real con backend
    const response = await authService.login({ codigo, password });
    login(response.access_token, response.user);
  };

  const handleLogout = () => {
    authService.logout();
    logout();
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

        {/* Ruta especial: Página de práctica sin sidebar */}
        <Route
          path="/student/practice"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              userRole={userRole || undefined}
              requiredRole="estudiante"
            >
              <MainLayout
                userName={userName}
                userRole="estudiante"
                onLogout={handleLogout}
                hideSidebar={true}
              >
                <PracticePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Rutas protegidas: Estudiante (con sidebar) */}
        <Route
          path="/student/*"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              userRole={userRole || undefined}
              requiredRole="estudiante"
            >
              <MainLayout
                userName={userName}
                userRole="estudiante"
                onLogout={handleLogout}
              >
                <Routes>
                  <Route path="dashboard" element={<StudentDashboard />} />
                  <Route path="shop" element={<ShopPage />} />
                  <Route path="inventory" element={<InventoryPage />} />
                  <Route path="badges" element={<BadgesPage />} />
                  <Route path="progress" element={<ProgressPage />} />
                  <Route path="videos" element={<VideosPage />} />
                  <Route path="challenges" element={<StudentChallengesPage />} />
                  <Route path="group-challenge" element={<GroupChallengePage />} />
                  <Route path="settings" element={<SettingsPage />} />
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
              userRole={userRole || undefined}
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
                  <Route path="groups/:id" element={<GroupDetailPage />} />
                  <Route path="students" element={<StudentsPage />} />
                  <Route path="students/:id" element={<StudentDetailPage />} />
                  <Route path="challenges" element={<TeacherChallengesPage />} />
                  <Route path="challenges/new" element={<CreateChallengePage />} />
                  <Route path="alerts" element={<AlertsPage />} />
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
