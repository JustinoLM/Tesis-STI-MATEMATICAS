"""
Modelos del sistema de gamificación (medallas).

Medalla: Logros desbloqueables del sistema.
EstudianteMedalla: Medallas obtenidas por estudiantes.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship

from app.core.database import Base


class Medalla(Base):
    """
    Medalla desbloqueable del sistema.
    
    Ejemplos: "Primera Práctica", "10 Consecutivas Correctas", "Nivel 5 Alcanzado".
    
    Relaciones:
    - Obtenida por múltiples Estudiantes (N:M via EstudianteMedalla)
    """
    __tablename__ = "medalla"
    
    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String(100), unique=True, nullable=False, index=True)  # ej: 'PRIMERA_PRACTICA'
    nombre = Column(String(255), nullable=False)
    descripcion = Column(Text, nullable=True)
    icono_url = Column(String(500), nullable=True)
    condicion_obtencion = Column(JSON, nullable=False)  # Criterios para desbloquear
    nivel_requerido = Column(Integer, nullable=True)  # Nivel mínimo (1-5) o null
    
    # Relaciones
    estudiantes = relationship("EstudianteMedalla", back_populates="medalla")
    
    def __repr__(self):
        return f"<Medalla(id={self.id}, codigo={self.codigo}, nombre={self.nombre})>"


class EstudianteMedalla(Base):
    """
    Tabla asociativa para medallas obtenidas por estudiantes.
    
    Incluye información de exhibición (mostrar en perfil).
    
    Relaciones:
    - Pertenece a un Estudiante (N:1)
    - Es una Medalla específica (N:1)
    """
    __tablename__ = "estudiante_medalla"
    
    id = Column(Integer, primary_key=True, index=True)
    estudiante_id = Column(Integer, ForeignKey("estudiante.id"), nullable=False, index=True)
    medalla_id = Column(Integer, ForeignKey("medalla.id"), nullable=False, index=True)
    fecha_obtencion = Column(DateTime, default=datetime.utcnow, nullable=False)
    exhibida = Column(Boolean, default=False, nullable=False)  # Mostrar en perfil
    orden_exhibicion = Column(Integer, nullable=True)  # 1-3 (máximo 3 exhibidas)
    
    # Relaciones
    estudiante = relationship("Estudiante", back_populates="medallas")
    medalla = relationship("Medalla", back_populates="estudiantes")
    
    def __repr__(self):
        return f"<EstudianteMedalla(id={self.id}, estudiante_id={self.estudiante_id}, medalla_id={self.medalla_id})>"
