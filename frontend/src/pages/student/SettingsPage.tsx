/**
 * Página de configuración y personalización.
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings, Palette, Volume2, Bell } from 'lucide-react';

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Configuración</h1>
      </div>
      
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Personalización Visual
            </CardTitle>
            <CardDescription>
              Cambia temas, fondos y colores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Implementación en subsección 4.4.6
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Audio
            </CardTitle>
            <CardDescription>
              Música y efectos de sonido
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Implementación en subsección 4.4.6
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificaciones
            </CardTitle>
            <CardDescription>
              Alertas de desafíos y logros
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Implementación en subsección 4.4.6
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
