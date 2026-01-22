import { cn } from '@/lib/utils';

interface DecimalPointProps {
  className?: string;
}

/**
 * Punto decimal visual que ocupa el mismo espacio que un input
 * Para mantener alineación en operaciones con decimales
 */
export function DecimalPoint({ className }: DecimalPointProps) {
  return (
    <span
      className={cn(
        'w-10 h-10 flex items-center justify-center text-2xl font-bold',
        className
      )}
    >
      .
    </span>
  );
}
