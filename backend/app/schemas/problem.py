"""
Schemas Pydantic para problemas matemáticos.

Define contratos para generación, configuración y validación de problemas.
"""

from typing import Optional, List
from pydantic import BaseModel, Field, field_validator, field_serializer
from decimal import Decimal
from datetime import datetime

from app.models.problem import Operacion, TipoSesion


# ============================================
# Schemas de Configuración
# ============================================

class ConfiguracionPracticaCreate(BaseModel):
    """Request para crear configuración de práctica."""
    grupo_id: int
    nivel_dificultad: int = Field(ge=1, le=5, description="Nivel de dificultad (1-5)")
    operaciones_permitidas: List[Operacion] = Field(
        description="Lista de operaciones permitidas en esta práctica"
    )
    decimales_maximos: int = Field(ge=0, le=3, description="Máximo de decimales (0-3)")
    rango_min: int = Field(ge=1, description="Valor mínimo para números generados")
    rango_max: int = Field(ge=1, le=1000, description="Valor máximo para números generados")
    
    @field_validator('rango_max')
    @classmethod
    def validate_rango(cls, v, info):
        """Valida que rango_max > rango_min."""
        if 'rango_min' in info.data and v <= info.data['rango_min']:
            raise ValueError('rango_max debe ser mayor que rango_min')
        return v
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "grupo_id": 1,
                "nivel_dificultad": 3,
                "operaciones_permitidas": ["+", "-", "×"],
                "decimales_maximos": 2,
                "rango_min": 1,
                "rango_max": 100
            }
        }
    }


class ConfiguracionPracticaResponse(BaseModel):
    """Response de configuración de práctica."""
    id: int
    grupo_id: int
    nivel_dificultad: int
    operaciones_permitidas: List[str]
    decimales_maximos: int
    rango_min: int
    rango_max: int
    fecha_creacion: datetime
    aplicada_por: int
    
    model_config = {"from_attributes": True}


# ============================================
# Schemas de Problemas
# ============================================

class ProblemaGenerate(BaseModel):
    """Request para generar problemas."""
    nivel_dificultad: int = Field(ge=1, le=5)
    operaciones_permitidas: Optional[List[Operacion]] = None
    decimales_maximos: Optional[int] = Field(None, ge=0, le=3)
    rango_min: Optional[int] = Field(None, ge=1)
    rango_max: Optional[int] = Field(None, ge=1, le=1000)
    cantidad: int = Field(default=10, ge=1, le=50, description="Cantidad de problemas a generar")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "nivel_dificultad": 3,
                "operaciones_permitidas": ["+", "-", "×"],
                "decimales_maximos": 2,
                "rango_min": 1,
                "rango_max": 100,
                "cantidad": 10
            }
        }
    }


class ProblemaResponse(BaseModel):
    """Response de un problema matemático."""
    id: int
    operacion: str
    numero1: Decimal
    numero2: Decimal
    resultado: Decimal
    nivel_dificultad: int
    cantidad_decimales: int
    signature: str
    fecha_generacion: datetime
    
    @field_serializer('numero1', 'numero2', 'resultado')
    def serialize_decimal(self, value: Decimal) -> str:
        """Serializa Decimal eliminando ceros trailing."""
        return str(value.normalize())
    
    model_config = {
        "from_attributes": True,
        "json_schema_extra": {
            "example": {
                "id": 1,
                "operacion": "+",
                "numero1": "12.5",
                "numero2": "8.3",
                "resultado": "20.8",
                "nivel_dificultad": 2,
                "cantidad_decimales": 2,
                "signature": "plus_12.50_8.30",
                "fecha_generacion": "2024-01-20T10:30:00"
            }
        }
    }


class ProblemaDisplay(BaseModel):
    """Problema para mostrar al estudiante (sin resultado)."""
    id: int
    operacion: str
    numero1: Decimal
    numero2: Decimal
    nivel_dificultad: int
    
    @field_serializer('numero1', 'numero2')
    def serialize_decimal(self, value: Decimal) -> str:
        """Serializa Decimal eliminando ceros trailing."""
        return str(value.normalize())
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "id": 1,
                "operacion": "+",
                "numero1": "12.5",
                "numero2": "8.3",
                "nivel_dificultad": 2
            }
        }
    }


# ============================================
# Schemas de Intentos
# ============================================

class SubmitAnswerRequest(BaseModel):
    """Request para enviar respuesta a un problema."""
    problema_id: int
    respuesta_estudiante: Decimal = Field(description="Respuesta del estudiante")
    tiempo_resolucion: int = Field(ge=1, description="Tiempo en segundos")
    solicito_pista: bool = Field(default=False, description="Si solicitó pista durante resolución")
    tipo_sesion: TipoSesion = Field(default=TipoSesion.PRACTICA)
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "problema_id": 1,
                "respuesta_estudiante": "20.8",
                "tiempo_resolucion": 15,
                "solicito_pista": False,
                "tipo_sesion": "practica"
            }
        }
    }


class IntentoResponse(BaseModel):
    """Response de un intento."""
    id: int
    problema_id: int
    estudiante_id: int
    respuesta_estudiante: Decimal
    es_correcto: bool
    tiempo_resolucion: int
    solicito_pista: bool
    tipo_sesion: str
    timestamp: datetime
    
    # Información del problema (para retroalimentación)
    problema: ProblemaResponse
    
    @field_serializer('respuesta_estudiante')
    def serialize_decimal(self, value: Decimal) -> str:
        """Serializa Decimal eliminando ceros trailing."""
        return str(value.normalize())
    
    model_config = {
        "from_attributes": True,
        "json_schema_extra": {
            "example": {
                "id": 1,
                "problema_id": 1,
                "estudiante_id": 1,
                "respuesta_estudiante": "20.8",
                "es_correcto": True,
                "tiempo_resolucion": 15,
                "solicito_pista": False,
                "tipo_sesion": "practica",
                "timestamp": "2024-01-20T10:30:00",
                "problema": {
                    "id": 1,
                    "operacion": "+",
                    "numero1": "12.5",
                    "numero2": "8.3",
                    "resultado": "20.8",
                    "nivel_dificultad": 2,
                    "cantidad_decimales": 2,
                    "signature": "plus_12.50_8.30",
                    "fecha_generacion": "2024-01-20T10:00:00"
                }
            }
        }
    }


class ValidateAnswerResponse(BaseModel):
    """Response de validación de respuesta."""
    es_correcto: bool
    respuesta_correcta: Decimal
    respuesta_estudiante: Decimal
    diferencia: Optional[Decimal] = None
    mensaje: str
    
    @field_serializer('respuesta_correcta', 'respuesta_estudiante', 'diferencia')
    def serialize_decimal(self, value: Optional[Decimal]) -> Optional[str]:
        """Serializa Decimal eliminando ceros trailing."""
        if value is None:
            return None
        return str(value.normalize())
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "es_correcto": True,
                "respuesta_correcta": "20.8",
                "respuesta_estudiante": "20.8",
                "diferencia": None,
                "mensaje": "¡Correcto! Excelente trabajo."
            }
        }
    }
