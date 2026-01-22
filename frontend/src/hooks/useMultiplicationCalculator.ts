import { useMemo } from 'react';

interface ProductoParcial {
  valor: number;
  valorStr: string;
  espacios: number; // celdas vacías a la derecha
}

interface MultiplicationResult {
  multiplicandoStr: string;   // solo para cálculo interno
  multiplicadorStr: string;   // solo para cálculo interno
  productosParciales: ProductoParcial[];
  resultadoStr: string;       // con punto decimal insertado
  totalDecimales: number;
}

/**
 * Contar decimales reales de un número
 */
function contarDecimales(num: number): number {
  const str = num.toString();
  if (!str.includes('.')) return 0;
  return str.split('.')[1].length;
}

/**
 * Usar normalización por string (sin errores de precisión)
 */
function normalizarDecimal(num: number, decimales: number): number {
  return Number(num.toFixed(decimales).replace('.', ''));
}


/**
 * Inserta el punto decimal según la cantidad total de decimales
 */
function insertarDecimal(valor: number, totalDecimales: number): string {
  let str = valor.toString();

  if (totalDecimales === 0) return str;

  const pos = str.length - totalDecimales;

  return pos > 0
    ? str.slice(0, pos) + '.' + str.slice(pos)
    : '0.' + '0'.repeat(Math.abs(pos)) + str;
}

/**
 * Calcula productos parciales para multiplicación larga
 */
function calcularProductosParciales(
  multiplicando: number,
  multiplicador: number
): MultiplicationResult {
  const dec1 = contarDecimales(multiplicando);
  const dec2 = contarDecimales(multiplicador);
  const totalDecimales = dec1 + dec2;

  // Normalización correcta
  const m1 = normalizarDecimal(multiplicando, dec1);
  const m2 = normalizarDecimal(multiplicador, dec2);

  const multiplicandoStr = m1.toString();
  const multiplicadorStr = m2.toString();

  const productosParciales: ProductoParcial[] = [];

  // Productos parciales (de unidades hacia arriba, como en el método tradicional)
  for (let i = multiplicadorStr.length - 1; i >= 0; i--) {
    const digito = parseInt(multiplicadorStr[i], 10);
    const producto = m1 * digito;
    const espacios = multiplicadorStr.length - 1 - i; // Unidades=0, decenas=1, centenas=2

    // NO hacemos padding porque los offsetCells ya proporcionan la alineación visual
    const valorStr = producto.toString();

    productosParciales.push({
      valor: producto,
      valorStr,
      espacios,
    });
  }

  // Resultado final
  const resultadoEntero = m1 * m2;
  const resultadoStr = insertarDecimal(resultadoEntero, totalDecimales);

  return {
    multiplicandoStr,
    multiplicadorStr,
    productosParciales,
    resultadoStr,
    totalDecimales,
  };
}

/**
 * Hook público
 */
export function useMultiplicationCalculator(
  multiplicando: number,
  multiplicador: number
) {
  return useMemo(
    () => calcularProductosParciales(multiplicando, multiplicador),
    [multiplicando, multiplicador]
  );
}
