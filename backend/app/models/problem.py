"""
Modelos de problemas matemáticos, configuraciones y intentos.

Problema: Ejercicios matemáticos generados.
ConfiguracionPractica: Parámetros de generación por grupo.
Intento: Respuestas de estudiantes a problemas.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Numeric, Boolean, DateTime, ForeignKey, Text, Enum, JSON
from sqlalchemy.orm import relationship
import enum

from app.core.database import Base


class Operacion(str, enum.Enum):
    """Enum para tipos de operaciones matemáticas."""
    SUMA = "+"
    RESTA = "-"
    MULTIPLICACION = "×"
    DIVISION = "÷"


class TipoSesion(str, enum.Enum):
    """Enum para tipos de sesión de práctica."""
    PRACTICA = "practica"
    DESAFIO = "desafio"
    REDENCION = "redencion"


class ConfiguracionPractica(Base):
    """
    Configuración de parámetros de generación de problemas por grupo.
    
    Define qué operaciones, niveles y rangos usar para un grupo específico.
    
    Relaciones:
    - Pertenece a un Grupo (N:1)
    - Creada por un Profesor (N:1)
    """
    __tablename__ = "configuracion_practica"
    
    id = Column(Integer, primary_key=True, index=True)
    grupo_id = Column(Integer, ForeignKey("grupo.id"), nullable=False, index=True)
    nivel_dificultad = Column(Integer, nullable=False)  # 1-5
    operaciones_permitidas = Column(JSON, nullable=False)  # ['+', '-', '×', '÷']
    decimales_maximos = Column(Integer, nullable=False)  # 1-3
    rango_min = Column(Numeric(10, 3), nullable=False)
    rango_max = Column(Numeric(10, 3), nullable=False)
    fecha_aplicacion = Column(DateTime, default=datetime.utcnow, nullable=False)
    aplicada_por = Column(Integer, ForeignKey("profesor.id"), nullable=False, index=True)
    
    # Relaciones
    grupo = relationship("Grupo", back_populates="configuraciones_practica")
    aplicada_por_profesor = relationship("Profesor", back_populates="configuraciones")
    
    def __repr__(self):
        return f"<ConfiguracionPractica(id={self.id}, grupo_id={self.grupo_id}, nivel={self.nivel_dificultad})>"


class Problema(Base):
    """
    Problema matemático generado.
    
    Cada problema es único identificado por su signature (hash).
    
    Relaciones:
    - Tiene múltiples Intentos (1:N)
    - Puede tener un VideoPista asociado (1:1 via signature)
    """
    __tablename__ = "problema"
    
    id = Column(Integer, primary_key=True, index=True)
    operacion = Column(Enum(Operacion), nullable=False, index=True)
    numero1 = Column(Numeric(10, 3), nullable=False)
    numero2 = Column(Numeric(10, 3), nullable=False)
    resultado = Column(Numeric(10, 3), nullable=False)
    nivel_dificultad = Column(Integer, nullable=False, index=True)  # 1-5
    cantidad_decimales = Column(Integer, nullable=False)
    signature = Column(String(64), unique=True, nullable=False, index=True)  # Hash único
    fecha_generacion = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relaciones
    intentos = relationship("Intento", back_populates="problema")
    desafios_individuales = relationship("DesafioIndividual", back_populates="problema")
    errores_detectados = relationship("EstudianteError", back_populates="problema")
    
    def __repr__(self):
        return f"<Problema(id={self.id}, op={self.operacion}, nivel={self.nivel_dificultad})>"


class Intento(Base):
    """
    Intento de resolución de un problema por un estudiante.
    
    Registra respuesta, tiempo, si solicitó pista, y contexto de la sesión.
    
    Relaciones:
    - Pertenece a un Estudiante (N:1)
    - Resuelve un Problema (N:1)
    """
    __tablename__ = "intento"
    
    id = Column(Integer, primary_key=True, index=True)
    estudiante_id = Column(Integer, ForeignKey("estudiante.id"), nullable=False, index=True)
    problema_id = Column(Integer, ForeignKey("problema.id"), nullable=False, index=True)
    respuesta_estudiante = Column(Numeric(10, 3), nullable=False)
    es_correcto = Column(Boolean, nullable=False, index=True)
    tiempo_resolucion = Column(Integer, nullable=False)  # segundos
    solicito_pista = Column(Boolean, default=False, nullable=False)
    tipo_sesion = Column(Enum(TipoSesion), nullable=False, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    
    # Relaciones
    estudiante = relationship("Estudiante", back_populates="intentos")
    problema = relationship("Problema", back_populates="intentos")
    
    def __repr__(self):
        return f"<Intento(id={self.id}, estudiante_id={self.estudiante_id}, correcto={self.es_correcto})>"
