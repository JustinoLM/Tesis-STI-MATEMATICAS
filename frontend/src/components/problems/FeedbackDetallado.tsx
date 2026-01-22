/**
 * Componente para mostrar feedback detallado de la respuesta
 * Muestra qué pasos están correctos e incorrectos
 */

import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FeedbackDetalladoProps {
  esCorrecta: boolean;
  resultadoCorrecto: boolean;
  pasosIntermediosCorrectos?: boolean;
  operacion: string;
}

export function FeedbackDetallado({
  esCorrecta,
  resultadoCorrecto,
  pasosIntermediosCorrectos = true,
  operacion,
}: FeedbackDetalladoProps) {
  // Si todo está correcto, no mostrar detalles adicionales
  if (esCorrecta) {
    return null;
  }

  // Si el resultado final está mal
  if (!resultadoCorrecto) {
    return (
      <Alert className="border-orange-300 bg-orange-50">
        <AlertCircle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <span className="font-semibold">Resultado incorrecto.</span>{' '}
          Revisa tus cálculos y verifica cada paso.
        </AlertDescription>
      </Alert>
    );
  }

  // Si hay pasos intermedios incorrectos (multiplicación/división)
  if (!pasosIntermediosCorrectos) {
    const mensaje =
      operacion === 'MULTIPLICACION'
        ? 'El resultado final es correcto, pero uno o más productos parciales están incorrectos.'
        : 'El cociente es correcto, pero hay errores en los pasos de la división.';

    return (
      <Alert className="border-yellow-300 bg-yellow-50">
        <AlertCircle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          <span className="font-semibold">Pasos intermedios incorrectos.</span>{' '}
          {mensaje}
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}

interface FeedbackIconoProps {
  correcto: boolean;
  size?: number;
}

/**
 * Icono simple de check/cross para feedback visual
 */
export function FeedbackIcono({ correcto, size = 16 }: FeedbackIconoProps) {
  return correcto ? (
    <CheckCircle2 className="text-green-600" size={size} />
  ) : (
    <XCircle className="text-red-600" size={size} />
  );
}
