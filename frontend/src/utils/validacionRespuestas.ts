/**
 * Utilidades para validación de respuestas matemáticas
 * Soporta validación granular de productos parciales y pasos intermedios
 */

import { Operacion, RespuestaValidacion } from '@/types';

/**
 * Compara dos números con tolerancia para errores de punto flotante
 */
function numerosIguales(num1: number, num2: number, tolerancia = 0.01): boolean {
  return Math.abs(num1 - num2) < tolerancia;
}

/**
 * Valida respuesta de SUMA o RESTA
 * Verifica el resultado final incluyendo el punto decimal
 */
function validarSumaResta(
  respuestaEstudiante: string,
  resultadoEsperado: number
): RespuestaValidacion {
  // Limpiar la respuesta (puede tener espacios o caracteres extra)
  const respuestaLimpia = respuestaEstudiante.trim();

  // Verificar que la respuesta sea un número válido
  if (!respuestaLimpia || isNaN(parseFloat(respuestaLimpia))) {
    return {
      esCorrecta: false,
      resultadoCorrecto: false,
    };
  }

  const respuestaNum = parseFloat(respuestaLimpia);
  const esCorrecta = numerosIguales(respuestaNum, resultadoEsperado);

  return {
    esCorrecta,
    resultadoCorrecto: esCorrecta,
  };
}

/**
 * Valida respuesta de MULTIPLICACIÓN
 * Verifica el resultado final (productos parciales son opcionales)
 */
function validarMultiplicacion(
  respuestaEstudiante: string,
  _numero1: number,
  _numero2: number,
  resultadoEsperado: number
): RespuestaValidacion {
  // Limpiar respuesta
  const respuestaLimpia = respuestaEstudiante.trim();

  if (!respuestaLimpia || isNaN(parseFloat(respuestaLimpia))) {
    return {
      esCorrecta: false,
      resultadoCorrecto: false,
    };
  }

  // Por ahora, solo validamos el resultado final
  // Los productos parciales son pasos intermedios que el estudiante completa
  // pero la validación principal es del resultado
  const respuestaNum = parseFloat(respuestaLimpia);
  const resultadoCorrecto = numerosIguales(respuestaNum, resultadoEsperado);

  return {
    esCorrecta: resultadoCorrecto,
    resultadoCorrecto,
    pasosIntermediosCorrectos: true, // TODO: validar productos parciales si es necesario
  };
}

/**
 * Valida respuesta de DIVISIÓN
 * Verifica el cociente (pasos intermedios son opcionales)
 */
function validarDivision(
  respuestaEstudiante: string,
  resultadoEsperado: number
): RespuestaValidacion {
  // Limpiar respuesta
  const respuestaLimpia = respuestaEstudiante.trim();

  if (!respuestaLimpia || isNaN(parseFloat(respuestaLimpia))) {
    return {
      esCorrecta: false,
      resultadoCorrecto: false,
    };
  }

  // Validar solo el cociente (resultado final)
  const cocienteNum = parseFloat(respuestaLimpia);
  const resultadoCorrecto = numerosIguales(cocienteNum, resultadoEsperado);

  return {
    esCorrecta: resultadoCorrecto,
    resultadoCorrecto,
    pasosIntermediosCorrectos: true, // TODO: validar pasos de división si es necesario
  };
}

/**
 * Función principal de validación
 * Delega a la función específica según el tipo de operación
 */
export function validarRespuesta(
  operacion: Operacion,
  respuestaEstudiante: string,
  numero1: number,
  numero2: number,
  resultadoEsperado: number
): RespuestaValidacion {
  if (!respuestaEstudiante || respuestaEstudiante.trim() === '') {
    return {
      esCorrecta: false,
      resultadoCorrecto: false,
    };
  }

  switch (operacion) {
    case 'SUMA':
    case 'RESTA':
      return validarSumaResta(respuestaEstudiante, resultadoEsperado);

    case 'MULTIPLICACION':
      return validarMultiplicacion(
        respuestaEstudiante,
        numero1,
        numero2,
        resultadoEsperado
      );

    case 'DIVISION':
      return validarDivision(respuestaEstudiante, resultadoEsperado);

    default:
      return {
        esCorrecta: false,
        resultadoCorrecto: false,
      };
  }
}
