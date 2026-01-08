"""
Modelos del sistema adaptativo y estadísticas de estudiantes.

PerfilEstudiante: Tracking del nivel actual y métricas adaptativas.
EstadisticaEstudiante: Estadísticas agregadas por fecha.
"""

from datetime import datetime, date
from sqlalchemy import Column, Integer, Numeric, DateTime, Date, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class PerfilEstudiante(Base):
    """
    Perfil adaptativo del estudiante.
    
    Mantiene el nivel actual (1-5) general y por operación,
    así como métricas para el algoritmo de ajuste de nivel.
    
    Relación:
    - Pertenece a un Estudiante (1:1)
    """
    __tablename__ = "perfil_estudiante"
    
    estudiante_id = Column(Integer, ForeignKey("estudiante.id"), primary_key=True)
    
    # Niveles (1-5)
    nivel_actual = Column(Integer, nullable=False, default=1)
    nivel_suma = Column(Integer, nullable=False, default=1)
    nivel_resta = Column(Integer, nullable=False, default=1)
    nivel_multiplicacion = Column(Integer, nullable=False, default=1)
    nivel_division = Column(Integer, nullable=False, default=1)
    
    # Métricas del sistema adaptativo
    consecutivas_correctas = Column(Integer, nullable=False, default=0)
    total_correctas_nivel_actual = Column(Integer, nullable=False, default=0)
    sesiones_en_nivel_actual = Column(Integer, nullable=False, default=0)
    precision_ultimos_15 = Column(Numeric(5, 4), nullable=True)  # 0.0000 - 1.0000
    velocidad_promedio = Column(Numeric(10, 2), nullable=True)  # segundos promedio
    varianza_rendimiento = Column(Numeric(10, 4), nullable=True)
    
    # Timestamps
    fecha_ultima_promocion = Column(DateTime, nullable=True)
    fecha_ultima_actualizacion = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relación
    estudiante = relationship("Estudiante", back_populates="perfil")
    
    def __repr__(self):
        return f"<PerfilEstudiante(estudiante_id={self.estudiante_id}, nivel={self.nivel_actual})>"


class EstadisticaEstudiante(Base):
    """
    Estadísticas agregadas del estudiante por fecha.
    
    Permite tracking histórico del rendimiento y generar gráficos.
    
    Relación:
    - Pertenece a un Estudiante (N:1)
    """
    __tablename__ = "estadistica_estudiante"
    
    id = Column(Integer, primary_key=True, index=True)
    estudiante_id = Column(Integer, ForeignKey("estudiante.id"), nullable=False, index=True)
    fecha = Column(Date, nullable=False, index=True)
    
    # Métricas diarias
    practicas_completadas = Column(Integer, nullable=False, default=0)
    problemas_resueltos = Column(Integer, nullable=False, default=0)
    problemas_correctos = Column(Integer, nullable=False, default=0)
    tiempo_total_minutos = Column(Integer, nullable=False, default=0)
    pistas_utilizadas = Column(Integer, nullable=False, default=0)
    
    # Relación
    estudiante = relationship("Estudiante", back_populates="estadisticas")
    
    def __repr__(self):
        return f"<EstadisticaEstudiante(id={self.id}, estudiante_id={self.estudiante_id}, fecha={self.fecha})>"
