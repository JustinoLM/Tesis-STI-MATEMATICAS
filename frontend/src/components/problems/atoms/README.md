# Componentes Atómicos - Problems

Componentes reutilizables de bajo nivel para grids de problemas matemáticos.

## Componentes

### `DigitInput`
Input individual para un dígito con feedback visual automático.

**Props:**
- `value: string` - Valor actual
- `expectedValue: string` - Valor esperado para validación
- `onChange: (value: string) => void` - Callback de cambio
- `showFeedback?: boolean` - Mostrar feedback verde/rojo
- `isFocused?: boolean` - Estado de focus
- `disabled?: boolean` - Deshabilitar input

**Uso:**
```tsx
<DigitInput
  value={digitosRespuesta['resultado-0']}
  expectedValue="5"
  onChange={(val) => handleChange('resultado-0', val)}
  showFeedback={mostrarFeedback}
  isFocused={focusedKey === 'resultado-0'}
/>
```

---

### `DecimalPoint`
Punto decimal visual que mantiene el espaciado consistente.

**Uso:**
```tsx
<DecimalPoint />
```

---

### `CarrySpace`
Input pequeño para números de llevada.

**Props:**
- `value: string` - Valor de la llevada
- `onChange: (value: string) => void` - Callback de cambio
- `disabled?: boolean` - Deshabilitar input

**Uso:**
```tsx
<CarrySpace
  value={llevadas['carry-2']}
  onChange={(val) => handleCarryChange('carry-2', val)}
/>
```

---

### `OperatorSymbol`
Símbolo visual de operación matemática.

**Props:**
- `operacion: Operacion` - SUMA | RESTA | MULTIPLICACION | DIVISION

**Uso:**
```tsx
<OperatorSymbol operacion="SUMA" />
```

---

### `HorizontalLine`
Línea horizontal separadora.

**Props:**
- `width?: number | string` - Ancho de la línea
- `className?: string` - Clases adicionales

**Uso:**
```tsx
<HorizontalLine width={200} />
<HorizontalLine width="100%" />
```

---

### `DigitRow`
Fila completa de inputs con manejo automático de decimales y auto-focus.

**Props:**
- `expectedValue: string` - String completo esperado (ej: "123.45")
- `digitosRespuesta: { [key: string]: string }` - Estado de respuestas
- `keyPrefix: string` - Prefijo para keys de inputs
- `inputRefs: MutableRefObject` - Referencias a inputs
- `focusedKey: string | null` - Key del input con focus
- `showFeedback: boolean` - Mostrar feedback
- `onDigitChange: Function` - Callback de cambio
- `direction?: 'left-to-right' | 'right-to-left'` - Dirección de auto-focus
- `paddingLeft?: number` - Espaciado izquierdo en px

**Uso:**
```tsx
<DigitRow
  expectedValue="123.45"
  digitosRespuesta={digitosRespuesta}
  keyPrefix="resultado"
  inputRefs={inputRefs}
  focusedKey={focusedKey}
  showFeedback={showFeedback}
  onDigitChange={handleDigitChange}
  onFocus={setFocusedKey}
  onBlur={() => setFocusedKey(null)}
  direction="right-to-left"
  paddingLeft={44}
/>
```

---

## Ventajas

✅ **Consistencia visual** - Todos los inputs se ven y comportan igual  
✅ **Menos código** - Reutilización en lugar de duplicación  
✅ **Fácil mantenimiento** - Cambios en un solo lugar  
✅ **Type-safe** - TypeScript completo  
✅ **Composable** - Se pueden combinar fácilmente
