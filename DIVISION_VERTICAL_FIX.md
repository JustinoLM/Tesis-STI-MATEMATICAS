# Corrección: División Vertical con Decimales

## Problema Original
La división vertical con decimales (ej: 12.5 ÷ 5 = 2.5) no mostraba correctamente la alineación de los pasos intermedios porque intentaba alinear con el dividendo original que incluía el punto decimal.

## Solución Implementada

### Enfoque Pedagógico
En lugar de intentar alinear los pasos con el dividendo original (12.5), mostramos explícitamente:

1. **División original** con decimales: `12.5 ÷ 5 = [2][.][5]`
2. **Normalización del dividendo**: `125` (multiplicando por 10)
3. **Todos los pasos** alineados con el dividendo normalizado (sin punto decimal)

### Ejemplo Visual
```
12.5 ÷ 5 = [2][.][5]

Normalizamos (×10):
[1][2][5]
---------
[1][0]        ← paso 1: producto (2×5=10)
__[2]         ← paso 1: residuo

__[2][5]      ← paso 2: dividendo parcial (bajamos 5, formamos 25)
__[2][5]      ← paso 2: producto (5×5=25)
------
____[0]       ← paso 2: residuo final
```

### Cambios en el Código

#### 1. Hook `useDivisionCalculator.ts`
- **Agregado**: Campo `dividendoParcialStr` y `espaciosDividendoParcial` en `DivisionStep`
- **Modificado**: `calcularPasosDivision` ahora guarda el dividendo parcial (residuoActual) antes de restar
- **Eliminado**: Función `calcularOffsetsVisuales` (ya no es necesaria)
- Los offsets se calculan directamente respecto al dividendo normalizado

#### 2. Componente `DivisionGrid.tsx`
- **Agregado**: Detección de método vertical (`esMetodoVertical`)
- **Agregado**: Sección "Normalizamos (×10)" que muestra el dividendo escalado
- **Agregado**: Fila de dividendo parcial en pasos subsecuentes (idx > 0)
- **Estructura de pasos**:
  - Dividendo parcial (solo pasos 2+)
  - Producto
  - Línea horizontal
  - Residuo

#### 3. Componente `HorizontalLine.tsx`
- **Agregado**: Prop `marginLeft` para alinear la línea con el producto

### Ventajas Pedagógicas

1. **Transparencia**: El estudiante ve explícitamente la transformación 12.5 → 125
2. **Claridad**: No hay confusión sobre "saltar" el punto decimal en los pasos
3. **Método estándar**: Enseña el método correcto (escalar, dividir, ajustar cociente)
4. **Menos errores**: Alineación simple sin considerar caracteres especiales

### Cálculo de Offsets

Para cada paso, los offsets se calculan como:
```typescript
offsetProducto = posicionDividendo - producto.toString().length
offsetResiduo = posicionDividendo - residuo.toString().length
offsetDividendoParcial = posicionDividendo - dividendoParcial.toString().length
```

Donde `posicionDividendo` es cuántos dígitos del dividendo normalizado se han bajado.

**Ejemplo 12.5 ÷ 5**:
- Dividendo normalizado: "125" (3 dígitos)
- Paso 1: posición=2, producto="10" → offset=0, residuo="2" → offset=1
- Paso 2: posición=3, parcial="25" → offset=1, producto="25" → offset=1, residuo="0" → offset=2

### Testing
Para probar, usar casos:
- `12.5 ÷ 5 = 2.5` ✓
- `3.6 ÷ 2 = 1.8`
- `15.75 ÷ 5 = 3.15`
- `100.5 ÷ 5 = 20.1`

### Métodos de División Soportados

1. **Vertical** (dividendo con decimales, divisor sin decimales): Usa normalización mostrada
2. **Normalización** (divisor con decimales): Normaliza ambos números
3. **Escalamiento** (ambos naturales o cociente decimal): Método simple

---

**Fecha**: 2026-01-18
**Archivos modificados**:
- `frontend/src/hooks/useDivisionCalculator.ts`
- `frontend/src/components/problems/DivisionGrid.tsx`
- `frontend/src/components/problems/atoms/HorizontalLine.tsx`
