"""
Router de problemas matemáticos.

Endpoints para generación de problemas y solicitud de pistas.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.routers.auth import oauth2_scheme

router = APIRouter()


@router.post("/generate")
async def generate_problem(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
):
    """
    Genera un problema matemático adaptado al nivel del estudiante.
    
    Body:
        level: int (1-5)
        operation: str (addition, subtraction, multiplication, division)
        with_decimals: bool
        narrative_context: str (opcional)
    
    Returns:
        Problema con enunciado, respuesta correcta y distractores
    """
    return {
        "message": "Generate problem - TODO",
        "example": {
            "problem_id": "uuid-prob-123",
            "statement": "Un astronauta necesita 3.5 litros de agua...",
            "operation": "addition",
            "level": 3,
            "correct_answer": "7.25"
        }
    }


@router.post("/{problem_id}/hint")
async def request_hint(
    problem_id: str,
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
):
    """
    Solicita una pista para un problema específico.
    
    Genera guión pedagógico con LLM y video con Manim (asíncrono).
    """
    return {
        "message": "Request hint - TODO",
        "example": {
            "hint_text": "Paso 1: Identifica los números decimales...",
            "video_url": None,
            "video_status": "processing"
        }
    }


@router.get("/{problem_id}")
async def get_problem(
    problem_id: str,
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
):
    """Obtiene un problema específico por ID."""
    return {"message": f"Get problem {problem_id} - TODO"}
