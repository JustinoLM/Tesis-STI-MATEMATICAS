"""
Modelos para sistema de pistas y videos educativos.

Sistema de ayuda contextualizada con LLM (Ollama + DeepSeek).
"""

from datetime import datetime, timedelta
import enum
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship

from app.core.database import Base
from app.models.problem import Operacion


class NivelPista(int, enum.Enum):
    """Niveles de pistas disponibles."""
    NIVEL_1 = 1  # Estrategia general (gratis)
    NIVEL_2 = 2  # Paso a paso (gratis)
    NIVEL_3 = 3  # Casi la respuesta (10 puntos)


class TipoError(str, enum.Enum):
    """Categorías de errores detectados."""
    DESALINEACION_DECIMALES = "desalineacion_decimales"
    PUNTO_MAL_COLOCADO = "punto_mal_colocado"
    CONFUNDIO_OPERACION = "confundio_operacion"
    ORDEN_INCORRECTO = "orden_incorrecto"
    ERROR_TABLA = "error_tabla"
    ERROR_CALCULO_GENERAL = "error_calculo_general"


class FuenteVideo(str, enum.Enum):
    """Fuente del video."""
    YOUTUBE = "youtube"      # Videos curados (MVP)
    GENERADO = "generado"    # Generados con Manim (4.5.3)


class PistaGenerica(Base):
    """
    Pistas pre-escritas para niveles 1 y 2.
    
    Las pistas de nivel 3 se generan dinámicamente con LLM.
    """
    __tablename__ = "pista_generica"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Clasificación
    tipo_problema = Column(String(100), nullable=False)  # suma_decimales, mult_enteros, etc.
    operacion = Column(Enum(Operacion), nullable=False)
    tiene_decimales = Column(Boolean, default=False)
    nivel_pista = Column(Enum(NivelPista), nullable=False)
    
    # Contenido
    contenido = Column(Text, nullable=False)
    
    # Orden de presentación
    orden = Column(Integer, default=0)
    
    # Metadata
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
    activa = Column(Boolean, default=True)
    
    def __repr__(self):
        return f"<PistaGenerica {self.tipo_problema} N{self.nivel_pista.value}>"


class UsoPista(Base):
    """
    Tracking de uso de pistas por estudiante.
    
    Permite analytics y detección de patrones.
    """
    __tablename__ = "uso_pista"
    
    id = Column(Integer, primary_key=True, index=True)
    estudiante_id = Column(Integer, ForeignKey("estudiante.id"), nullable=False, index=True)
    sesion_id = Column(Integer, ForeignKey("sesion_practica.id"), nullable=False)
    problema_id = Column(Integer, ForeignKey("problema.id"), nullable=False)
    
    nivel_pista = Column(Enum(NivelPista), nullable=False)
    puntos_gastados = Column(Integer, default=0)
    
    # Para pistas generadas con LLM
    generada_llm = Column(Boolean, default=False)
    contenido_pista = Column(Text, nullable=True)  # Guardar pista generada
    
    fecha = Column(DateTime, default=datetime.utcnow, index=True)
    
    def __repr__(self):
        return f"<UsoPista estudiante={self.estudiante_id} N{self.nivel_pista.value}>"


class VideoEducativo(Base):
    """
    Catálogo de videos educativos.
    
    Incluye videos curados (YouTube) y generados (Manim + LLM).
    """
    __tablename__ = "video_educativo"
    
    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(200), nullable=False)
    descripcion = Column(Text, nullable=True)
    duracion_segundos = Column(Integer, nullable=False)
    
    # URL del video
    url = Column(String(500), nullable=False)
    fuente = Column(Enum(FuenteVideo), nullable=False)
    
    # Para videos en Cloudinary
    cloudinary_public_id = Column(String(200), nullable=True)
    cloudinary_url = Column(String(500), nullable=True)
    
    # Metadatos para recomendación
    tipo_error = Column(Enum(TipoError), nullable=False, index=True)
    operacion = Column(Enum(Operacion), nullable=False)
    nivel_dificultad = Column(Integer, default=1)  # 1-5
    
    # Para videos generados con Manim (4.5.3)
    prompt_generacion = Column(Text, nullable=True)
    script_manim = Column(Text, nullable=True)
    
    # Thumbnail
    thumbnail_url = Column(String(500), nullable=True)
    
    # Control
    fecha_creacion = Column(DateTime, default=datetime.utcnow)
    activo = Column(Boolean, default=True)
    
    # Relaciones
    videos_guardados = relationship("VideoGuardado", back_populates="video")
    videos_temporales = relationship("VideoTemporal", back_populates="video")
    
    def __repr__(self):
        return f"<VideoEducativo {self.titulo}>"


class VideoGuardado(Base):
    """
    Videos guardados en la galería personal del estudiante.
    
    Máximo 10 videos. FIFO (elimina más viejo al agregar 11º).
    """
    __tablename__ = "video_guardado"
    
    id = Column(Integer, primary_key=True, index=True)
    estudiante_id = Column(Integer, ForeignKey("estudiante.id"), nullable=False, index=True)
    video_id = Column(Integer, ForeignKey("video_educativo.id"), nullable=False)
    
    # Tracking de visualización
    fecha_guardado = Column(DateTime, default=datetime.utcnow, index=True)
    visto = Column(Boolean, default=False)
    progreso_segundos = Column(Integer, default=0)
    
    # Relaciones
    video = relationship("VideoEducativo", back_populates="videos_guardados")
    
    def __repr__(self):
        return f"<VideoGuardado estudiante={self.estudiante_id} video={self.video_id}>"


class VideoTemporal(Base):
    """
    Videos mostrados pero no guardados.
    
    Se eliminan después de 24 horas para ahorrar espacio.
    Solo aplica a videos generados (Cloudinary).
    """
    __tablename__ = "video_temporal"
    
    id = Column(Integer, primary_key=True, index=True)
    estudiante_id = Column(Integer, ForeignKey("estudiante.id"), nullable=False)
    video_id = Column(Integer, ForeignKey("video_educativo.id"), nullable=False)
    
    # Ciclo de vida
    fecha_generacion = Column(DateTime, default=datetime.utcnow)
    fecha_expiracion = Column(DateTime, nullable=False)  # +24 horas
    
    # Control de limpieza
    eliminado = Column(Boolean, default=False)
    fecha_eliminacion = Column(DateTime, nullable=True)
    
    # Relaciones
    video = relationship("VideoEducativo", back_populates="videos_temporales")
    
    def __repr__(self):
        return f"<VideoTemporal video={self.video_id} expira={self.fecha_expiracion}>"
    
    @staticmethod
    def calcular_expiracion(horas: int = 24) -> datetime:
        """Calcula fecha de expiración."""
        return datetime.utcnow() + timedelta(hours=horas)


class GeneracionLLM(Base):
    """
    Historial de generaciones con LLM.
    
    Para debugging, analytics y mejora de prompts.
    """
    __tablename__ = "generacion_llm"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Contexto
    tipo = Column(String(50), nullable=False)  # enunciado_narrativo, pista_nivel_3
    problema_id = Column(Integer, ForeignKey("problema.id"), nullable=True)
    tema = Column(String(50), nullable=True)  # pirates, astronauts, etc.
    
    # Request
    prompt_usado = Column(Text, nullable=False)
    modelo = Column(String(50), nullable=False)  # deepseek-r1:7b
    
    # Response
    respuesta_llm = Column(Text, nullable=False)
    tokens_usados = Column(Integer, nullable=True)
    tiempo_generacion_ms = Column(Integer, nullable=True)
    
    # Metadata
    fecha = Column(DateTime, default=datetime.utcnow, index=True)
    exitoso = Column(Boolean, default=True)
    error = Column(Text, nullable=True)
    
    def __repr__(self):
        return f"<GeneracionLLM {self.tipo} exitoso={self.exitoso}>"
