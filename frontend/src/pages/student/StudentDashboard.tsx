/**
 * Dashboard del estudiante - Pantalla principal.
 */

import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useThemeStore } from '@/store/themeStore';
import {
  BookOpen,
  ShoppingBag,
  Trophy,
  TrendingUp,
  Users,
  Video,
  Settings
} from 'lucide-react';

export function StudentDashboard() {
  const navigate = useNavigate();
  const { temaActivoId, colorActivoId } = useThemeStore();

  // Genera el glow usando la variable --primary del tema activo.
  // Se recalcula cada vez que cambia el tema o el color.
  const cardGlow = {
    boxShadow: '0 0 0 1px hsl(var(--primary) / 0.15), 0 4px 20px hsl(var(--primary) / 0.18)',
  } as React.CSSProperties;

  const cardGlowHover = {
    boxShadow: '0 0 0 2px hsl(var(--primary) / 0.3), 0 8px 30px hsl(var(--primary) / 0.25)',
  } as React.CSSProperties;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void temaActivoId; void colorActivoId; // asegurar re-render al cambiar tema

  // TODO: Obtener de React Query en subsección posterior
  const studentData = {
    nombre: 'Justin W.',
    nivel: 3,
    puntos: 1250,
    medallas: 12,
    problemasHoy: 15,
    precision: 85,
    textoMotivacion: '¡Sigue así, estás haciendo un gran trabajo!',
    medallaDestacada: {
      name: 'Maestro de Sumas',
      icon: '➕',
      description: 'Completó el nivel 5 de sumas',
    },
  };

  const navigationCards = [
    {
      title: 'Práctica',
      description: 'Resolver problemas',
      icon: BookOpen,
      path: '/student/practice',
      color: 'bg-blue-500',
    },
    {
      title: 'Inventario',
      description: 'Mis desbloqueables',
      icon: ShoppingBag,
      path: '/student/inventory',
      color: 'bg-purple-500',
    },
    {
      title: 'Progreso',
      description: 'Ver estadísticas',
      icon: TrendingUp,
      path: '/student/progress',
      color: 'bg-green-500',
    },
    {
      title: 'Desafío Grupal',
      description: 'Competir con tu grupo',
      icon: Users,
      path: '/student/group-challenge',
      color: 'bg-red-500',
    },
  ];

  const secondaryActions = [
    {
      title: 'Videos',
      icon: Video,
      path: '/student/videos',
    },
    {
      title: 'Editar',
      icon: Settings,
      path: '/student/settings',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header con texto motivacional */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50" style={cardGlow}>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-2xl font-medium text-gray-700">
              {studentData.textoMotivacion}
            </p>
            <div className="mt-4 flex justify-center gap-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">Nivel {studentData.nivel}</p>
                <p className="text-sm text-gray-600">De 5 niveles</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">{studentData.puntos}</p>
                <p className="text-sm text-gray-600">Puntos</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-600">{studentData.precision}%</p>
                <p className="text-sm text-gray-600">Precisión</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid principal de navegación */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Columna izquierda: Cards normales en cuadrícula 2x2 */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {navigationCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.path}
                className="cursor-pointer transition-all hover:scale-105"
                style={cardGlow}
                onMouseEnter={e => Object.assign((e.currentTarget as HTMLElement).style, cardGlowHover)}
                onMouseLeave={e => Object.assign((e.currentTarget as HTMLElement).style, cardGlow)}
                onClick={() => navigate(card.path)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{card.title}</span>
                    <div className={`p-3 rounded-lg ${card.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">{card.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Columna derecha: Card especial de Medallero (vertical, ocupa 2 filas) */}
        <Card
          className="cursor-pointer transition-all hover:scale-105 ring-2 ring-yellow-400 lg:row-span-2"
          style={cardGlow}
          onMouseEnter={e => Object.assign((e.currentTarget as HTMLElement).style, cardGlowHover)}
          onMouseLeave={e => Object.assign((e.currentTarget as HTMLElement).style, cardGlow)}
          onClick={() => navigate('/student/badges')}
        >
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Medallero</span>
              <div className="p-3 rounded-lg bg-yellow-500">
                <Trophy className="h-6 w-6 text-white" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              {/* Medalla destacada */}
              <div className="w-40 h-40 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-7xl">{studentData.medallaDestacada.icon}</span>
              </div>
              {/* Información */}
              <div className="text-center">
                <h3 className="text-lg font-bold mb-2">{studentData.medallaDestacada.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{studentData.medallaDestacada.description}</p>
                <div className="flex items-center justify-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {studentData.medallas} medallas desbloqueadas
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Acciones secundarias */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {secondaryActions.map((action) => {
          const Icon = action.icon;
          return (
            <Card
              key={action.path}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              style={cardGlow}
              onMouseEnter={e => Object.assign((e.currentTarget as HTMLElement).style, cardGlowHover)}
              onMouseLeave={e => Object.assign((e.currentTarget as HTMLElement).style, cardGlow)}
              onClick={() => navigate(action.path)}
            >
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">{action.title}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
