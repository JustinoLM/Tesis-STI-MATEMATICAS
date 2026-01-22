# Cómo Usar los Agentes en Claude Code

## Setup Inicial

### 1. Iniciar Claude Code en el Proyecto
```bash
cd "/Users/justino/Documents/Universidad/Tesis/Versiones/Cap 4/Proyecto"
claude-code --project "tu-proyecto-tesis"
```

### 2. Verificar Archivos Cargados
```
> @project
> list files
```

Deberías ver:
- ✅ frontend/
- ✅ backend/
- ✅ .claude/coder-agent.md
- ✅ .claude/docs-agent.md
- ✅ Capitulo_III.pdf
- ✅ Capitulos_I__II.pdf
- ✅ RESUMEN_EJECUTIVO_41_TO_43_COMPLETO.pdf

---

## Uso del Agente Codificador

### Activación
```
@.claude/coder-agent.md

[Tu petición de código aquí]
```

### Ejemplos de Prompts

#### Crear Componente Nuevo
```
@.claude/coder-agent.md

Necesito crear el componente TeacherDashboard que muestre:
- Tabla de estudiantes con nombre, grupo, nivel actual
- Filtros por grupo y nivel de dificultad
- Botón para ver detalles de cada estudiante

Ubicación: frontend/src/pages/teacher/TeacherDashboard.tsx
```

#### Refactorizar Código Existente
```
@.claude/coder-agent.md

El componente @frontend/src/components/problems/SumaRestaGrid.tsx 
tiene código duplicado en el manejo de decimales.

Refactorízalo extrayendo la lógica a un hook personalizado.
```

#### Resolver Bug
```
@.claude/coder-agent.md

Bug: En @frontend/src/pages/student/PracticePage.tsx el botón 
"Verificar" no se deshabilita después de verificar la respuesta.

Arréglalo manteniendo la lógica de intentos restantes.
```

#### Agregar Feature
```
@.claude/coder-agent.md

Agrega soporte para división con decimales en el cociente.

Archivos relevantes:
@frontend/src/hooks/useDivisionCalculator.ts
@frontend/src/components/problems/DivisionGrid.tsx

Especificación: @Capitulo_III.pdf sección 4.4.4.3
```

---

## Uso del Agente Documentador

### Activación
```
@.claude/docs-agent.md

[Tu petición de documentación aquí]
```

### Ejemplos de Prompts

#### Documentar Componente
```
@.claude/docs-agent.md

Documenta el componente ProblemGrid con:
- Descripción de propósito
- Props y sus tipos
- Ejemplo de uso
- Decisiones de diseño

Componente: @frontend/src/components/problems/ProblemGrid.tsx
```

#### Explicar Decisión Arquitectónica
```
@.claude/docs-agent.md

Explica por qué separamos ProblemGrid en componentes especializados
(SumaRestaGrid, MultiplicacionGrid, DivisionGrid).

Contexto: Refactorización FASE 2-4
Formato: ADR (Architectural Decision Record)
```

#### Crear Guía de Uso
```
@.claude/docs-agent.md

Crea una guía de "Cómo agregar una nueva operación matemática"
con pasos concretos y ejemplos de código.

Formato: Tutorial paso a paso
```

#### Generar Diagrama
```
@.claude/docs-agent.md

Crea un diagrama de flujo en Mermaid que muestre:
- Cómo fluyen los datos desde PracticePage hasta ProblemGrid
- Cómo se manejan las respuestas del estudiante
- Cómo se activa el feedback visual

Archivos: @frontend/src/pages/student/PracticePage.tsx
```

---

## Tips para Mejores Resultados

### 1. Siempre Especifica el Contexto
❌ Malo: "Crea un componente de dashboard"
✅ Bueno: "@.claude/coder-agent.md Crea el componente TeacherDashboard 
según especificación en @Capitulo_III.pdf sección 4.4.5"

### 2. Referencia Archivos Existentes
```
@.claude/coder-agent.md

Modifica @frontend/src/hooks/useProblemInput.ts para soportar
direcciones personalizadas de auto-focus (diagonal, vertical).
```

### 3. Especifica el Output Deseado
```
@.claude/docs-agent.md

Documenta el sistema de hints en formato:
- Tabla comparativa de niveles
- Snippet de uso
- Diagrama de flujo de decisión
```

### 4. Combina Agentes si es Necesario
```
Sesión 1 (Coder):
@.claude/coder-agent.md
Implementa el componente X...

Sesión 2 (Docs):
@.claude/docs-agent.md
Documenta el componente X que acabo de crear...
```

---

## Shortcuts Útiles

### Ver Estructura del Proyecto
```
> tree frontend/src/components -L 2
```

### Buscar en Archivos
```
> grep "useProblemInput" frontend/src/**/*.tsx
```

### Ver Diferencias
```
> git diff HEAD~1 frontend/src/components/problems/
```

### Referenciar Múltiples Archivos
```
@.claude/coder-agent.md

Necesito refactorizar estos componentes para usar el nuevo hook:
@frontend/src/components/problems/SumaRestaGrid.tsx
@frontend/src/components/problems/MultiplicacionGrid.tsx
@frontend/src/components/problems/DivisionGrid.tsx
```

---

## Troubleshooting

### "No puedo acceder al archivo X"
**Causa:** Archivo no está en el proyecto Claude
**Solución:** Sube el archivo al proyecto en claude.ai

### "El agente no sigue las instrucciones"
**Causa:** Prompt ambiguo o contexto insuficiente
**Solución:** Sé más específico y referencia archivos existentes

### "Las respuestas son muy largas"
**Causa:** No especificaste formato de salida
**Solución:** Agrega "Responde en máximo 20 líneas" o "Solo código, sin explicaciones"

### "No encuentra los PDFs"
**Causa:** PDFs no sincronizados con Claude Code
**Solución:** Verifica con `> @project list files`

---

## Ejemplos Completos

### Ejemplo 1: Feature Nueva (Frontend + Docs)

**Paso 1 - Implementación:**
```
@.claude/coder-agent.md

Implementa sistema de personalización de avatares según 
@Capitulo_III.pdf sección 4.4.6.2

Requisitos:
- Componente AvatarCustomizer
- Estado persistente con Zustand
- Preview en tiempo real
- 6 categorías de personalización

Ubicación: frontend/src/pages/student/CustomizationPage.tsx
```

**Paso 2 - Documentación:**
```
@.claude/docs-agent.md

Documenta el sistema de personalización que acabo de implementar:
- Guía de uso para desarrolladores
- Tabla de opciones de personalización
- Snippets de integración

Formato: README con ejemplos
```

### Ejemplo 2: Bug Fix + Testing

**Paso 1 - Análisis:**
```
@.claude/coder-agent.md

Bug reproducible:
1. Entro a práctica de división
2. Ingreso respuesta incorrecta
3. Click "Reintentar"
4. Los inputs no se limpian

Archivo: @frontend/src/pages/student/PracticePage.tsx
Reproduce el bug y propón solución
```

**Paso 2 - Implementación:**
```
@.claude/coder-agent.md

Implementa la solución propuesta incluyendo:
- Fix del bug
- Test unitario que valide el fix
- Comentario explicando la causa raíz
```

---

## Cuando NO Usar los Agentes

❌ Preguntas generales de React/TypeScript
✅ Usa: Google, documentación oficial

❌ Decisiones de arquitectura que requieren tu input
✅ Usa: Discusión abierta con Claude normal

❌ Exploración de ideas sin objetivo claro
✅ Usa: Brainstorming en Claude.ai web

❌ Múltiples tareas desconectadas en un prompt
✅ Usa: Prompts separados y específicos

---

## Recursos Adicionales

- **Claude Code Docs:** https://docs.anthropic.com/claude/docs/claude-code
- **Mermaid Syntax:** https://mermaid.js.org/
- **ADR Template:** https://adr.github.io/
