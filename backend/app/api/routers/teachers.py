"""Router de profesores - APIs completas."""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.dependencies import get_current_teacher
from app.models.user import Profesor
from app.services.teacher_service import TeacherService
from app.schemas.teacher import (
    GrupoCreate, GrupoUpdate, GrupoDetalle, GrupoResumen,
    ConfiguracionPracticaCreate, ConfiguracionPracticaResponse,
    DesafioGrupalCreate, DesafioGrupalDetalle, DesafioGrupalResumen,
    EstadisticasGrupo, ProgresoEstudiante, AlertaEstudianteResponse,
    BuscarEstudianteRequest, EstudianteSearchResult
)

router = APIRouter()


async def get_teacher_service(db: AsyncSession = Depends(get_db)) -> TeacherService:
    """Dependency para TeacherService."""
    return TeacherService(db)


# ==================== GRUPOS ====================

@router.post("/groups", response_model=GrupoDetalle, status_code=status.HTTP_201_CREATED)
async def crear_grupo(
    data: GrupoCreate,
    profesor: Profesor = Depends(get_current_teacher),
    service: TeacherService = Depends(get_teacher_service)
):
    """Crea un nuevo grupo."""
    return await service.crear_grupo(profesor.id, data)


@router.get("/groups", response_model=List[GrupoResumen])
async def listar_grupos(
    profesor: Profesor = Depends(get_current_teacher),
    service: TeacherService = Depends(get_teacher_service)
):
    """Lista grupos del profesor con resumen."""
    return await service.get_grupos(profesor.id)


@router.get("/groups/{group_id}", response_model=GrupoDetalle)
async def obtener_grupo(
    group_id: int,
    profesor: Profesor = Depends(get_current_teacher),
    service: TeacherService = Depends(get_teacher_service)
):
    """Obtiene detalle de un grupo."""
    grupo = await service.get_grupo_detalle(group_id, profesor.id)
    if not grupo:
        raise HTTPException(status_code=404, detail="Grupo no encontrado")
    return grupo


@router.post("/groups/{group_id}/students/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
async def agregar_estudiante(
    group_id: int,
    student_id: int,
    profesor: Profesor = Depends(get_current_teacher),
    service: TeacherService = Depends(get_teacher_service)
):
    """Agrega estudiante a grupo."""
    try:
        await service.agregar_estudiante(group_id, student_id, profesor.id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/groups/{group_id}/students/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remover_estudiante(
    group_id: int,
    student_id: int,
    profesor: Profesor = Depends(get_current_teacher),
    service: TeacherService = Depends(get_teacher_service)
):
    """Remueve estudiante de grupo."""
    try:
        await service.remover_estudiante(group_id, student_id, profesor.id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ==================== CONFIGURACIÓN ====================

@router.post("/configuration", response_model=ConfiguracionPracticaResponse, status_code=status.HTTP_201_CREATED)
async def crear_configuracion(
    data: ConfiguracionPracticaCreate,
    profesor: Profesor = Depends(get_current_teacher),
    service: TeacherService = Depends(get_teacher_service)
):
    """Crea configuración de práctica para un grupo."""
    try:
        return await service.crear_configuracion(profesor.id, data)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/groups/{group_id}/configuration", response_model=ConfiguracionPracticaResponse)
async def obtener_configuracion(
    group_id: int,
    profesor: Profesor = Depends(get_current_teacher),
    service: TeacherService = Depends(get_teacher_service)
):
    """Obtiene configuración activa de un grupo."""
    config = await service.get_configuracion_activa(group_id, profesor.id)
    if not config:
        raise HTTPException(status_code=404, detail="Configuración no encontrada")
    return config


# ==================== DESAFÍOS GRUPALES ====================

@router.post("/challenges", response_model=DesafioGrupalDetalle, status_code=status.HTTP_201_CREATED)
async def crear_desafio(
    data: DesafioGrupalCreate,
    profesor: Profesor = Depends(get_current_teacher),
    service: TeacherService = Depends(get_teacher_service)
):
    """Crea desafío grupal."""
    return await service.crear_desafio_grupal(profesor.id, data)


@router.get("/challenges", response_model=List[DesafioGrupalDetalle])
async def listar_desafios(
    profesor: Profesor = Depends(get_current_teacher),
    service: TeacherService = Depends(get_teacher_service)
):
    """Lista desafíos del profesor."""
    return await service.get_desafios(profesor.id)


@router.delete("/challenges/{challenge_id}", status_code=status.HTTP_204_NO_CONTENT)
async def eliminar_desafio(
    challenge_id: int,
    profesor: Profesor = Depends(get_current_teacher),
    service: TeacherService = Depends(get_teacher_service)
):
    """Elimina desafío (soft delete)."""
    try:
        await service.eliminar_desafio(challenge_id, profesor.id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ==================== MONITOREO ====================

@router.get("/groups/{group_id}/statistics", response_model=EstadisticasGrupo)
async def obtener_estadisticas(
    group_id: int,
    profesor: Profesor = Depends(get_current_teacher),
    service: TeacherService = Depends(get_teacher_service)
):
    """Obtiene estadísticas del grupo."""
    stats = await service.get_estadisticas_grupo(group_id, profesor.id)
    if not stats:
        raise HTTPException(status_code=404, detail="Grupo no encontrado")
    return stats


@router.get("/alerts", response_model=List[AlertaEstudianteResponse])
async def listar_alertas(
    profesor: Profesor = Depends(get_current_teacher),
    service: TeacherService = Depends(get_teacher_service)
):
    """Lista alertas activas de todos los grupos."""
    return await service.get_alertas(profesor.id)


# ==================== BÚSQUEDA ====================

@router.post("/students/search", response_model=List[EstudianteSearchResult])
async def buscar_estudiantes(
    request: BuscarEstudianteRequest,
    profesor: Profesor = Depends(get_current_teacher),
    service: TeacherService = Depends(get_teacher_service)
):
    """Busca estudiantes por nombre o código."""
    # TODO: Implementar búsqueda
    return []


# ==================== REPORTES ====================

@router.get("/groups/{group_id}/report")
async def generar_reporte(
    group_id: int,
    profesor: Profesor = Depends(get_current_teacher),
    service: TeacherService = Depends(get_teacher_service)
):
    """Genera reporte PDF del grupo."""
    # TODO: Implementar generación de PDF
    raise HTTPException(status_code=501, detail="No implementado")
