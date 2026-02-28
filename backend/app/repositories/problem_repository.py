"""
Repository para operaciones de base de datos de problemas.

Gestiona problemas matemáticos, configuraciones y intentos.
"""

from typing import List, Optional
from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession
from decimal import Decimal

from app.models.problem import Problema, Intento, Operacion, TipoSesion
from app.models.practice_config import ConfiguracionPractica


class ProblemRepository:
    """Repository para operaciones CRUD de problemas."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    # ============================================
    # Operaciones de Problemas
    # ============================================
    
    async def create_problem(
        self,
        operacion: Operacion,
        numero1: Decimal,
        numero2: Decimal,
        resultado: Decimal,
        nivel_dificultad: int,
        cantidad_decimales: int,
        signature: str
    ) -> Problema:
        """Crea un nuevo problema."""
        problema = Problema(
            operacion=operacion,
            numero1=numero1,
            numero2=numero2,
            resultado=resultado,
            nivel_dificultad=nivel_dificultad,
            cantidad_decimales=cantidad_decimales,
            signature=signature
        )
        
        self.db.add(problema)
        await self.db.commit()
        await self.db.refresh(problema)
        
        return problema
    
    async def get_problem_by_id(self, problema_id: int) -> Optional[Problema]:
        """Obtiene un problema por ID."""
        result = await self.db.execute(
            select(Problema).where(Problema.id == problema_id)
        )
        return result.scalar_one_or_none()
    
    async def get_problem_by_signature(self, signature: str) -> Optional[Problema]:
        """Busca un problema por su signature (evita duplicados)."""
        result = await self.db.execute(
            select(Problema).where(Problema.signature == signature)
        )
        return result.scalar_one_or_none()
    
    async def get_random_problems(
        self,
        nivel_dificultad: int,
        operaciones: List[Operacion],
        limit: int = 10
    ) -> List[Problema]:
        """Obtiene problemas aleatorios según criterios."""
        result = await self.db.execute(
            select(Problema)
            .where(
                and_(
                    Problema.nivel_dificultad == nivel_dificultad,
                    Problema.operacion.in_([op.value for op in operaciones])
                )
            )
            .order_by(func.random())
            .limit(limit)
        )
        return list(result.scalars().all())
    
    # ============================================
    # Operaciones de Configuración
    # ============================================
    
    async def create_configuracion(
        self,
        grupo_id: int,
        nivel_dificultad: int,
        operaciones_permitidas: List[str],
        decimales_maximos: int,
        rango_min: int,
        rango_max: int,
        aplicada_por: int
    ) -> ConfiguracionPractica:
        """Crea una nueva configuración de práctica."""
        configuracion = ConfiguracionPractica(
            grupo_id=grupo_id,
            nivel_dificultad=nivel_dificultad,
            operaciones_permitidas=operaciones_permitidas,
            decimales_maximos=decimales_maximos,
            rango_min=rango_min,
            rango_max=rango_max,
            aplicada_por=aplicada_por
        )
        
        self.db.add(configuracion)
        await self.db.commit()
        await self.db.refresh(configuracion)
        
        return configuracion
    
    async def get_configuracion_activa(self, grupo_id: int) -> Optional[ConfiguracionPractica]:
        """Obtiene la configuración activa de un grupo."""
        result = await self.db.execute(
            select(ConfiguracionPractica)
            .where(ConfiguracionPractica.grupo_id == grupo_id)
            .order_by(ConfiguracionPractica.fecha_creacion.desc())
            .limit(1)
        )
        return result.scalar_one_or_none()
    
    # ============================================
    # Operaciones de Intentos
    # ============================================
    
    async def create_intento(
        self,
        estudiante_id: int,
        problema_id: int,
        respuesta_estudiante: Decimal,
        es_correcto: bool,
        tiempo_resolucion: int,
        solicito_pista: bool,
        tipo_sesion: TipoSesion,
        sesion_id: Optional[int] = None
    ) -> Intento:
        """Registra un intento de resolver un problema."""
        intento = Intento(
            estudiante_id=estudiante_id,
            problema_id=problema_id,
            respuesta_estudiante=respuesta_estudiante,
            es_correcto=es_correcto,
            tiempo_resolucion=tiempo_resolucion,
            solicito_pista=solicito_pista,
            tipo_sesion=tipo_sesion,
            sesion_id=sesion_id
        )
        
        self.db.add(intento)
        await self.db.commit()
        await self.db.refresh(intento)
        
        return intento
    
    async def get_intentos_estudiante(
        self,
        estudiante_id: int,
        limit: int = 50
    ) -> List[Intento]:
        """Obtiene los últimos intentos de un estudiante."""
        result = await self.db.execute(
            select(Intento)
            .where(Intento.estudiante_id == estudiante_id)
            .order_by(Intento.timestamp.desc())
            .limit(limit)
        )
        return list(result.scalars().all())
    
    async def get_intentos_por_problema(
        self,
        estudiante_id: int,
        problema_id: int
    ) -> List[Intento]:
        """Obtiene todos los intentos de un estudiante en un problema específico."""
        result = await self.db.execute(
            select(Intento)
            .where(
                and_(
                    Intento.estudiante_id == estudiante_id,
                    Intento.problema_id == problema_id
                )
            )
            .order_by(Intento.timestamp.asc())
        )
        return list(result.scalars().all())
