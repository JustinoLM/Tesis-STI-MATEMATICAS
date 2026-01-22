# Guía de Migración - ProblemGrid Refactorizado

## 📋 Resumen de Cambios

El componente `ProblemGrid.tsx` monolítico (~550 líneas) ha sido refactorizado en:

1. **3 Custom Hooks** - Lógica reutilizable
2. **6 Componentes Atómicos** - UI reutilizable
3. **3 Componentes Especializados** - Por operación
4. **1 Orquestador** - ProblemGrid simplificado (~60 líneas)

---

## 🔄 Cómo Migrar

### Opción 1: Migración Inmediata (Recomendada)

1. **Renombrar el archivo antiguo:**
```bash
mv ProblemGrid.tsx ProblemGrid.old.tsx
```

2. **Renombrar el nuevo orquestador:**
```bash
mv ProblemGridRefactored.tsx ProblemGrid.tsx
```

3. **Verificar imports en PracticePage.tsx:**
```tsx
// Debería seguir funcionando igual
import { ProblemGrid } from '@/components/problems/ProblemGrid';
```

4. **Probar la aplicación:**
```bash
npm run dev
```

5. **Si todo funciona, eliminar el antiguo:**
```bash
rm ProblemGrid.old.tsx
```

---

### Opción 2: Migración Gradual

Mantén ambos componentes y úsalos en paralelo:

```tsx
// En PracticePage.tsx
import { ProblemGrid } from '@/components/problems/ProblemGrid'; // Antiguo
import { ProblemGrid as ProblemGridNew } from '@/components/problems/ProblemGridRefactored'; // Nuevo

// Usa el antiguo por defecto
const Grid = useModoExperimental ? ProblemGridNew : ProblemGrid;

return <Grid {...props} />;
```

---

## 📦 Estructura Nueva

```
components/problems/
├── atoms/                    # Componentes reutilizables básicos
│   ├── DigitInput.tsx       # Input con feedback (68 líneas)
│   ├── DecimalPoint.tsx     # Punto decimal (19 líneas)
│   ├── CarrySpace.tsx       # Espacio llevadas (38 líneas)
│   ├── OperatorSymbol.tsx   # Símbolo operación (29 líneas)
│   ├── HorizontalLine.tsx   # Línea separadora (21 líneas)
│   ├── DigitRow.tsx         # Fila de inputs (93 líneas) ⭐
│   └── index.ts
│
├── SumaRestaGrid.tsx        # Suma/Resta (117 líneas)
├── MultiplicacionGrid.tsx   # Multiplicación (125 líneas)
├── DivisionGrid.tsx         # División (145 líneas)
├── ProblemGrid.tsx          # Orquestador (60 líneas) ⭐
│
├── HintModal.tsx
├── HintDisplay.tsx
└── index.ts
```

---

## ✅ Ventajas del Nuevo Sistema

### 1. **Mantenibilidad**
- Cada operación en su propio archivo
- Cambios aislados, sin afectar otras operaciones
- Código más fácil de entender

### 2. **Reutilización**
- DigitRow elimina ~40 líneas × 4 operaciones = 160 líneas
- Componentes atómicos usados en múltiples lugares
- Hooks compartidos entre componentes

### 3. **Testing**
```tsx
// Antes: Difícil testear operaciones individuales
describe('ProblemGrid', () => {
  // Tenías que testear todo junto
});

// Después: Tests aislados
describe('SumaRestaGrid', () => {
  it('renders suma correctly', () => {});
  it('handles decimal alignment', () => {});
});

describe('MultiplicacionGrid', () => {
  it('renders productos parciales', () => {});
});
```

### 4. **Performance**
- Solo se renderiza el componente de la operación actual
- Hooks memorizados con useMemo
- Menos re-renders innecesarios

---

## 🎯 API Idéntica

El componente `ProblemGrid` mantiene la **misma API**:

```tsx
<ProblemGrid
  operacion="SUMA"
  numero1={234.5}
  numero2={156.3}
  resultado={390.8}
  onAnswerChange={(answer) => setRespuesta(answer)}
  showFeedback={mostrarFeedback}
/>
```

**No necesitas cambiar nada en PracticePage.tsx** ✅

---

## 🐛 Troubleshooting

### Problema: Inputs no funcionan
**Solución:** Verifica que `useProblemInput` esté importado correctamente

### Problema: Productos parciales no se ven
**Solución:** Verifica que `useMultiplicationCalculator` retorne espacios correctos

### Problema: División no alinea correctamente
**Solución:** Verifica que `useDivisionCalculator` normalice decimales

### Problema: Build falla
**Solución:** 
```bash
# Limpiar y reinstalar
rm -rf node_modules dist
npm install
npm run build
```

---

## 📊 Métricas de Reducción

| Archivo Original | Líneas | Nuevo Sistema | Líneas | Reducción |
|------------------|--------|---------------|--------|-----------|
| ProblemGrid.tsx | ~550 | ProblemGrid.tsx | 60 | **89%** |
| - | - | SumaRestaGrid.tsx | 117 | - |
| - | - | MultiplicacionGrid.tsx | 125 | - |
| - | - | DivisionGrid.tsx | 145 | - |
| - | - | Atoms (6 archivos) | ~268 | - |
| **Total** | **550** | **Total Nuevo** | **715** | - |

**Nota:** Aunque el total de líneas aumenta (+165), el código es:
- ✅ Más modular
- ✅ Más reutilizable
- ✅ Más mantenible
- ✅ Más testeable

Las 165 líneas adicionales son **inversión en infraestructura reutilizable**.

---

## 🚀 Próximos Pasos

Una vez migrado, puedes:

1. **Agregar tests unitarios** por componente
2. **Optimizar DigitRow** para casos edge
3. **Agregar animaciones** a feedback visual
4. **Crear Storybook** para componentes atómicos
5. **Documentar props** con JSDoc

---

## 📝 Checklist de Migración

- [ ] Hacer backup del ProblemGrid.tsx original
- [ ] Renombrar ProblemGridRefactored.tsx → ProblemGrid.tsx
- [ ] Verificar imports en PracticePage.tsx
- [ ] Ejecutar `npm run build` sin errores
- [ ] Probar las 4 operaciones (suma, resta, multiplicación, división)
- [ ] Verificar feedback verde/rojo funciona
- [ ] Verificar auto-focus funciona
- [ ] Verificar decimales se alinean correctamente
- [ ] Commit cambios
- [ ] Eliminar ProblemGrid.old.tsx

**¡Listo para producción!** 🎉
