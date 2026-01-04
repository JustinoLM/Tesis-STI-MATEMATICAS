"""
Router de estudiantes.

Endpoints para gestión de perfiles, estadísticas y progreso de estudiantes.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.routers.auth import oauth2_scheme

router = APIRouter()


@router.get("/profile")
async def get_student_profile(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
):
    """
    Obtiene el perfil completo del estudiante autenticado.
    
    Incluye: datos personales, nivel actual, narrativa, estadísticas.
    """
    return {
        "message": "Get student profile - TODO",
        "example": {
            "student_id": "uuid-123",
            "name": "Juan Pérez",
            "current_level": 3,
            "narrative_theme": "Astronauts"
        }
    }


@router.get("/statistics")
async def get_student_statistics(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
):
    """Obtiene estadísticas detalladas del estudiante."""
    return {"message": "Get statistics - TODO"}


@router.get("/medals")
async def get_student_medals(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
):
    """Obtiene medallas desbloqueadas del estudiante."""
    return {"message": "Get medals - TODO"}


@router.get("/inventory")
async def get_student_inventory(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
):
    """Obtiene inventario de desbloqueables del estudiante."""
    return {"message": "Get inventory - TODO"}


@router.put("/customization")
async def update_customization(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
):
    """Actualiza la personalización visual del estudiante."""
    return {"message": "Update customization - TODO"}
