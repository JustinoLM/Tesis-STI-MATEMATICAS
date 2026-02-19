/**
 * Página de detalle de un estudiante específico.
 * Muestra progreso individual, desglose por operaciones y últimos intentos.
 */

import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  TrendingUp,
  Target,
  Award,
  Clock,
  Flame,
  CheckCircle,
  XCircle,
  BarChart3,
} from 'lucide-react';
import { teacherService } from '@/services/teacherService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const estudianteId = parseInt(id || '0');

  // Obtener progreso del estudiante
  const { data: progreso, isLoading } = useQuery({
    queryKey: ['teacher', 'student', estudianteId, 'progress'],
    queryFn: () => teacherService.getProgresoEstudiante(estudianteId),
    enabled: !!estudianteId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Cargando información del estudiante...</p>
      </div>
    );
  }

  if (!progreso) {
    return (
      <div className="space-y-6">
        <Link to="/teacher/students">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Estudiantes
          </Button>
        </Link>
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">Estudiante no encontrado</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mapeo de nombres de operaciones
  const operationNames: Record<string, string> = {
    suma: 'Suma',
    resta: 'Resta',
    multiplicacion: 'Multiplicación',
    division: 'División',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link to="/teacher/students">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Estudiantes
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{progreso.nombre_completo}</h1>
          <div className="flex items-center gap-2">
            <code className="text-sm bg-muted px-2 py-1 rounded">
              {progreso.codigo_estudiante}
            </code>
            <Badge variant="outline">Nivel {progreso.nivel_actual}</Badge>
          </div>
        </div>
      </div>

      {/* Estadísticas Principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nivel Actual</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progreso.nivel_actual}</div>
            <p className="text-xs text-muted-foreground">De 5 niveles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Precisión Global</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progreso.overall_accuracy.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">De todas las operaciones</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Problemas Resueltos</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progreso.total_problemas_resueltos}</div>
            <p className="text-xs text-muted-foreground">Total de intentos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Racha Actual</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progreso.current_streak}</div>
            <p className="text-xs text-muted-foreground">
              Máximo: {progreso.max_streak}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progreso por Operación */}
      <Card>
        <CardHeader>
          <CardTitle>Progreso por Operación</CardTitle>
        </CardHeader>
        <CardContent>
          {progreso.operations && progreso.operations.length > 0 ? (
            <div className="space-y-6">
              {progreso.operations.map((op) => (
                <div key={op.operation} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold">
                        {operationNames[op.operation] || op.operation}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          Nivel {op.current_level}
                        </span>
                        <span className="flex items-center gap-1">
                          <Award className="h-4 w-4" />
                          {op.problems_solved} problemas
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          {op.accuracy.toFixed(1)}% precisión
                        </span>
                      </div>
                    </div>
                    <Badge variant={op.current_level === 5 ? 'default' : 'outline'}>
                      {op.current_level === 5 ? 'Completado' : `${op.progress_to_next_level.toFixed(0)}%`}
                    </Badge>
                  </div>
                  <Progress value={op.progress_to_next_level} className="h-2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No hay datos de progreso por operación
            </div>
          )}
        </CardContent>
      </Card>

      {/* Últimos Intentos */}
      <Card>
        <CardHeader>
          <CardTitle>Últimos Intentos</CardTitle>
        </CardHeader>
        <CardContent>
          {progreso.recent_attempts && progreso.recent_attempts.length > 0 ? (
            <div className="space-y-2">
              {progreso.recent_attempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {attempt.is_correct ? (
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {operationNames[attempt.operation] || attempt.operation}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          Nivel {attempt.level}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {attempt.time_taken.toFixed(1)}s
                        </span>
                        <span>
                          {new Date(attempt.created_at).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={attempt.is_correct ? 'default' : 'destructive'}>
                    {attempt.is_correct ? 'Correcto' : 'Incorrecto'}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No hay intentos recientes registrados
            </div>
          )}
        </CardContent>
      </Card>

      {/* Acciones Rápidas */}
      <div className="grid gap-4 md:grid-cols-2">
        <Link to="/teacher/alerts">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-yellow-100">
                <BarChart3 className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold">Ver Alertas</h3>
                <p className="text-sm text-muted-foreground">
                  Revisar alertas del estudiante
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to={`/teacher/challenges/new?estudiante=${estudianteId}`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-100">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Crear Desafío</h3>
                <p className="text-sm text-muted-foreground">
                  Asignar desafío personalizado
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
