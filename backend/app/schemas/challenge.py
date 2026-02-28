"""
Schemas Pydantic para desafíos desde la perspectiva del estudiante.
"""

from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime


class DesafioEstudianteResponse(BaseModel):
    """Desafío grupal visto desde el lado del estudiante."""

    id: int
    nombre: str
    descripcion: Optional[str] = None
    tipo: str  # problemas_resueltos | racha_consecutiva | precision_promedio | nivel_alcanzado
    objetivo_cantidad: int
    recompensa_texto: Optional[str] = None
    fecha_creacion: datetime
    fecha_limite: Optional[datetime] = None
    completado: bool

    # Progreso del grupo al que pertenece el estudiante
    grupo_id: int
    grupo_nombre: str
    progreso_actual: int
    porcentaje: float       # 0.0 – 100.0 (ya acotado)
    grupo_completado: bool

    # Calculados en el servidor
    dias_restantes: Optional[int] = None   # None = sin fecha límite
    esta_expirado: bool = False

    model_config = {"from_attributes": True}
