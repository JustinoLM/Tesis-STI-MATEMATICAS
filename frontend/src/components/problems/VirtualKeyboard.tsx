/**
 * Teclado numérico virtual.
 */

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Delete } from 'lucide-react';

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  onClear: () => void;
}

export function VirtualKeyboard({ onKeyPress, onDelete, onClear }: VirtualKeyboardProps) {
  const keys = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['0', '.', 'C'],
  ];

  return (
    <Card className="p-4 bg-gray-50">
      <div className="grid grid-cols-3 gap-2">
        {keys.flat().map((key) => {
          if (key === 'C') {
            return (
              <Button
                key={key}
                variant="destructive"
                size="lg"
                onClick={onClear}
                className="h-16 text-2xl"
              >
                {key}
              </Button>
            );
          }

          return (
            <Button
              key={key}
              variant="outline"
              size="lg"
              onClick={() => onKeyPress(key)}
              className="h-16 text-2xl font-bold hover:bg-blue-100"
            >
              {key}
            </Button>
          );
        })}
        
        {/* Botón de borrar (ocupa espacio completo abajo) */}
        <Button
          variant="secondary"
          size="lg"
          onClick={onDelete}
          className="col-span-3 h-16 text-xl"
        >
          <Delete className="h-6 w-6 mr-2" />
          Borrar
        </Button>
      </div>
    </Card>
  );
}
