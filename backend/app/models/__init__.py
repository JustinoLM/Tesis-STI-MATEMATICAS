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

# Narrative models
from app.models.narrative import (
    Narrativa,
)

# Practice Configuration models
from app.models.practice_config import (
    ConfiguracionPractica,
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
    # Narrative
    "Narrativa",
    # Practice Configuration
    "ConfiguracionPractica",
    # Hints and Videos
    "NivelPista",
    "TipoError",
    "FuenteVideo",
    "PistaGenerica",
    "UsoPista",
    "VideoEducativo",
    "VideoGuardado",
    "VideoTemporal",
    "GeneracionLLM",
]

# Hints and Videos models
from app.models.hints_videos import (
    NivelPista,
    TipoError,
    FuenteVideo,
    PistaGenerica,
    UsoPista,
    VideoEducativo,
    VideoGuardado,
    VideoTemporal,
    GeneracionLLM,
)
