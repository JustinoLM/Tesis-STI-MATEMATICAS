"""
Schemas Pydantic para pistas y videos educativos.

Define contratos para solicitar pistas, videos y tracking.
"""

from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime


# ============================================
# Schemas de Pistas
# ============================================

class SolicitarPistaRequest(BaseModel):
    """Request para solicitar una pista."""
    sesion_id: int
    problema_id: int
    nivel_pista: int = Field(..., ge=1, le=3, description="Nivel de pista (1-3)")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "sesion_id": 123,
                "problema_id": 456,
                "nivel_pista": 2
            }
        }
    }


class PistaResponse(BaseModel):
    """Response con el contenido de la pista."""
    nivel_pista: int
    contenido: str
    puntos_gastados: int
    saldo_nuevo: int
    generada_llm: bool = False
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "nivel_pista": 2,
                "contenido": "Paso 1: Alinea los puntos decimales...",
                "puntos_gastados": 0,
                "saldo_nuevo": 1245,
                "generada_llm": False
            }
        }
    }


class UsoPistaResponse(BaseModel):
    """Historial de uso de pistas."""
    id: int
    problema_id: int
    nivel_pista: int
    puntos_gastados: int
    fecha: datetime
    
    model_config = {"from_attributes": True}


# ============================================
# Schemas de Videos
# ============================================

class VideoEducativoBase(BaseModel):
    """Base para videos educativos."""
    titulo: str
    descripcion: Optional[str]
    duracion_segundos: int
    url: str
    thumbnail_url: Optional[str]


class VideoEducativoResponse(VideoEducativoBase):
    """Video educativo con metadatos."""
    id: int
    fuente: str  # youtube, generado
    tipo_error: str
    operacion: str
    nivel_dificultad: int
    
    # Indicadores de estado
    guardado: bool = False
    fecha_guardado: Optional[datetime] = None
    visto: bool = False
    progreso_segundos: int = 0
    
    model_config = {"from_attributes": True}


class VideoRecomendacionResponse(BaseModel):
    """Video recomendado después de 3 intentos fallidos."""
    video: VideoEducativoResponse
    tipo_error_detectado: str
    mensaje: str
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "video": {},
                "tipo_error_detectado": "desalineacion_decimales",
                "mensaje": "Parece que tuviste problemas alineando los decimales. ¿Quieres ver un video de 2 minutos?"
            }
        }
    }


class GuardarVideoRequest(BaseModel):
    """Request para guardar un video."""
    video_id: int
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "video_id": 5
            }
        }
    }


class GuardarVideoResponse(BaseModel):
    """Response después de guardar un video."""
    exito: bool
    mensaje: str
    videos_guardados_total: int
    video_eliminado: Optional[VideoEducativoResponse] = None  # Si se eliminó el más viejo
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "exito": True,
                "mensaje": "Video guardado en tu galería",
                "videos_guardados_total": 8,
                "video_eliminado": None
            }
        }
    }


class GaleriaVideosResponse(BaseModel):
    """Galería personal de videos guardados."""
    total: int
    maximo: int = 10
    videos: List[VideoEducativoResponse]
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "total": 7,
                "maximo": 10,
                "videos": []
            }
        }
    }


class ActualizarProgresoVideoRequest(BaseModel):
    """Request para actualizar progreso de visualización."""
    video_id: int
    progreso_segundos: int
    completo: bool = False
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "video_id": 5,
                "progreso_segundos": 87,
                "completo": False
            }
        }
    }


# ============================================
# Schemas de Detección de Errores
# ============================================

class ErrorDetectadoResponse(BaseModel):
    """Información sobre el error detectado."""
    tipo_error: str
    descripcion: str
    video_recomendado: Optional[VideoEducativoResponse] = None
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "tipo_error": "desalineacion_decimales",
                "descripcion": "Parece que no alineaste correctamente los puntos decimales",
                "video_recomendado": None
            }
        }
    }


# ============================================
# Schemas de Enunciados Narrativos
# ============================================

class EnunciadoNarrativoResponse(BaseModel):
    """Enunciado narrativo temático."""
    enunciado: str
    tema: str
    variacion: int  # 1, 2, o 3
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "enunciado": "El capitán encontró 12.5 monedas de oro...",
                "tema": "pirates",
                "variacion": 1
            }
        }
    }


class GenerarEnunciadosRequest(BaseModel):
    """Request para generar enunciados (uso interno)."""
    problema_id: int
    tema: str
    forzar_regeneracion: bool = False


# ============================================
# Schemas de Response Extendido (submit_problem)
# ============================================

class SubmitProblemExtendedResponse(BaseModel):
    """
    Response extendido para submit_problem.
    
    Incluye información de pistas y videos disponibles.
    """
    # Campos existentes de submit_problem
    es_correcto: bool
    intentos_restantes: int
    mensaje: str
    siguiente_problema: Optional[dict] = None
    sesion_completada: bool = False
    
    # NUEVOS campos para ayuda
    pistas_disponibles: List[int] = []  # [1, 2] o [1, 2, 3]
    costo_pista_nivel_3: int = 10
    puede_pagar_pista_nivel_3: bool = True
    
    # Solo si agotó 3 intentos
    video_recomendado: Optional[VideoRecomendacionResponse] = None
    error_detectado: Optional[str] = None
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "es_correcto": False,
                "intentos_restantes": 1,
                "mensaje": "Incorrecto. Te queda 1 intento.",
                "siguiente_problema": None,
                "sesion_completada": False,
                "pistas_disponibles": [1, 2, 3],
                "costo_pista_nivel_3": 10,
                "puede_pagar_pista_nivel_3": True,
                "video_recomendado": None,
                "error_detectado": None
            }
        }
    }


# ============================================
# Schemas de Analytics (uso interno)
# ============================================

class EstadisticasUsoResponse(BaseModel):
    """Estadísticas de uso de pistas y videos."""
    total_pistas_solicitadas: int
    pistas_nivel_1: int
    pistas_nivel_2: int
    pistas_nivel_3: int
    puntos_gastados_pistas: int
    
    total_videos_vistos: int
    videos_guardados: int
    promedio_progreso_videos: float
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "total_pistas_solicitadas": 15,
                "pistas_nivel_1": 8,
                "pistas_nivel_2": 5,
                "pistas_nivel_3": 2,
                "puntos_gastados_pistas": 20,
                "total_videos_vistos": 4,
                "videos_guardados": 3,
                "promedio_progreso_videos": 85.5
            }
        }
    }
