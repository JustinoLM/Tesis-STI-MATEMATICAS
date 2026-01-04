"""
Modelos de elementos desbloqueables y personalización.

CategoriaDesbloqueable: Tipos de desbloqueables (color, forma, música).
Desbloqueable: Items específicos desbloqueables.
EstudianteDesbloqueable: Items desbloqueados por estudiante.
PersonalizacionEstudiante: Configuración visual actual del estudiante.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
import enum

from app.core.database import Base


class TipoCategoria(str, enum.Enum):
    """Enum para tipos de categorías de desbloqueables."""
    COLOR = "color"
    FORMA = "forma"
    MUSICA = "musica"
    FONDO = "fondo"
    FUENTE = "fuente"


class CategoriaDesbloqueable(Base):
    """
    Categoría de elementos desbloqueables.
    
    Ejemplos: color, forma, música, fondo, fuente.
    """
    __tablename__ = "categoria_desbloqueable"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(Enum(TipoCategoria), unique=True, nullable=False)
    
    # Relaciones
    desbloqueables = relationship("Desbloqueable", back_populates="categoria")
    
    def __repr__(self):
        return f"<CategoriaDesbloqueable(id={self.id}, nombre={self.nombre})>"


class Desbloqueable(Base):
    """
    Elemento desbloqueable específico.
    
    Ejemplos: "Azul Marino", "Botón Redondo", "Música Espacial".
    
    Relaciones:
    - Pertenece a una Categoría (N:1)
    - Desbloqueado por múltiples Estudiantes (N:M via EstudianteDesbloqueable)
    """
    __tablename__ = "desbloqueable"
    
    id = Column(Integer, primary_key=True, index=True)
    categoria_id = Column(Integer, ForeignKey("categoria_desbloqueable.id"), nullable=False, index=True)
    nombre = Column(String(255), nullable=False)
    codigo = Column(String(100), unique=True, nullable=False, index=True)  # ej: 'COLOR_AZUL_MARINO'
    asset_url = Column(String(500), nullable=True)
    requiere_problemas_correctos = Column(Integer, nullable=False, default=0)
    es_premium = Column(Boolean, default=False, nullable=False)
    
    # Relaciones
    categoria = relationship("CategoriaDesbloqueable", back_populates="desbloqueables")
    estudiantes = relationship("EstudianteDesbloqueable", back_populates="desbloqueable")
    
    def __repr__(self):
        return f"<Desbloqueable(id={self.id}, nombre={self.nombre}, codigo={self.codigo})>"


class EstudianteDesbloqueable(Base):
    """
    Tabla asociativa para desbloqueables obtenidos por estudiante.
    
    Relaciones:
    - Pertenece a un Estudiante (N:1)
    - Es un Desbloqueable específico (N:1)
    """
    __tablename__ = "estudiante_desbloqueable"
    
    id = Column(Integer, primary_key=True, index=True)
    estudiante_id = Column(Integer, ForeignKey("estudiante.id"), nullable=False, index=True)
    desbloqueable_id = Column(Integer, ForeignKey("desbloqueable.id"), nullable=False, index=True)
    fecha_desbloqueo = Column(DateTime, default=datetime.utcnow, nullable=False)
    desbloqueado = Column(Boolean, default=True, nullable=False)
    
    # Relaciones
    estudiante = relationship("Estudiante")
    desbloqueable = relationship("Desbloqueable", back_populates="estudiantes")
    
    def __repr__(self):
        return f"<EstudianteDesbloqueable(id={self.id}, estudiante_id={self.estudiante_id})>"


class PersonalizacionEstudiante(Base):
    """
    Configuración visual actual del estudiante.
    
    Almacena qué desbloqueables está usando actualmente.
    
    Relación:
    - Pertenece a un Estudiante (1:1)
    """
    __tablename__ = "personalizacion_estudiante"
    
    estudiante_id = Column(Integer, ForeignKey("estudiante.id"), primary_key=True)
    forma_boton_id = Column(Integer, ForeignKey("desbloqueable.id"), nullable=True)
    color_boton_id = Column(Integer, ForeignKey("desbloqueable.id"), nullable=True)
    musica_fondo_id = Column(Integer, ForeignKey("desbloqueable.id"), nullable=True)
    fondo_pantalla_id = Column(Integer, ForeignKey("desbloqueable.id"), nullable=True)
    fuente_texto_id = Column(Integer, ForeignKey("desbloqueable.id"), nullable=True)
    fecha_ultima_modificacion = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relaciones
    estudiante = relationship("Estudiante")
    forma_boton = relationship("Desbloqueable", foreign_keys=[forma_boton_id])
    color_boton = relationship("Desbloqueable", foreign_keys=[color_boton_id])
    musica_fondo = relationship("Desbloqueable", foreign_keys=[musica_fondo_id])
    fondo_pantalla = relationship("Desbloqueable", foreign_keys=[fondo_pantalla_id])
    fuente_texto = relationship("Desbloqueable", foreign_keys=[fuente_texto_id])
    
    def __repr__(self):
        return f"<PersonalizacionEstudiante(estudiante_id={self.estudiante_id})>"
