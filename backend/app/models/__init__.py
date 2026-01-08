"""
Módulo de modelos SQLAlchemy.

Importa todos los modelos para que Alembic pueda detectarlos.
"""

from app.core.database import Base

# Modelos de usuarios
from app.models.user import Usuario, Estudiante, Profesor, TipoUsuario

# Modelos de problemas y prácticas
from app.models.problem import (
    Problema,
    Intento,
    ConfiguracionPractica,
    Operacion,
    TipoSesion
)

# Modelos de sistema adaptativo
from app.models.adaptive import (
    PerfilEstudiante,
    PruebaDiagnostica,
    SesionPractica,
    AlertaEstudiante,
    EstadisticaEstudiante,
    PerfilAprendizaje,
    TipoAlerta,
    EstadoDiagnostico
)

# Modelos de contenido educativo
from app.models.narrative import Narrativa
from app.models.group import Grupo, EstudianteGrupo
from app.models.gamification import Medalla, EstudianteMedalla
from app.models.error import ErrorComun

# Importar todos los demás modelos necesarios para Alembic
try:
    from app.models.unlockable import (
        Desbloqueable,
        CategoriaDesbloqueable,
        EstudianteDesbloqueable,
        PersonalizacionEstudiante,
        TipoCategoria
    )
except ImportError:
    pass

try:
    from app.models.challenge import (
        DesafioGrupal,
        DesafioIndividual,
        ParticipacionDesafio
    )
except ImportError:
    pass

try:
    from app.models.hint import VideoPista, VideoGuardado
except ImportError:
    pass

__all__ = [
    "Base",
    "Usuario",
    "Estudiante", 
    "Profesor",
    "TipoUsuario",
    "Problema",
    "Intento",
    "ConfiguracionPractica",
    "Operacion",
    "TipoSesion",
    "PerfilEstudiante",
    "PruebaDiagnostica",
    "SesionPractica",
    "AlertaEstudiante",
    "EstadisticaEstudiante",
    "PerfilAprendizaje",
    "TipoAlerta",
    "EstadoDiagnostico",
    "Narrativa",
    "Grupo",
    "EstudianteGrupo",
    "Medalla",
    "EstudianteMedalla",
    "ErrorComun",
]
