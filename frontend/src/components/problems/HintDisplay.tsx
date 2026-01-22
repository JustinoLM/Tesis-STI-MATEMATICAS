/**
 * Ventana emergente para mostrar contenido de pista.
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HintDisplayProps {
  open: boolean;
  onClose: () => void;
  nivel: 1 | 2 | 3;
  contenido: string;
}

export function HintDisplay({ open, onClose, nivel, contenido }: HintDisplayProps) {
  const colores = {
    1: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
    2: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
    3: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
  };

  const color = colores[nivel];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className={`h-5 w-5 ${color.text}`} />
            Pista Nivel {nivel}
          </DialogTitle>
        </DialogHeader>

        <Alert className={`${color.bg} ${color.border}`}>
          <AlertDescription className="text-base">
            {contenido}
          </AlertDescription>
        </Alert>

        <Button onClick={onClose} className="w-full">
          Entendido
        </Button>
      </DialogContent>
    </Dialog>
  );
}
