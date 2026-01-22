# Contexto Rápido del Proyecto

## Estado Actual (17 Enero 2026)

### ✅ Completado
- Frontend base con React 18 + TypeScript + Vite
- Sistema de rutas protegidas
- Login mock (para desarrollo sin backend)
- Refactorización completa de ProblemGrid (FASE 2-4):
  - 3 custom hooks (useProblemInput, useDivisionCalculator, useMultiplicationCalculator)
  - 6 componentes atómicos (DigitInput, DigitRow, DecimalPoint, etc.)
  - 3 componentes especializados (SumaRestaGrid, MultiplicacionGrid, DivisionGrid)
- Sistema de hints con 3 niveles
- Feedback visual (verde/rojo) en inputs
- Auto-focus inteligente (derecha→izquierda para suma/resta/mult, izquierda→derecha para división)
- Soporte completo para decimales en las 4 operaciones

### 🚧 En Progreso
- Nada actualmente

### 📋 Próximo (Prioridad)
1. Interfaz del profesor (sección 4.4.5 de tesis)
2. Sistema de personalización (sección 4.4.6)
3. Integración con backend (sección 4.4.7)

## Estructura del Proyecto

```
Proyecto/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/           # Header, Sidebar, MainLayout
│   │   │   ├── problems/         # Componentes de práctica
│   │   │   │   ├── atoms/        # Componentes reutilizables básicos
│   │   │   │   ├── SumaRestaGrid.tsx
│   │   │   │   ├── MultiplicacionGrid.tsx
│   │   │   │   ├── DivisionGrid.tsx
│   │   │   │   └── ProblemGrid.tsx (orquestador)
│   │   │   └── ui/               # shadcn/ui components
│   │   ├── hooks/                # Custom hooks
│   │   ├── pages/
│   │   │   ├── student/          # Páginas del estudiante
│   │   │   └── teacher/          # Páginas del profesor (stubs)
│   │   ├── services/             # API calls
│   │   ├── store/                # Zustand stores
│   │   ├── types/                # TypeScript types
│   │   └── utils/                # Utilities
│   └── package.json
│
├── backend/                      # (tu stack backend)
│
├── docs/                         # Documentación generada
│
└── .claude/                      # Configuración de agentes
    ├── coder-agent.md           # Agente para codificar
    ├── docs-agent.md            # Agente para documentar
    └── README.md                # Guía de uso

PDFs en el proyecto Claude:
- Capitulo_III.pdf               # Especificaciones técnicas (Cap 4)
- Capitulos_I__II.pdf            # Marco teórico
- RESUMEN_EJECUTIVO_41_TO_43_COMPLETO.pdf  # Resumen ejecutivo
```

## Stack Tecnológico

### Frontend
- **Framework:** React 18 con TypeScript
- **Build:** Vite
- **Estilos:** Tailwind CSS + shadcn/ui
- **Estado:** Zustand (client) + React Query (server)
- **Rutas:** React Router v6
- **Forms:** React Hook Form + Zod (cuando se necesite)

### Backend (Pendiente Integración)
- LLM Local: Ollama + DeepSeek
- Base de datos: PostgreSQL (con Alembic para migraciones)

### Deploy
- Frontend: Vercel
- Backend: Railway.app

## Convenciones de Código

### Nombres
- Componentes: PascalCase (ej: `ProblemGrid`)
- Hooks: camelCase con prefijo `use` (ej: `useProblemInput`)
- Archivos: Mismo nombre que export principal (ej: `ProblemGrid.tsx`)
- Variables de negocio: español (ej: `numeroDeIntentos`, `respuestaEstudiante`)
- Variables técnicas: inglés (ej: `isLoading`, `hasError`)

### Estructura de Componentes
```tsx
// 1. Imports
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// 2. Types/Interfaces
interface MyComponentProps {
  foo: string;
}

// 3. Component
export function MyComponent({ foo }: MyComponentProps) {
  // 3.1 Hooks
  const [state, setState] = useState();
  
  // 3.2 Handlers
  const handleClick = () => {};
  
  // 3.3 Effects
  useEffect(() => {}, []);
  
  // 3.4 Render
  return <div>{foo}</div>;
}
```

### Imports Path Aliases
```tsx
import { Button } from '@/components/ui/button';
import { useProblemInput } from '@/hooks';
import { Operacion } from '@/types';
```

## Principios de Diseño Aplicados

1. **DRY (Don't Repeat Yourself)**
   - Código duplicado → Extraer a hook/componente
   - Lógica repetida → Utilidad en `/utils`

2. **Single Responsibility**
   - Un componente = Una responsabilidad clara
   - Hooks focalizados en una tarea específica

3. **Composición sobre Herencia**
   - Componentes pequeños y componibles
   - Ejemplo: `DigitRow` compone múltiples `DigitInput`

4. **Separación de Concerns**
   - Lógica de negocio → Hooks
   - Presentación → Componentes
   - Estado global → Stores (Zustand)
   - Datos del servidor → React Query

## Métricas de Calidad

### Antes de la Refactorización
- ProblemGrid.tsx: 550 líneas
- Código duplicado: ~40%
- Difícil de testear: ⚠️

### Después de la Refactorización
- ProblemGrid.tsx: 60 líneas (-89%)
- Código duplicado: <5%
- Componentes testeables: ✅
- Separación clara de responsabilidades: ✅

## Comandos Útiles

```bash
# Desarrollo
npm run dev           # Inicia servidor de desarrollo

# Build
npm run build         # Compila TypeScript + Vite build

# Linting
npm run lint          # ESLint check
npm run lint:fix      # Fix automático

# Testing (cuando se implemente)
npm test              # Ejecuta tests
npm test -- --coverage # Con coverage
```

## Troubleshooting Común

### Error: "Cannot find module '@/...'"
**Solución:** Verifica que `tsconfig.json` tenga configurado el path alias

### Error: TypeScript "Type X is not assignable to type Y"
**Solución:** Revisa que las interfaces en `/types` estén actualizadas

### Build falla con "unused variable"
**Solución:** Usa `_variableName` para variables intencionalmente no usadas

## Referencias Rápidas

- **Documentación Tesis:** Ver PDFs en proyecto Claude
- **shadcn/ui Docs:** https://ui.shadcn.com/
- **Tailwind Docs:** https://tailwindcss.com/docs
- **React Query:** https://tanstack.com/query/latest

## Notas Importantes

⚠️ **NO** usar localStorage para datos sensibles
⚠️ **NO** hacer `any` en TypeScript
⚠️ **NO** importar componentes enteros de librerías (tree-shaking)
✅ **SÍ** usar Zustand para estado cliente
✅ **SÍ** usar React Query para estado servidor
✅ **SÍ** validar props con interfaces TypeScript

## Contacto con Equipo

Para preguntas sobre:
- Especificaciones → Ver @Capitulo_III.pdf
- Marco teórico → Ver @Capitulos_I__II.pdf
- Requisitos funcionales → Ver @RESUMEN_EJECUTIVO_41_TO_43_COMPLETO.pdf
