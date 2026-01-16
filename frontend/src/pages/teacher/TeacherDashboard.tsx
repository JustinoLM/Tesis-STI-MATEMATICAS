/**
 * Dashboard del profesor.
 */

import { StatCard } from '@/components/shared/StatCard';
import { Users, Target, AlertCircle, TrendingUp } from 'lucide-react';

export function TeacherDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard del Profesor</h1>
        <p className="text-muted-foreground">Visión general de tus grupos</p>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Estudiantes"
          value="45"
          description="En 3 grupos activos"
          icon={Users}
        />
        <StatCard
          title="Desafíos Activos"
          value="5"
          description="2 próximos a completar"
          icon={Target}
        />
        <StatCard
          title="Alertas"
          value="8"
          description="Requieren atención"
          icon={AlertCircle}
        />
        <StatCard
          title="Progreso Promedio"
          value="78%"
          description="+5% esta semana"
          icon={TrendingUp}
        />
      </div>

      <p className="text-sm text-muted-foreground mt-8">
        Implementación completa pendiente en 4.4.5
      </p>
    </div>
  );
}
