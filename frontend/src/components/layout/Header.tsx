/**
 * Header principal de la aplicación.
 */

import { User, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  userName: string;
  userRole: 'estudiante' | 'profesor';
  onLogout: () => void;
  onMenuToggle?: () => void;
}

export function Header({ userName, userRole, onLogout, onMenuToggle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left: Logo + Menu Toggle */}
        <div className="flex items-center gap-4">
          {onMenuToggle && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuToggle}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary" />
            <span className="font-bold text-lg">STI Matemáticas</span>
          </div>
        </div>

        {/* Right: User Info + Logout */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <div className="hidden sm:block">
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
