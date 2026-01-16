/**
 * Dashboard del estudiante.
 */

import { StatCard } from '@/components/shared/StatCard';
import { Button } from '@/components/ui/button';
import { BookOpen, Target, Trophy, Zap } from 'lucide-react';

export function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bienvenido</h1>
        <p className="text-muted-foreground">Listo para practicar matemáticas</p>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Nivel Actual"
          value="3"
          description="De 5 niveles"
          icon={Target}
        />
        <StatCard
          title="Puntos"
          value="1,250"
          description="+50 hoy"
          icon={Zap}
        />
        <StatCard
          title="Precisión"
          value="85%"
          description="Últimos 15 problemas"
          icon={BookOpen}
        />
        <StatCard
          title="Medallas"
          value="12"
          description="3 nuevas esta semana"
          icon={Trophy}
        />
      </div>

      {/* Acción principal */}
      <div className="flex justify-center pt-8">
        <Button size="lg" className="text-lg px-12">
          <BookOpen className="mr-2 h-5 w-5" />
          Comenzar Práctica
        </Button>
      </div>
    </div>
  );
}
