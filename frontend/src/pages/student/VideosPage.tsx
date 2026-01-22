/**
 * Página de videos educativos guardados.
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Video } from 'lucide-react';

export function VideosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Video className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Mis Videos</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Videos Guardados</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Aquí aparecerán los videos educativos que guardes durante la práctica.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Implementación completa en subsección 4.4.4
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
