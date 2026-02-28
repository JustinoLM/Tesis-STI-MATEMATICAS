/**
 * Dashboard del estudiante - Pantalla principal.
 */

import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useThemeStore } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { studentService } from '@/services/studentService';
import {
  BookOpen,
  ShoppingBag,
  Trophy,
  TrendingUp,
  Users,
  Video,
  Settings,
  Loader2,
  ClipboardList,
} from 'lucide-react';

export function StudentDashboard() {
  const navigate = useNavigate();
  const { temaActivoId, colorActivoId } = useThemeStore();
  const nombreCompleto = useAuthStore(s => s.nombreCompleto);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void temaActivoId; void colorActivoId; // asegurar re-render al cambiar tema

  const cardGlow = {
    boxShadow: '0 0 0 1px hsl(var(--primary) / 0.15), 0 4px 20px hsl(var(--primary) / 0.18)',
  } as React.CSSProperties;

  const cardGlowHover = {
    boxShadow: '0 0 0 2px hsl(var(--primary) / 0.3), 0 8px 30px hsl(var(--primary) / 0.25)',
  } as React.CSSProperties;

  // ── Datos reales desde el backend ─────────────────────────────────────────
  const { data: perfil, isLoading: loadingPerfil } = useQuery({
    queryKey: ['perfil-estudiante'],
    queryFn: () => studentService.getPerfil(),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const { data: saldo, isLoading: loadingSaldo } = useQuery({
    queryKey: ['saldo-estudiante'],
    queryFn: () => studentService.getSaldo(),
    staleTime: 1000 * 60 * 2, // 2 minutos
  });

  const { data: medallas } = useQuery({
    queryKey: ['medallas-estudiante'],
    queryFn: () => studentService.getMedallas(),
    staleTime: 1000 * 60 * 10,
  });

  // ── Valores derivados ──────────────────────────────────────────────────────
  const nivel = perfil?.nivel_actual ?? '-';
  const puntos = saldo?.puntos_totales ?? 0;
  const precision = perfil ? Math.round(perfil.precision_ultimos_15 * 100) : 0;
  const cantMedallas = medallas?.medallas_obtenidas ?? 0;
  const medallaDestacada = medallas
    ? (medallas.medalla_destacada_id
        ? medallas.medallas.find(m => m.id === medallas.medalla_destacada_id) ?? null
        : medallas.medallas.find(m => m.obtenida) ?? null)
    : null;

  const textoMotivacion = perfil
    ? precision >= 80
      ? '¡Sigue así, estás haciendo un gran trabajo!'
      : precision >= 60
        ? '¡Buen esfuerzo! Cada práctica te hace más fuerte.'
        : '¡Tú puedes! La práctica constante lleva al éxito.'
    : '¡Bienvenido! Empieza una práctica para avanzar.';

  const isLoading = loadingPerfil || loadingSaldo;

  // ── Diagnóstico completado ─────────────────────────────────────────────────
  const diagnosticoCompletado = perfil?.diagnostico_completado ?? true; // true mientras carga (no interrumpir UX)

  // ── Navegación ─────────────────────────────────────────────────────────────
  const navigationCards = [
    { title: 'Práctica',       description: 'Resolver problemas',    icon: BookOpen,  path: '/student/practice',        color: 'bg-blue-500' },
    { title: 'Inventario',     description: 'Mis desbloqueables',    icon: ShoppingBag,path: '/student/inventory',      color: 'bg-purple-500' },
    { title: 'Progreso',       description: 'Ver estadísticas',      icon: TrendingUp, path: '/student/progress',       color: 'bg-green-500' },
    { title: 'Desafío Grupal', description: 'Colaborar con tu grupo', icon: Users,      path: '/student/challenges',     color: 'bg-red-500' },
  ];

  const handleNavegacion = (path: string) => {
    // Si el estudiante no ha completado el diagnóstico y quiere practicar, redirigir
    if (path === '/student/practice' && !diagnosticoCompletado) {
      navigate('/student/diagnostic');
    } else {
      navigate(path);
    }
  };

  const secondaryActions = [
    { title: 'Videos', icon: Video,    path: '/student/videos' },
    { title: 'Editar', icon: Settings, path: '/student/settings' },
  ];

  return (
    <div className="space-y-6">
      {/* Banner de diagnóstico pendiente */}
      {!loadingPerfil && !diagnosticoCompletado && (
        <Card
          className="cursor-pointer border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-colors"
          onClick={() => navigate('/student/diagnostic')}
        >
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary text-primary-foreground flex-shrink-0">
                <ClipboardList className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-base">Completa tu prueba diagnóstica</p>
                <p className="text-sm text-muted-foreground">
                  Antes de practicar, necesitamos conocer tu nivel actual. ¡Solo son 8 preguntas!
                </p>
              </div>
              <span className="text-sm font-medium text-primary whitespace-nowrap">
                Comenzar →
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header con texto motivacional */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50" style={cardGlow}>
        <CardContent className="pt-6">
          <div className="text-center">
            {nombreCompleto && (
              <p className="text-sm text-gray-500 mb-1">Hola, {nombreCompleto.split(' ')[0]}</p>
            )}
            <p className="text-2xl font-medium text-gray-700">{textoMotivacion}</p>
            <div className="mt-4 flex justify-center gap-8">
              <div className="text-center">
                {isLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto" />
                ) : (
                  <p className="text-3xl font-bold text-blue-600">Nivel {nivel}</p>
                )}
                <p className="text-sm text-gray-600">De 5 niveles</p>
              </div>
              <div className="text-center">
                {loadingSaldo ? (
                  <Loader2 className="h-8 w-8 animate-spin text-purple-400 mx-auto" />
                ) : (
                  <p className="text-3xl font-bold text-purple-600">{puntos.toLocaleString()}</p>
                )}
                <p className="text-sm text-gray-600">Puntos</p>
              </div>
              <div className="text-center">
                {loadingPerfil ? (
                  <Loader2 className="h-8 w-8 animate-spin text-yellow-400 mx-auto" />
                ) : (
                  <p className="text-3xl font-bold text-yellow-600">{precision}%</p>
                )}
                <p className="text-sm text-gray-600">Precisión</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid principal de navegación */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Columna izquierda: Cards en cuadrícula 2x2 */}
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
                onClick={() => handleNavegacion(card.path)}
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

        {/* Columna derecha: Card de Medallero */}
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
              <div className="w-40 h-40 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-5xl">
                  {medallaDestacada
                    ? (medallaDestacada.imagen_url ?? '🏅')
                    : '⭐'}
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold mb-2">
                  {medallaDestacada ? medallaDestacada.nombre : 'Sin medallas aún'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {medallaDestacada ? medallaDestacada.descripcion : 'Completa prácticas para ganar medallas'}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {cantMedallas} medallas desbloqueadas
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
