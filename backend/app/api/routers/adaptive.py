"""
Router del sistema adaptativo.

Endpoints:
- POST /diagnostic/start - Iniciar diagnóstico
- POST /diagnostic/submit - Enviar diagnóstico
- POST /practice/start - Iniciar sesión de práctica
- POST /practice/complete - Completar sesión
- GET /profile - Obtener perfil
"""

from fastapi import APIRouter, Depends
from typing import Dict
from decimal import Decimal

from app.api.dependencies import (
    CurrentStudent,
    AdaptiveServiceDep
)
from app.schemas.adaptive import (
    DiagnosticoSubmit,
    DiagnosticoResultado,
    SesionStartResponse,
    SesionComplete,
    SesionCompleteResponse,
    PerfilResponse
)

router = APIRouter()


# ============================================
# Diagnóstico Inicial
# ============================================

@router.post("/diagnostic/start")
async def iniciar_diagnostico(
    current_student: CurrentStudent,
    adaptive_service: AdaptiveServiceDep
):
    """
    Inicia la prueba diagnóstica inicial.
    
    Genera 8 problemas: 2 por operación (1 nivel 1, 1 nivel 2).
    Todos los estudiantes reciben la misma prueba para comparabilidad.
    """
    return await adaptive_service.generar_diagnostico(current_student.id)


@router.post("/diagnostic/submit", response_model=DiagnosticoResultado)
async def enviar_diagnostico(
    diagnostico_submit: DiagnosticoSubmit,
    current_student: CurrentStudent,
    adaptive_service: AdaptiveServiceDep
):
    """
    Envía las respuestas del diagnóstico y obtiene niveles asignados.
    
    Casos:
    - 8/8 correctos → Nivel 4, todas operaciones nivel 2
    - Mixto → Niveles según desempeño por operación
    """
    return await adaptive_service.evaluar_diagnostico(
        diagnostico_id=diagnostico_submit.diagnostico_id,
        respuestas=diagnostico_submit.respuestas
    )


# ============================================
# Sesiones de Práctica Adaptativa
# ============================================

@router.post("/practice/start", response_model=SesionStartResponse)
async def iniciar_practica(
    current_student: CurrentStudent,
    adaptive_service: AdaptiveServiceDep
):
    """
    Inicia una sesión de práctica adaptativa.
    
    El sistema decide automáticamente:
    - Operación a practicar (énfasis en la más débil)
    - Cantidad de problemas (10, 15 o 20 según nivel)
    - Mix de dificultades (fácil/desafiante según nivel general)
    
    No requiere parámetros - el sistema es completamente automático.
    """
    return await adaptive_service.iniciar_sesion(current_student.id)


@router.post("/practice/complete", response_model=SesionCompleteResponse)
async def completar_practica(
    sesion_complete: SesionComplete,
    current_student: CurrentStudent,
    adaptive_service: AdaptiveServiceDep
):
    """
    Completa una sesión de práctica y evalúa cambios de nivel.
    
    El sistema:
    1. Evalúa desempeño por operación
    2. Decide si subir/bajar niveles
    3. Actualiza métricas del perfil
    4. Clasifica perfil con ML (si tiene suficientes datos)
    5. Retorna feedback y cambios de nivel
    """
    return await adaptive_service.completar_sesion(sesion_complete.sesion_id)


# ============================================
# Perfil y Estadísticas
# ============================================

@router.get("/profile", response_model=PerfilResponse)
async def obtener_perfil(
    current_student: CurrentStudent,
    adaptive_service: AdaptiveServiceDep
):
    """
    Obtiene el perfil adaptativo completo del estudiante.
    
    Incluye:
    - Niveles por operación
    - Operaciones disponibles/bloqueadas
    - Métricas de rendimiento
    - Perfil de aprendizaje (ML)
    - Progreso hacia próximo nivel
    """
    return await adaptive_service.get_perfil(current_student.id)


@router.get("/available-operations")
async def operaciones_disponibles(
    current_student: CurrentStudent,
    adaptive_service: AdaptiveServiceDep
):
    """
    Lista operaciones que el estudiante puede practicar actualmente.
    
    Incluye información sobre prerequisitos faltantes para operaciones bloqueadas.
    """
    perfil_response = await adaptive_service.get_perfil(current_student.id)
    
    return {
        "disponibles": perfil_response.operaciones_disponibles,
        "bloqueadas": perfil_response.operaciones_bloqueadas,
        "prerequisitos_faltantes": perfil_response.prerequisitos_faltantes
    }
