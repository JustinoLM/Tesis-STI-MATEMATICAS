"""
Modelos de usuarios del sistema.

Implementa herencia de tabla única (Single Table Inheritance) donde
Usuario es la clase base y Estudiante/Profesor heredan de ella.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
import enum

from app.core.database import Base


class TipoUsuario(str, enum.Enum):
    """Enum para tipos de usuario."""
    ESTUDIANTE = "estudiante"
    PROFESOR = "profesor"


class Usuario(Base):
    """
    Clase base para todos los usuarios del sistema.
    
    Usa Single Table Inheritance (STI) con discriminador en tipo_usuario.
    """
    __tablename__ = "usuario"
    
    # Campos principales
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    tipo_usuario = Column(Enum(TipoUsuario), nullable=False)
    fecha_creacion = Column(DateTime, default=datetime.utcnow, nullable=False)
    ultimo_acceso = Column(DateTime, nullable=True)
    
    # Configuración de herencia
    __mapper_args__ = {
        "polymorphic_identity": "usuario",
        "polymorphic_on": tipo_usuario,
    }
    
    def __repr__(self):
        return f"<Usuario(id={self.id}, email={self.email}, tipo={self.tipo_usuario})>"


class Estudiante(Usuario):
    """
    Modelo de estudiante que hereda de Usuario.
    
    Relaciones:
    - Pertenece a múltiples Grupos (N:M via EstudianteGrupo)
    - Tiene un PerfilEstudiante (1:1)
    - Tiene múltiples Intentos (1:N)
    - Tiene múltiples Medallas (N:M via EstudianteMedalla)
    """
    __tablename__ = "estudiante"
    
    id = Column(Integer, ForeignKey("usuario.id"), primary_key=True)
    codigo_estudiante = Column(String(50), unique=True, nullable=False, index=True)
    nombre_completo = Column(String(255), nullable=False)
    narrativa_seleccionada_id = Column(Integer, ForeignKey("narrativa.id"), nullable=True)
    
    # Relaciones
    narrativa = relationship("Narrativa", back_populates="estudiantes")
    perfil = relationship("PerfilEstudiante", back_populates="estudiante", uselist=False)
    grupos = relationship("EstudianteGrupo", back_populates="estudiante")
    intentos = relationship("Intento", back_populates="estudiante")
    estadisticas = relationship("EstadisticaEstudiante", back_populates="estudiante")
    medallas = relationship("EstudianteMedalla", back_populates="estudiante")
    
    # Configuración de herencia
    __mapper_args__ = {
        "polymorphic_identity": TipoUsuario.ESTUDIANTE,
    }
    
    def __repr__(self):
        return f"<Estudiante(id={self.id}, nombre={self.nombre_completo})>"


class Profesor(Usuario):
    """
    Modelo de profesor que hereda de Usuario.
    
    Relaciones:
    - Tiene múltiples Grupos (1:N)
    - Crea múltiples ConfiguracionesPractica (1:N)
    - Crea múltiples Desafíos (1:N)
    """
    __tablename__ = "profesor"
    
    id = Column(Integer, ForeignKey("usuario.id"), primary_key=True)
    nombre_completo = Column(String(255), nullable=False)
    institucion = Column(String(255), nullable=True)
    
    # Relaciones
    grupos = relationship("Grupo", back_populates="profesor")
    configuraciones = relationship("ConfiguracionPractica", back_populates="aplicada_por_profesor")
    desafios_grupales = relationship("DesafioGrupal", back_populates="profesor")
    desafios_individuales = relationship("DesafioIndividual", back_populates="profesor")
    
    # Configuración de herencia
    __mapper_args__ = {
        "polymorphic_identity": TipoUsuario.PROFESOR,
    }
    
    def __repr__(self):
        return f"<Profesor(id={self.id}, nombre={self.nombre_completo})>"
