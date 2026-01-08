"""
Módulo de modelos SQLAlchemy.

Centraliza todos los modelos para facilitar importaciones.
"""

# User and authentication models
from app.models.user import (
    TipoUsuario,
    Usuario,
    Estudiante,
    Profesor,
)

# Problem models
from app.models.problem import (
    Operacion,
    Problema,
    Intento,
)

# Adaptive learning models
from app.models.adaptive import (
    PerfilAprendizaje,
    EstadoDiagnostico,
    TipoAlerta,
    PerfilEstudiante,
    PruebaDiagnostica,
    SesionPractica,
    EstadoSesion,
    AlertaEstudiante,
    EstadisticaEstudiante,
)

# Gamification models
from app.models.gamification import (
    CategoriaDesbloqueable,
    CategoriaMedalla,
    TipoTransaccion,
    Desbloqueable,
    EstudianteDesbloqueable,
    PersonalizacionEstudiante,
    Medalla,
    EstudianteMedalla,
    TransaccionPuntos,
)

# Group models
from app.models.group import (
    Grupo,
)

# Challenge models (if needed later)
# from app.models.challenge import (
#     Challenge,
# )

__all__ = [
    # User
    "TipoUsuario",
    "Usuario",
    "Estudiante",
    "Profesor",
    # Problem
    "Operacion",
    "Problema",
    "Intento",
    # Adaptive
    "PerfilAprendizaje",
    "EstadoDiagnostico",
    "TipoAlerta",
    "PerfilEstudiante",
    "PruebaDiagnostica",
    "SesionPractica",
    "EstadoSesion",
    "AlertaEstudiante",
    "EstadisticaEstudiante",
    # Gamification
    "CategoriaDesbloqueable",
    "CategoriaMedalla",
    "TipoTransaccion",
    "Desbloqueable",
    "EstudianteDesbloqueable",
    "PersonalizacionEstudiante",
    "Medalla",
    "EstudianteMedalla",
    "TransaccionPuntos",
    # Group
    "Grupo",
]
