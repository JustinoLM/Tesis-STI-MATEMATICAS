"""
Modelos ORM de SQLAlchemy.

Este módulo contiene todas las definiciones de tablas de la base de datos.
"""

from datetime import datetime
from sqlalchemy import Column, DateTime
from sqlalchemy.ext.declarative import declared_attr

from app.core.database import Base

# Clase base con campos comunes
class TimestampMixin:
    """Mixin que agrega campos de timestamp a los modelos."""
    
    @declared_attr
    def created_at(cls):
        return Column(DateTime, default=datetime.utcnow, nullable=False)
    
    @declared_attr
    def updated_at(cls):
        return Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


# Importar todos los modelos para que Alembic los detecte
from app.models.user import Usuario, Estudiante, Profesor, TipoUsuario
from app.models.narrative import Narrativa
from app.models.group import Grupo, EstudianteGrupo
from app.models.problem import Problema, ConfiguracionPractica, Intento, Operacion, TipoSesion
from app.models.student_profile import PerfilEstudiante, EstadisticaEstudiante
from app.models.gamification import Medalla, EstudianteMedalla
from app.models.unlockable import (
    CategoriaDesbloqueable, 
    Desbloqueable, 
    EstudianteDesbloqueable, 
    PersonalizacionEstudiante,
    TipoCategoria
)
from app.models.challenge import (
    DesafioGrupal, 
    GrupoDesafio, 
    DesafioIndividual, 
    EstudianteDesafioIndividual
)
from app.models.error import ErrorComun, EstudianteError
from app.models.hint import VideoPista, VideoGuardado

__all__ = [
    'Base',
    'TimestampMixin',
    # Usuarios
    'Usuario',
    'Estudiante',
    'Profesor',
    'TipoUsuario',
    # Narrativas
    'Narrativa',
    # Grupos
    'Grupo',
    'EstudianteGrupo',
    # Problemas
    'Problema',
    'ConfiguracionPractica',
    'Intento',
    'Operacion',
    'TipoSesion',
    # Perfiles
    'PerfilEstudiante',
    'EstadisticaEstudiante',
    # Gamificación
    'Medalla',
    'EstudianteMedalla',
    # Desbloqueables
    'CategoriaDesbloqueable',
    'Desbloqueable',
    'EstudianteDesbloqueable',
    'PersonalizacionEstudiante',
    'TipoCategoria',
    # Desafíos
    'DesafioGrupal',
    'GrupoDesafio',
    'DesafioIndividual',
    'EstudianteDesafioIndividual',
    # Errores
    'ErrorComun',
    'EstudianteError',
    # Videos
    'VideoPista',
    'VideoGuardado',
]
