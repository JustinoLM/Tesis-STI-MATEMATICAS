"""
Modelos de videos de pistas pedagógicas.

VideoPista: Videos generados con Manim basados en guiones LLM.
VideoGuardado: Videos guardados por estudiantes para referencia.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class VideoPista(Base):
    """
    Video de pista pedagógica generado automáticamente.
    
    Proceso:
    1. LLM genera guión pedagógico
    2. Manim convierte guión a video animado
    3. Video se sube a Cloudinary
    4. URL se cachea para problemas similares
    
    Relaciones:
    - Adaptado a una Narrativa (N:1)
    - Guardado por múltiples Estudiantes (1:N via VideoGuardado)
    """
    __tablename__ = "video_pista"
    
    id = Column(Integer, primary_key=True, index=True)
    problema_signature = Column(String(64), nullable=False, index=True)  # Hash del problema
    nivel_estudiante = Column(Integer, nullable=False)  # 1-5
    narrativa_id = Column(Integer, ForeignKey("narrativa.id"), nullable=False, index=True)
    guion_texto = Column(Text, nullable=False)
    video_url = Column(String(500), nullable=True)
    duracion_segundos = Column(Integer, nullable=True)
    fecha_generacion = Column(DateTime, default=datetime.utcnow, nullable=False)
    en_cache = Column(Boolean, default=True, nullable=False)
    fecha_expiracion_cache = Column(DateTime, nullable=True)
    
    # Relaciones
    narrativa = relationship("Narrativa", back_populates="videos_pista")

    def __repr__(self):
        return f"<VideoPista(id={self.id}, signature={self.problema_signature}, nivel={self.nivel_estudiante})>"
