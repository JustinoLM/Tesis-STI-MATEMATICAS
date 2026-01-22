/**
 * Layout principal de la aplicación.
 */

import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  userName: string;
  userRole: 'estudiante' | 'profesor';
  onLogout: () => void;
  hideSidebar?: boolean; // Prop para ocultar sidebar (usado en página de práctica)
}

export function MainLayout({ children, userName, userRole, onLogout, hideSidebar = false }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header
        userName={userName}
        userRole={userRole}
        onLogout={onLogout}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex">
        {!hideSidebar && (
          <Sidebar
            userRole={userRole}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 p-6">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
