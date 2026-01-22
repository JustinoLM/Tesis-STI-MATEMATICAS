/**
 * Grid de problema matemático - Orquestador
 * Delega a componentes especializados según el tipo de operación
 */

import { Operacion } from '@/types';
import { SumaRestaGrid } from './SumaRestaGrid';
import { MultiplicacionGrid } from './MultiplicacionGrid';
import { DivisionGrid } from './DivisionGrid';

interface ProblemGridProps {
  operacion: Operacion;
  numero1: number;
  numero2: number;
  resultado: number;
  onAnswerChange: (answer: string) => void;
  showFeedback: boolean;
  clearIncorrectTrigger?: number;
}

export function ProblemGrid({
  operacion,
  numero1,
  numero2,
  resultado,
  onAnswerChange,
  showFeedback,
  clearIncorrectTrigger,
}: ProblemGridProps) {
  return (
    <div className="bg-white p-8 rounded-lg border-2 border-gray-200">
      {(operacion === 'SUMA' || operacion === 'RESTA') && (
        <SumaRestaGrid
          key={`${operacion}-${numero1}-${numero2}`}
          operacion={operacion}
          numero1={numero1}
          numero2={numero2}
          resultado={resultado}
          onAnswerChange={onAnswerChange}
          showFeedback={showFeedback}
          clearIncorrectTrigger={clearIncorrectTrigger}
        />
      )}

      {operacion === 'MULTIPLICACION' && (
        <MultiplicacionGrid
          key={`MULTIPLICACION-${numero1}-${numero2}`}
          numero1={numero1}
          numero2={numero2}
          onAnswerChange={onAnswerChange}
          showFeedback={showFeedback}
          clearIncorrectTrigger={clearIncorrectTrigger}
        />
      )}

      {operacion === 'DIVISION' && (
        <DivisionGrid
          key={`DIVISION-${numero1}-${numero2}`}
          numero1={numero1}
          numero2={numero2}
          resultado={resultado}
          onAnswerChange={onAnswerChange}
          showFeedback={showFeedback}
          clearIncorrectTrigger={clearIncorrectTrigger}
        />
      )}
    </div>
  );
}
