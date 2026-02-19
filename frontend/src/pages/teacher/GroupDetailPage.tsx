/**
 * Página de detalle de un grupo específico.
 * Muestra estadísticas detalladas y métricas del grupo.
 */

import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Users,
  TrendingUp,
  Clock,
  AlertTriangle,
  Award,
  BarChart3,
} from 'lucide-react';
import { teacherService } from '@/services/teacherService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function GroupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const grupoId = parseInt(id || '0');

  // Obtener detalle del grupo
  const { data: grupo, isLoading: loadingGrupo } = useQuery({
    queryKey: ['teacher', 'group', grupoId],
    queryFn: () => teacherService.getGrupoDetalle(grupoId),
    enabled: !!grupoId,
  });

  // Obtener estadísticas del grupo
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['teacher', 'group', grupoId, 'statistics'],
    queryFn: () => teacherService.getEstadisticasGrupo(grupoId),
    enabled: !!grupoId,
  });

  if (loadingGrupo || loadingStats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Cargando información del grupo...</p>
      </div>
    );
  }

  if (!grupo || !stats) {
    return (
      <div className="space-y-6">
        <Link to="/teacher/groups">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Grupos
          </Button>
        </Link>
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">Grupo no encontrado</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link to="/teacher/groups">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Grupos
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{grupo.nombre}</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{grupo.codigo_grupo}</Badge>
            <Badge variant={grupo.activo ? 'default' : 'secondary'}>
              {grupo.activo ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
        </div>
        <Link to={`/teacher/configuration?grupo=${grupoId}`}>
          <Button variant="outline">Configurar Práctica</Button>
        </Link>
      </div>

      {/* Estadísticas Principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_estudiantes}</div>
            <p className="text-xs text-muted-foreground">
              {stats.estudiantes_activos} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Precisión Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.promedio_precision.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Del grupo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Problemas Resueltos</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.problemas_resueltos_hoy}</div>
            <p className="text-xs text-muted-foreground">
              Hoy • {stats.problemas_resueltos_total} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Velocidad Promedio</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.promedio_velocidad.toFixed(1)}s</div>
            <p className="text-xs text-muted-foreground">Por problema</p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas y Clasificación de Estudiantes */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Rezagados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.estudiantes_rezagados}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Precisión menor a 50%
            </p>
            {stats.estudiantes_rezagados > 0 && (
              <Link to="/teacher/alerts">
                <Button variant="link" className="px-0 mt-2">
                  Ver alertas
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <Clock className="h-5 w-5" />
              Estancados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.estudiantes_estancados}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Mucho tiempo en mismo nivel
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <Award className="h-5 w-5" />
              Sobresalientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.estudiantes_sobresalientes}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Precisión mayor a 90%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Distribución por Niveles */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución por Niveles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((nivel) => {
            const cantidad = stats.distribucion_niveles[nivel] || 0;
            const porcentaje = stats.total_estudiantes
              ? (cantidad / stats.total_estudiantes) * 100
              : 0;

            return (
              <div key={nivel} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Nivel {nivel}</span>
                  <span className="text-muted-foreground">
                    {cantidad} estudiantes ({porcentaje.toFixed(0)}%)
                  </span>
                </div>
                <Progress value={porcentaje} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Actividad del Grupo */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad del Grupo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium">Estudiantes Activos (últimos 7 días)</p>
              <div className="flex items-center gap-2">
                <div className="text-3xl font-bold">{stats.estudiantes_activos}</div>
                <div className="text-sm text-muted-foreground">
                  de {stats.total_estudiantes}
                </div>
              </div>
              <Progress
                value={
                  (stats.estudiantes_activos / stats.total_estudiantes) * 100
                }
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Estudiantes Inactivos</p>
              <div className="flex items-center gap-2">
                <div className="text-3xl font-bold">{stats.estudiantes_inactivos}</div>
                <div className="text-sm text-muted-foreground">
                  sin actividad reciente
                </div>
              </div>
              {stats.estudiantes_inactivos > 0 && (
                <p className="text-xs text-muted-foreground">
                  Considera contactar a estos estudiantes
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acciones Rápidas */}
      <div className="grid gap-4 md:grid-cols-2">
        <Link to="/teacher/students">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Ver Estudiantes</h3>
                <p className="text-sm text-muted-foreground">
                  Buscar estudiantes del grupo
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to={`/teacher/challenges/new?grupo=${grupoId}`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-100">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Crear Desafío</h3>
                <p className="text-sm text-muted-foreground">
                  Nuevo desafío para este grupo
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
