import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Clock, Target, TrendingUp, Award } from 'lucide-react';
import { Operacion } from '@/types';

interface ProblemResult {
  id: number;
  operacion: Operacion;
  numero1: number;
  numero2: number;
  resultado: number;
  esCorrecta: boolean;
  intentos: number;
  tiempoSegundos: number;
}

interface SessionSummaryProps {
  resultados: ProblemResult[];
  onContinuar: () => void;
}

/**
 * Pantalla de resumen de sesión de práctica
 * Muestra estadísticas, problemas resueltos y análisis de rendimiento
 */
export function SessionSummary({ resultados, onContinuar }: SessionSummaryProps) {
  const totalProblemas = resultados.length;
  const problemasCorrectos = resultados.filter(r => r.esCorrecta).length;
  const problemasIncorrectos = totalProblemas - problemasCorrectos;
  const precision = Math.round((problemasCorrectos / totalProblemas) * 100);
  const tiempoPromedio = Math.round(
    resultados.reduce((acc, r) => acc + r.tiempoSegundos, 0) / totalProblemas
  );

  // Análisis por operación
  const operacionesStats = resultados.reduce((acc, r) => {
    if (!acc[r.operacion]) {
      acc[r.operacion] = { correctas: 0, total: 0 };
    }
    acc[r.operacion].total++;
    if (r.esCorrecta) {
      acc[r.operacion].correctas++;
    }
    return acc;
  }, {} as Record<Operacion, { correctas: number; total: number }>);

  const operacionMasFuerte = Object.entries(operacionesStats).reduce((max, [op, stats]) => {
    const porcentaje = (stats.correctas / stats.total) * 100;
    return porcentaje > max.porcentaje ? { operacion: op, porcentaje } : max;
  }, { operacion: '', porcentaje: 0 });

  const operacionMasDebil = Object.entries(operacionesStats).reduce((min, [op, stats]) => {
    const porcentaje = (stats.correctas / stats.total) * 100;
    return porcentaje < min.porcentaje ? { operacion: op, porcentaje } : min;
  }, { operacion: '', porcentaje: 100 });

  const getOperacionNombre = (op: string) => {
    switch (op) {
      case 'SUMA': return 'Suma';
      case 'RESTA': return 'Resta';
      case 'MULTIPLICACION': return 'Multiplicación';
      case 'DIVISION': return 'División';
      default: return op;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Header */}
      <Card className="border-2 border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <CardTitle className="text-3xl">¡Sesión Completada!</CardTitle>
          <p className="text-muted-foreground mt-2">
            Has terminado tu práctica. Aquí está tu resumen de rendimiento.
          </p>
        </CardHeader>
      </Card>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <CheckCircle2 className="h-8 w-8 text-green-600 mb-2" />
              <div className="text-3xl font-bold text-green-600">{problemasCorrectos}</div>
              <p className="text-sm text-muted-foreground">Correctos</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <XCircle className="h-8 w-8 text-red-600 mb-2" />
              <div className="text-3xl font-bold text-red-600">{problemasIncorrectos}</div>
              <p className="text-sm text-muted-foreground">Incorrectos</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Target className="h-8 w-8 text-blue-600 mb-2" />
              <div className="text-3xl font-bold text-blue-600">{precision}%</div>
              <p className="text-sm text-muted-foreground">Precisión</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Clock className="h-8 w-8 text-purple-600 mb-2" />
              <div className="text-3xl font-bold text-purple-600">{tiempoPromedio}s</div>
              <p className="text-sm text-muted-foreground">Tiempo promedio</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Análisis por operación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Análisis por Operación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(operacionesStats).map(([operacion, stats]) => {
            const porcentaje = Math.round((stats.correctas / stats.total) * 100);
            return (
              <div key={operacion} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{getOperacionNombre(operacion)}</span>
                  <span className="text-sm text-muted-foreground">
                    {stats.correctas}/{stats.total} ({porcentaje}%)
                  </span>
                </div>
                <Progress value={porcentaje} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Fortalezas y debilidades */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-700 flex items-center gap-2">
              <Award className="h-5 w-5" />
              Tu operación más fuerte
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-800">
              {getOperacionNombre(operacionMasFuerte.operacion)}
            </p>
            <p className="text-sm text-green-600">
              {Math.round(operacionMasFuerte.porcentaje)}% de precisión
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-700 flex items-center gap-2">
              <Target className="h-5 w-5" />
              Necesitas practicar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-800">
              {getOperacionNombre(operacionMasDebil.operacion)}
            </p>
            <p className="text-sm text-orange-600">
              {Math.round(operacionMasDebil.porcentaje)}% de precisión
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detalles de problemas */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Problemas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {resultados.map((resultado, index) => (
              <div
                key={resultado.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  resultado.esCorrecta ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {resultado.esCorrecta ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <div>
                    <p className="font-medium">
                      Problema {index + 1}: {getOperacionNombre(resultado.operacion)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {resultado.numero1} {resultado.operacion === 'SUMA' ? '+' : resultado.operacion === 'RESTA' ? '−' : resultado.operacion === 'MULTIPLICACION' ? '×' : '÷'} {resultado.numero2} = {resultado.resultado}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    {resultado.intentos} {resultado.intentos === 1 ? 'intento' : 'intentos'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {resultado.tiempoSegundos}s
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Botón continuar */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={onContinuar}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-12"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
