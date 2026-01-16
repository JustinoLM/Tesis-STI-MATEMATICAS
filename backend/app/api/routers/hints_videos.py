"""
Router para pistas y videos educativos.

Endpoints:
- POST /hints/request - Solicitar pista
- GET /hints/available - Ver pistas disponibles
- GET /videos/recommendation - Obtener video recomendado
- POST /videos/{id}/save - Guardar video
- GET /videos/gallery - Galería personal
- PUT /videos/{id}/progress - Actualizar progreso
"""

from fastapi import APIRouter, Depends

from app.api.dependencies import (
    CurrentStudent,
    HintsServiceDep,
    VideosServiceDep,
)
from app.schemas.hints_videos import (
    SolicitarPistaRequest,
    PistaResponse,
    GuardarVideoRequest,
    GuardarVideoResponse,
    GaleriaVideosResponse,
    ActualizarProgresoVideoRequest,
)

router = APIRouter()


# ============================================
# Pistas
# ============================================

@router.post("/hints/request", response_model=PistaResponse)
async def solicitar_pista(
    request: SolicitarPistaRequest,
    current_student: CurrentStudent,
    hints_service: HintsServiceDep
):
    """
    Solicita una pista para un problema.
    
    Niveles:
    - 1: Estrategia general (GRATIS)
    - 2: Guía paso a paso (GRATIS)
    - 3: Casi la respuesta (10 puntos)
    
    La pista nivel 3 se genera con LLM personalizada al error del estudiante.
    """
    return await hints_service.solicitar_pista(
        estudiante_id=current_student.id,
        sesion_id=request.sesion_id,
        problema_id=request.problema_id,
        nivel_pista=request.nivel_pista
    )


@router.get("/hints/available")
async def get_pistas_disponibles(
    sesion_id: int,
    problema_id: int,
    current_student: CurrentStudent,
    hints_service: HintsServiceDep
):
    """
    Obtiene información sobre qué pistas están disponibles.
    
    Útil para el frontend para mostrar botones habilitados/deshabilitados.
    """
    return await hints_service.get_pistas_disponibles(
        estudiante_id=current_student.id,
        sesion_id=sesion_id,
        problema_id=problema_id
    )


# ============================================
# Videos
# ============================================

@router.post("/videos/{video_id}/save", response_model=GuardarVideoResponse)
async def guardar_video(
    video_id: int,
    current_student: CurrentStudent,
    videos_service: VideosServiceDep
):
    """
    Guarda un video en la galería personal.
    
    Máximo 10 videos. Si ya tiene 10, elimina el más viejo (FIFO).
    """
    return await videos_service.guardar_video(
        estudiante_id=current_student.id,
        video_id=video_id
    )


@router.get("/videos/gallery", response_model=GaleriaVideosResponse)
async def get_galeria_videos(
    current_student: CurrentStudent,
    videos_service: VideosServiceDep
):
    """
    Obtiene la galería personal de videos guardados.
    
    Incluye información de progreso de visualización.
    """
    return await videos_service.get_galeria(current_student.id)


@router.put("/videos/{video_id}/progress")
async def actualizar_progreso_video(
    video_id: int,
    request: ActualizarProgresoVideoRequest,
    current_student: CurrentStudent,
    videos_service: VideosServiceDep
):
    """
    Actualiza el progreso de visualización de un video.
    
    El frontend debe llamar este endpoint periódicamente mientras el estudiante ve el video.
    """
    await videos_service.actualizar_progreso(
        estudiante_id=current_student.id,
        video_id=video_id,
        progreso_segundos=request.progreso_segundos,
        completo=request.completo
    )
    
    return {"success": True, "mensaje": "Progreso actualizado"}
