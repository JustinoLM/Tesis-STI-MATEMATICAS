/**
 * Página de desafío grupal destacado.
 * Muestra el desafío grupal activo más reciente del estudiante.
 */

import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Users, Trophy, Target, Clock, Gift, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { studentService } from '@/services/studentService';

export function GroupChallengePage() {
  const { data: desafios = [], isLoading, isError } = useQuery({
    queryKey: ['desafios-estudiante'],
    queryFn: () => studentService.getDesafios(),
    staleTime: 2 * 60 * 1000,
  });

  // Mostrar el primer desafío activo (no expirado, no completado)
  const desafio =
    desafios.find((d) => !d.esta_expirado && !(d.grupo_completado || d.completado)) ??
    desafios[0];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
        <p className="text-muted-foreground">Cargando desafío...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Desafío Grupal</h1>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="font-medium">No se pudo cargar el desafío</p>
            <p className="text-sm text-muted-foreground">Intenta recargar la página.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!desafio) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Desafío Grupal</h1>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <Trophy className="h-12 w-12 text-muted-foreground/40" />
            <p className="text-lg font-semibold">Sin desafíos activos</p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Tu profesor aún no ha creado desafíos para tu grupo. ¡Sigue practicando!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const terminado = desafio.grupo_completado || desafio.completado;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Desafío Grupal</h1>
        </div>
        <Link to="/student/challenges">
          <Button variant="outline" size="sm">Ver todos</Button>
        </Link>
      </div>

      <Card
        className={`border-2 ${
          terminado
            ? 'border-green-300 bg-green-50/30'
            : 'border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50'
        }`}
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy
                  className={`h-5 w-5 ${terminado ? 'text-green-600' : 'text-purple-600'}`}
                />
                {desafio.nombre}
              </CardTitle>
              <CardDescription className="mt-1">
                {desafio.descripcion ?? 'Trabaja con tu grupo para completar este desafío'}
              </CardDescription>
            </div>
            {terminado ? (
              <Badge className="bg-green-100 text-green-800 border-green-300 shrink-0">
                ¡Completado!
              </Badge>
            ) : desafio.dias_restantes != null ? (
              <Badge
                variant={desafio.dias_restantes <= 2 ? 'destructive' : 'outline'}
                className="shrink-0"
              >
                {desafio.dias_restantes === 0
                  ? 'Último día'
                  : `${desafio.dias_restantes}d restantes`}
              </Badge>
            ) : (
              <Badge variant="outline" className="shrink-0">
                Sin límite
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Barra de progreso */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Progreso del grupo</span>
              <span className="text-muted-foreground tabular-nums">
                {desafio.progreso_actual} / {desafio.objetivo_cantidad}
              </span>
            </div>
            <Progress
              value={desafio.porcentaje}
              className={`h-4 ${
                terminado
                  ? '[&>div]:bg-green-500'
                  : '[&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-pink-500'
              }`}
            />
            <p
              className={`text-center text-sm font-bold mt-2 ${
                terminado ? 'text-green-600' : 'text-purple-600'
              }`}
            >
              {desafio.porcentaje.toFixed(1)}% completado
            </p>
          </div>

          {/* Detalles */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="flex items-start gap-2">
              <Target className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Grupo</p>
                <p className="text-sm font-medium">{desafio.grupo_nombre}</p>
              </div>
            </div>
            {desafio.fecha_limite && (
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Fecha límite</p>
                  <p className="text-sm font-medium">
                    {new Date(desafio.fecha_limite).toLocaleDateString('es-CO', {
                      day: 'numeric',
                      month: 'long',
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Recompensa */}
          {desafio.recompensa_texto && (
            <div className="flex items-start gap-2 rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-sm text-amber-800">
              <Gift className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{desafio.recompensa_texto}</span>
            </div>
          )}

          {/* CTA */}
          {!terminado && (
            <Link to="/student/practice">
              <Button
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                size="lg"
              >
                ¡Practicar para el grupo!
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>

      {/* Link a todos los desafíos */}
      {desafios.length > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {desafios.length - 1} desafío{desafios.length - 1 !== 1 ? 's' : ''} más disponible
            {desafios.length - 1 !== 1 ? 's' : ''}
          </p>
          <Link to="/student/challenges">
            <Button variant="link" size="sm">
              Ver todos →
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
