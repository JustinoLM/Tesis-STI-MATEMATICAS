"""
Router de prácticas matemáticas.

Endpoints para iniciar prácticas, enviar respuestas y gestionar intentos.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.routers.auth import oauth2_scheme

router = APIRouter()


@router.post("/start", status_code=status.HTTP_201_CREATED)
async def start_practice(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
):
    """
    Inicia una nueva práctica para el estudiante.
    
    Genera secuencia de problemas según nivel actual y configuración.
    """
    return {
        "message": "Start practice - TODO",
        "example": {
            "practice_id": "uuid-practice-123",
            "first_problem": {
                "problem_id": "uuid-prob-123",
                "statement": "Un pirata encontró 4.5 monedas..."
            },
            "total_problems": 10
        }
    }


@router.post("/{practice_id}/submit")
async def submit_answer(
    practice_id: str,
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
):
    """
    Envía respuesta a un problema dentro de una práctica.
    
    Body:
        problem_id: str
        answer: str
        time_taken_seconds: int
    
    Returns:
        is_correct, next_problem (si aplica), feedback
    """
    return {
        "message": "Submit answer - TODO",
        "example": {
            "is_correct": True,
            "feedback": "¡Excelente! Respuesta correcta",
            "next_problem": {"problem_id": "uuid-prob-124"}
        }
    }


@router.get("/{practice_id}/summary")
async def get_practice_summary(
    practice_id: str,
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
):
    """
    Obtiene resumen de una práctica completada.
    
    Returns:
        Estadísticas de la práctica (correctas, incorrectas, tiempo, etc.)
    """
    return {"message": f"Get summary for practice {practice_id} - TODO"}


@router.get("/redemption-problems")
async def get_redemption_problems(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
):
    """
    Obtiene problemas erróneos disponibles para redención.
    
    Returns:
        Lista de problemas que el estudiante respondió incorrectamente
    """
    return {"message": "Get redemption problems - TODO"}
