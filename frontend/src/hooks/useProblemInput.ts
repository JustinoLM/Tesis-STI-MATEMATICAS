import { useState, useRef, useEffect, useCallback } from 'react';

export type InputDirection = 'left-to-right' | 'right-to-left';

interface UseProblemInputProps {
  showFeedback: boolean;
  direction?: InputDirection;
  problemKey?: string; // Para limpiar inputs al cambiar problema
  clearIncorrectTrigger?: number; // Trigger para limpiar incorrectos
  expectedValues?: { [key: string]: string }; // Valores esperados para validación
}

interface InputRefs {
  [key: string]: HTMLInputElement | null;
}

/**
 * Hook para manejar inputs de problemas matemáticos
 * Centraliza: estado, auto-focus, validación, limpieza
 */
export function useProblemInput({
  showFeedback: _showFeedback,
  direction: _direction = 'right-to-left',
  problemKey,
  clearIncorrectTrigger,
  expectedValues
}: UseProblemInputProps) {
  const [digitosRespuesta, setDigitosRespuesta] = useState<{ [key: string]: string }>({});
  const [focusedKey, setFocusedKey] = useState<string | null>(null);
  const inputRefs = useRef<InputRefs>({});

  // Limpiar inputs cuando cambia el problema
  useEffect(() => {
    setDigitosRespuesta({});
    setFocusedKey(null);
  }, [problemKey]);

  // Limpiar inputs incorrectos cuando cambia el trigger
  useEffect(() => {
    if (clearIncorrectTrigger && clearIncorrectTrigger > 0 && expectedValues) {
      setDigitosRespuesta(prev => {
        const newState: { [key: string]: string } = {};
        Object.keys(prev).forEach(key => {
          // Mantener solo si el valor es correcto
          if (expectedValues[key] && prev[key] === expectedValues[key]) {
            newState[key] = prev[key];
          }
        });
        return newState;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearIncorrectTrigger]);

  // Construir respuesta concatenada
  const getRespuestaCompleta = useCallback(() => {
    return Object.keys(digitosRespuesta)
      .sort()
      .map(key => digitosRespuesta[key])
      .join('');
  }, [digitosRespuesta]);

  // Manejar cambio de dígito con auto-focus
  const handleDigitChange = useCallback((
    key: string, 
    value: string, 
    nextKey?: string
  ) => {
    // Solo permitir dígitos y punto decimal
    if (value && !/^[0-9.]$/.test(value)) return;

    setDigitosRespuesta(prev => ({
      ...prev,
      [key]: value,
    }));

    // Auto-focus al siguiente input
    if (value && nextKey && inputRefs.current[nextKey]) {
      inputRefs.current[nextKey]?.focus();
    }
  }, []);

  // Validar si un dígito es correcto
  const isDigitCorrect = useCallback((
    key: string, 
    expectedValue: string
  ): boolean => {
    return digitosRespuesta[key] === expectedValue;
  }, [digitosRespuesta]);

  // Limpiar todos los inputs
  const clearInputs = useCallback(() => {
    setDigitosRespuesta({});
  }, []);

  // Limpiar solo los inputs incorrectos
  const clearIncorrectInputs = useCallback((expectedValues: { [key: string]: string }) => {
    setDigitosRespuesta(prev => {
      const newState: { [key: string]: string } = {};
      Object.keys(prev).forEach(key => {
        // Mantener solo si el valor es correcto
        if (expectedValues[key] && prev[key] === expectedValues[key]) {
          newState[key] = prev[key];
        }
      });
      return newState;
    });
  }, []);

  // Verificar si hay respuesta
  const hasAnswer = useCallback(() => {
    return Object.keys(digitosRespuesta).length > 0;
  }, [digitosRespuesta]);

  return {
    digitosRespuesta,
    focusedKey,
    inputRefs,
    setFocusedKey,
    handleDigitChange,
    getRespuestaCompleta,
    isDigitCorrect,
    clearInputs,
    clearIncorrectInputs,
    hasAnswer,
  };
}
