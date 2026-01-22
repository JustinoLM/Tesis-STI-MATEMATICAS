/**
 * Página de desafío grupal.
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function GroupChallengePage() {
  // TODO: Obtener desafío grupal activo
  const desafioGrupal = {
    nombre: 'Resolver 500 problemas en grupo',
    progreso: 342,
    objetivo: 500,
    fechaLimite: '2024-01-31',
    recompensa: 'Medalla Grupal Dorada',
  };

  const porcentaje = Math.round((desafioGrupal.progreso / desafioGrupal.objetivo) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Users className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Desafío Grupal</h1>
      </div>
      
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-purple-600" />
            {desafioGrupal.nombre}
          </CardTitle>
          <CardDescription>
            Trabaja con tu grupo para completar este desafío
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Progreso</span>
              <span className="text-muted-foreground">
                {desafioGrupal.progreso} / {desafioGrupal.objetivo}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all"
                style={{ width: `${porcentaje}%` }}
              />
            </div>
            <p className="text-center text-sm font-bold text-purple-600 mt-2">
              {porcentaje}% completado
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm text-muted-foreground">Fecha límite</p>
              <p className="font-medium">{new Date(desafioGrupal.fechaLimite).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Recompensa</p>
              <p className="font-medium">{desafioGrupal.recompensa}</p>
            </div>
          </div>

          <Button className="w-full" size="lg">
            ¡Practicar para el grupo!
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contribución del Grupo</CardTitle>
          <CardDescription>Top 5 estudiantes</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Ranking de contribuciones - Implementación pendiente
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
