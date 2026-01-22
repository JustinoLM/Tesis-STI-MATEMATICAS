/**
 * Página de desafíos individuales.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';

export function ChallengesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Target className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Mis Desafíos</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Desafíos Personales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Aquí verás los desafíos que tu profesor te asigne personalmente.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Implementación completa en subsección 4.4.4
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
