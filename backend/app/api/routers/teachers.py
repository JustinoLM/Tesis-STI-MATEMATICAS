"""
Router de profesores.

Endpoints para gestión de grupos, configuración de prácticas y monitoreo.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.routers.auth import oauth2_scheme

router = APIRouter()


@router.get("/groups")
async def get_teacher_groups(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
):
    """Obtiene grupos asignados al profesor."""
    return {"message": "Get groups - TODO"}


@router.get("/groups/{group_id}/students")
async def get_group_students(
    group_id: str,
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
):
    """Obtiene estudiantes de un grupo."""
    return {"message": f"Get students from group {group_id} - TODO"}


@router.get("/groups/{group_id}/progress")
async def get_group_progress(
    group_id: str,
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
):
    """Obtiene progreso agregado del grupo."""
    return {"message": f"Get progress from group {group_id} - TODO"}


@router.post("/groups/{group_id}/practice-config")
async def update_practice_config(
    group_id: str,
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
):
    """Actualiza configuración de prácticas del grupo."""
    return {"message": f"Update config for group {group_id} - TODO"}


@router.post("/challenges")
async def create_challenge(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
):
    """Crea un desafío grupal o individual."""
    return {"message": "Create challenge - TODO"}


@router.get("/ai-suggestions")
async def get_ai_suggestions(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
):
    """Obtiene sugerencias generadas por IA basadas en análisis grupal."""
    return {"message": "AI suggestions - TODO"}
