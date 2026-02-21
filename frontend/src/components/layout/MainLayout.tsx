/**
 * Layout principal de la aplicación.
 *
 * Aplica el tema del estudiante estableciendo:
 *   - data-narrative="tema-xxx" en <html> → el CSS sobreescribe --primary via selector
 *   - data-color + --custom-primary-hsl en <html> → color personalizado del inventario
 *   - backgroundImage / backgroundColor en <body> → fondo activo
 */

import { useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useThemeStore } from '@/store/themeStore';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

interface MainLayoutProps {
  children: React.ReactNode;
  userName: string;
  userRole: 'estudiante' | 'profesor';
  onLogout: () => void;
  hideSidebar?: boolean;
}

/** Convierte un color hex (#RRGGBB) a la cadena "H S% L%" que usa Tailwind/shadcn */
function hexToHslString(hex: string): string | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;

  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export function MainLayout({ children, userName, userRole, onLogout, hideSidebar = false }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Reproductor de música de fondo (solo para estudiantes)
  // El hook crea un único <audio> que persiste entre navegaciones
  useAudioPlayer();

  // Leer valores primitivos directamente del store como dependencias del efecto.
  // Zustand notifica el re-render cuando cualquiera de estos cambia, y el
  // useEffect se re-ejecuta correctamente sin depender de funciones getter.
  const temaActivoId      = useThemeStore(s => s.temaActivoId);
  const colorActivoId     = useThemeStore(s => s.colorActivoId);
  const preferenciasTema  = useThemeStore(s => s.preferenciasPorTema[s.temaActivoId]);
  const getFondoActivo    = useThemeStore(s => s.getFondoActivo);
  const getColorActivo    = useThemeStore(s => s.getColorActivo);

  useEffect(() => {
    // Los profesores no tienen personalización de tema
    if (userRole !== 'estudiante') return;

    const html = document.documentElement;
    const body = document.body;
    const fondo = getFondoActivo();
    const color = getColorActivo();

    // ---- 1. Tema narrativo → data-narrative en <html> ----
    html.setAttribute('data-narrative', temaActivoId);

    // ---- 2. Color personalizado del inventario ----
    // Setear inline → máxima prioridad, el selector del tema no puede pisarlo.
    const colorHex = color?.config?.colorHex;
    if (colorHex && !colorHex.startsWith('linear-gradient')) {
      const hsl = hexToHslString(colorHex);
      if (hsl) {
        html.style.setProperty('--primary', hsl);
        html.style.setProperty('--ring', hsl);
        html.style.setProperty('--primary-foreground', '0 0% 98%');
      }
    } else {
      // Sin color → el selector CSS del tema toma control de --primary
      html.style.removeProperty('--primary');
      html.style.removeProperty('--ring');
      html.style.removeProperty('--primary-foreground');
    }

    // ---- 3. Fondo activo ----
    if (fondo?.config?.urlImagen) {
      body.style.backgroundImage = `url(${fondo.config.urlImagen})`;
      body.style.backgroundSize = 'cover';
      body.style.backgroundPosition = 'center';
      body.style.backgroundAttachment = 'fixed';
      body.style.backgroundColor = '';
    } else if (fondo?.config?.colorHex && !fondo.config.colorHex.startsWith('linear')) {
      body.style.backgroundImage = 'none';
      body.style.backgroundColor = fondo.config.colorHex;
    } else {
      body.style.backgroundImage = 'none';
      body.style.backgroundColor = '';
    }

    return () => {
      html.removeAttribute('data-narrative');
      html.style.removeProperty('--primary');
      html.style.removeProperty('--ring');
      html.style.removeProperty('--primary-foreground');
      body.style.backgroundImage = 'none';
      body.style.backgroundColor = '';
    };
  // preferenciasTema cubre cambios de fondo; colorActivoId cubre cambios de color
  }, [temaActivoId, colorActivoId, preferenciasTema, userRole, getFondoActivo, getColorActivo]);

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
