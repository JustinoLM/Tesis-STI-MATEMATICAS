import { cn } from '@/lib/utils';
import { Operacion } from '@/types';

interface OperatorSymbolProps {
  operacion: Operacion;
  className?: string;
}

const OPERATOR_MAP: Record<Operacion, string> = {
  SUMA: '+',
  RESTA: '−',
  MULTIPLICACION: '×',
  DIVISION: '÷',
};

/**
 * Símbolo visual de operación matemática
 * Mantiene consistencia en la presentación de operadores
 */
export function OperatorSymbol({ operacion, className }: OperatorSymbolProps) {
  return (
    <span
      className={cn(
        'text-2xl font-bold text-gray-700',
        className
      )}
    >
      {OPERATOR_MAP[operacion]}
    </span>
  );
}
