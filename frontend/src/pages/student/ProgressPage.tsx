/**
 * Página de Progreso - Muestra estadísticas y gráficos de rendimiento del estudiante.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, Clock, Award } from 'lucide-react';

export function ProgressPage() {
  // TODO: Obtener de React Query en subsección posterior
  const progressData = {
    nivelActual: 3,
    nivelMaximo: 5,
    progresoNivel: 65,
    operaciones: [
      {
        tipo: 'Suma',
        nivel: 4,
        progreso: 80,
        problemas: 45,
        precision: 92,
        color: 'bg-blue-500',
      },
      {
        tipo: 'Resta',
        nivel: 3,
        progreso: 65,
        problemas: 38,
        precision: 88,
        color: 'bg-green-500',
      },
      {
        tipo: 'Multiplicación',
        nivel: 3,
        progreso: 55,
        problemas: 32,
        precision: 85,
        color: 'bg-purple-500',
      },
      {
        tipo: 'División',
        nivel: 2,
        progreso: 40,
        problemas: 28,
        precision: 82,
        color: 'bg-orange-500',
      },
    ],
    estadisticas: {
      totalProblemas: 143,
      tiempoTotal: '12h 30m',
      racha: 5,
      mejorRacha: 12,
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-2xl font-bold">Mi Progreso</h1>
              <p className="text-sm text-gray-600 font-normal">
                Nivel {progressData.nivelActual} de {progressData.nivelMaximo}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progreso al siguiente nivel</span>
              <span className="font-bold">{progressData.progresoNivel}%</span>
            </div>
            <Progress value={progressData.progresoNivel} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <Target className="h-8 w-8 mx-auto text-blue-500" />
              <p className="text-2xl font-bold">{progressData.estadisticas.totalProblemas}</p>
              <p className="text-sm text-gray-600">Problemas resueltos</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <Clock className="h-8 w-8 mx-auto text-purple-500" />
              <p className="text-2xl font-bold">{progressData.estadisticas.tiempoTotal}</p>
              <p className="text-sm text-gray-600">Tiempo practicando</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <Award className="h-8 w-8 mx-auto text-yellow-500" />
              <p className="text-2xl font-bold">{progressData.estadisticas.racha}</p>
              <p className="text-sm text-gray-600">Racha actual</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <TrendingUp className="h-8 w-8 mx-auto text-green-500" />
              <p className="text-2xl font-bold">{progressData.estadisticas.mejorRacha}</p>
              <p className="text-sm text-gray-600">Mejor racha</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progreso por Operación */}
      <Card>
        <CardHeader>
          <CardTitle>Progreso por Operación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {progressData.operaciones.map((op) => (
              <div key={op.tipo} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${op.color}`} />
                    <div>
                      <p className="font-medium">{op.tipo}</p>
                      <p className="text-sm text-gray-600">
                        Nivel {op.nivel} • {op.problemas} problemas • {op.precision}% precisión
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold">{op.progreso}%</span>
                </div>
                <Progress value={op.progreso} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de rendimiento (placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle>Rendimiento de los Últimos 7 Días</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Gráfico de rendimiento (próximamente)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
