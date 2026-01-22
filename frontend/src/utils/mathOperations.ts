/**
 * Utilidades para operaciones matemáticas
 * Funciones puras para cálculos de división, multiplicación, suma y resta
 */

// ========================================
// TIPOS
// ========================================

export interface PasoDivision {
  productoStr: string;
  residuoStr: string;
  espaciosProducto: number;
  espaciosResiduo: number;
}

export interface ProductoParcial {
  valor: number;
  posicion: number; // Cuántos espacios a la derecha
}

// ========================================
// NORMALIZACIÓN Y ALINEACIÓN
// ========================================

/**
 * Normaliza dos números eliminando decimales
 * Ejemplo: 12.5, 2.5 → 125, 25
 */
export const normalizarDecimales = (dividendo: number, divisor: number) => {
  const d1 = dividendo.toString();
  const d2 = divisor.toString();
  
  const dec1 = d1.includes('.') ? d1.split('.')[1].length : 0;
  const dec2 = d2.includes('.') ? d2.split('.')[1].length : 0;
  
  const factor = Math.pow(10, Math.max(dec1, dec2));
  
  return {
    dividendoN: Math.round(dividendo * factor),
    divisorN: Math.round(divisor * factor),
    factor
  };
};

/**
 * Alinea dos números decimales agregando ceros
 * Ejemplo: 500.75, 234.5 → 500.75, 234.50
 */
export const alinearDecimales = (num1: number, num2: number) => {
  const str1 = num1.toString();
  const str2 = num2.toString();
  
  const partes1 = str1.split('.');
  const partes2 = str2.split('.');
  
  const entero1 = partes1[0];
  const decimal1 = partes1[1] || '';
  const entero2 = partes2[0];
  const decimal2 = partes2[1] || '';
  
  const maxDecimales = Math.max(decimal1.length, decimal2.length);
  const maxEnteros = Math.max(entero1.length, entero2.length);
  
  return {
    num1Alineado: entero1.padStart(maxEnteros, ' ') + 
                  (maxDecimales > 0 ? '.' : '') + 
                  decimal1.padEnd(maxDecimales, '0'),
    num2Alineado: entero2.padStart(maxEnteros, ' ') + 
                  (maxDecimales > 0 ? '.' : '') + 
                  decimal2.padEnd(maxDecimales, '0'),
    maxDecimales,
    maxEnteros
  };
};

// ========================================
// CÁLCULO DE PASOS - DIVISIÓN
// ========================================

/**
 * Calcula todos los pasos de una división larga
 * Retorna array de pasos con productos, residuos y espaciado
 */
export const calcularPasosDivision = (
  dividendoOriginal: number,
  divisorOriginal: number,
  cocienteEsperado: number
): { pasos: PasoDivision[]; cocienteStr: string } => {
  // Normalizar (eliminar decimales)
  const { dividendoN, divisorN } = normalizarDecimales(dividendoOriginal, divisorOriginal);
  
  const dividendoStr = dividendoN.toString();
  const cocienteEsperadoStr = cocienteEsperado.toString();
  const digitosTotalesEsperados = cocienteEsperadoStr.replace('.', '').length;
  const MAX_DECIMALES = 2;
  
  const pasos: PasoDivision[] = [];
  let cocienteStr = '';
  let residuo = 0;
  let digitosAcumulados = 0;
  let espacioAcumulado = 0;
  let puntoInsertado = false;
  let decimalesGenerados = 0;
  
  while (
    cocienteStr.replace('.', '').length < digitosTotalesEsperados || 
    (residuo !== 0 && decimalesGenerados < MAX_DECIMALES)
  ) {
    // Agregar punto decimal si es necesario
    if (digitosAcumulados >= dividendoStr.length && residuo !== 0 && !puntoInsertado) {
      cocienteStr += '.';
      puntoInsertado = true;
    }
    
    // Obtener siguiente dígito o bajar cero
    if (digitosAcumulados < dividendoStr.length) {
      if (cocienteStr === '') {
        // Primer paso: determinar cuántos dígitos necesitamos
        let digitos = 1;
        let valor = parseInt(dividendoStr.substring(0, digitos));
        while (valor < divisorN && digitos < dividendoStr.length) {
          digitos++;
          valor = parseInt(dividendoStr.substring(0, digitos));
        }
        digitosAcumulados = digitos;
        residuo = valor;
      } else {
        // Bajar siguiente dígito
        const siguienteDigito = parseInt(dividendoStr[digitosAcumulados]);
        residuo = residuo * 10 + siguienteDigito;
        digitosAcumulados++;
      }
    } else {
      // Bajar cero (modo decimal)
      residuo = residuo * 10;
      decimalesGenerados++;
    }
    
    // Calcular dígito del cociente
    const digitoCociente = Math.floor(residuo / divisorN);
    cocienteStr += digitoCociente.toString();
    
    const producto = digitoCociente * divisorN;
    const residuoTrasResta = residuo - producto;
    
    // Preparar siguiente residuo
    let residuoConDigitoBajado: number;
    let residuoStrDisplay: string;
    
    if (digitosAcumulados < dividendoStr.length) {
      const siguienteDigito = parseInt(dividendoStr[digitosAcumulados]);
      residuoConDigitoBajado = residuoTrasResta * 10 + siguienteDigito;
      residuoStrDisplay = residuoConDigitoBajado.toString();
      digitosAcumulados++;
    } else if (residuoTrasResta !== 0 && decimalesGenerados < MAX_DECIMALES) {
      residuoConDigitoBajado = residuoTrasResta * 10;
      residuoStrDisplay = residuoConDigitoBajado.toString();
      decimalesGenerados++;
    } else {
      residuoConDigitoBajado = residuoTrasResta;
      residuoStrDisplay = residuoTrasResta === 0 
        ? '00' 
        : (residuoTrasResta * 10).toString().padStart(2, '0');
    }
    
    const productoStr = producto.toString();
    const espaciosProducto = pasos.length === 0 ? 0 : espacioAcumulado;
    const espaciosResiduo = pasos.length === 0 
      ? Math.max(0, productoStr.length - residuoStrDisplay.length)
      : espacioAcumulado + Math.max(0, productoStr.length - residuoStrDisplay.length);
    
    pasos.push({
      productoStr,
      residuoStr: residuoStrDisplay,
      espaciosProducto,
      espaciosResiduo,
    });
    
    // Actualizar espacio acumulado
    if (pasos.length === 1) {
      espacioAcumulado = Math.max(0, productoStr.length - residuoStrDisplay.length) + 1;
    } else {
      espacioAcumulado += 1;
    }
    
    residuo = residuoConDigitoBajado;
    
    // Terminar si llegamos al cociente esperado y residuo es 0
    if (cocienteStr.replace('.', '').length >= digitosTotalesEsperados && residuo === 0) {
      break;
    }
  }
  
  return { pasos, cocienteStr };
};

// ========================================
// CÁLCULO DE PRODUCTOS PARCIALES - MULTIPLICACIÓN
// ========================================

/**
 * Calcula los productos parciales de una multiplicación
 * Retorna array de productos con su posición (corrimiento)
 */
export const calcularProductosParciales = (
  multiplicando: number,
  multiplicador: number
): ProductoParcial[] => {
  const multiplicandoStr = multiplicando.toString().replace('.', '');
  const multiplicadorStr = multiplicador.toString().replace('.', '');
  
  const productos: ProductoParcial[] = [];
  
  // Para cada dígito del multiplicador (de derecha a izquierda)
  for (let i = multiplicadorStr.length - 1; i >= 0; i--) {
    const digito = parseInt(multiplicadorStr[i]);
    const posicion = multiplicadorStr.length - 1 - i;
    const producto = parseInt(multiplicandoStr) * digito;
    
    productos.push({
      valor: producto,
      posicion
    });
  }
  
  return productos;
};
