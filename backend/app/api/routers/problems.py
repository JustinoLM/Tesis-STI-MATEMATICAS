"""
Router de problemas matemáticos.

Endpoints:
- POST /generate - Generar problemas aleatorios
- POST /submit - Enviar respuesta
- GET /{id} - Obtener problema por ID
- POST /validate - Validar respuesta sin registrar intento
"""

from fastapi import APIRouter, Depends

from app.api.dependencies import (
    CurrentStudent,
    ProblemServiceDep
)
from app.schemas.problem import (
    ProblemaGenerate,
    ProblemaDisplay,
    ProblemaResponse,
    SubmitAnswerRequest,
    IntentoResponse,
    ValidateAnswerResponse
)
from decimal import Decimal

router = APIRouter()


@router.post("/generate", response_model=list[ProblemaDisplay])
async def generate_problems(
    request: ProblemaGenerate,
    problem_service: ProblemServiceDep,
    current_student: CurrentStudent
):
    """
    Genera problemas matemáticos aleatorios.
    
    Parámetros:
    - **nivel_dificultad**: 1-5 (obligatorio)
    - **operaciones_permitidas**: Lista de operaciones ["+", "-", "×", "÷"] (opcional)
    - **decimales_maximos**: 0-3 (opcional)
    - **rango_min/max**: Rango de números (opcional)
    - **cantidad**: Cantidad de problemas (1-50, default: 10)
    
    Retorna lista de problemas sin mostrar el resultado.
    """
    return await problem_service.generate_problems(request)


@router.post("/submit", response_model=IntentoResponse)
async def submit_answer(
    request: SubmitAnswerRequest,
    current_student: CurrentStudent,
    problem_service: ProblemServiceDep
):
    """
    Envía una respuesta a un problema y la valida.
    
    Registra el intento en la base de datos y retorna:
    - Si la respuesta es correcta o incorrecta
    - La respuesta correcta
    - Información del problema
    """
    return await problem_service.submit_answer(
        estudiante_id=current_student.id,
        request=request
    )


@router.post("/validate", response_model=ValidateAnswerResponse)
async def validate_answer(
    problema_id: int,
    respuesta: Decimal,
    problem_service: ProblemServiceDep,
    current_student: CurrentStudent
):
    """
    Valida una respuesta sin registrar el intento.
    
    Útil para feedback inmediato durante la práctica.
    """
    return await problem_service.validate_answer(
        problema_id=problema_id,
        respuesta_estudiante=respuesta
    )


@router.get("/{problema_id}", response_model=ProblemaResponse)
async def get_problem(
    problema_id: int,
    problem_service: ProblemServiceDep,
    current_student: CurrentStudent
):
    """
    Obtiene un problema específico por ID.
    
    **Incluye el resultado** (para revisión después del intento).
    """
    return await problem_service.get_problem_by_id(problema_id)
