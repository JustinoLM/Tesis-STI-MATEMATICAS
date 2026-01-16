"""
Repository para operaciones de pistas y videos.

Gestiona CRUD de pistas, videos, y tracking de uso.
"""

from typing import Optional, List
from sqlalchemy import select, func, and_, or_, desc
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta

from app.models.hints_videos import (
    NivelPista,
    TipoError,
    FuenteVideo,
    PistaGenerica,
    UsoPista,
    VideoEducativo,
    VideoGuardado,
    VideoTemporal,
    GeneracionLLM,
)
from app.models.problem import Operacion


class HintsVideosRepository:
    """Repository para pistas y videos."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    # ============================================
    # Gestión de Pistas
    # ============================================
    
    async def get_pista_generica(
        self,
        operacion: Operacion,
        tiene_decimales: bool,
        nivel_pista: NivelPista
    ) -> Optional[PistaGenerica]:
        """
        Obtiene una pista genérica pre-escrita.
        
        Solo para niveles 1 y 2.
        """
        result = await self.db.execute(
            select(PistaGenerica)
            .where(
                and_(
                    PistaGenerica.operacion == operacion,
                    PistaGenerica.tiene_decimales == tiene_decimales,
                    PistaGenerica.nivel_pista == nivel_pista,
                    PistaGenerica.activa == True
                )
            )
            .limit(1)
        )
        return result.scalar_one_or_none()
    
    async def registrar_uso_pista(
        self,
        estudiante_id: int,
        sesion_id: int,
        problema_id: int,
        nivel_pista: NivelPista,
        puntos_gastados: int,
        generada_llm: bool = False,
        contenido_pista: Optional[str] = None
    ) -> UsoPista:
        """Registra el uso de una pista."""
        uso = UsoPista(
            estudiante_id=estudiante_id,
            sesion_id=sesion_id,
            problema_id=problema_id,
            nivel_pista=nivel_pista,
            puntos_gastados=puntos_gastados,
            generada_llm=generada_llm,
            contenido_pista=contenido_pista,
            fecha=datetime.utcnow()
        )
        
        self.db.add(uso)
        await self.db.commit()
        await self.db.refresh(uso)
        
        return uso
    
    async def get_pistas_usadas_sesion(
        self,
        sesion_id: int,
        problema_id: int
    ) -> List[UsoPista]:
        """Obtiene las pistas ya usadas para un problema en una sesión."""
        result = await self.db.execute(
            select(UsoPista)
            .where(
                and_(
                    UsoPista.sesion_id == sesion_id,
                    UsoPista.problema_id == problema_id
                )
            )
            .order_by(UsoPista.nivel_pista)
        )
        return list(result.scalars().all())
    
    async def count_pistas_estudiante(
        self,
        estudiante_id: int,
        nivel_pista: Optional[NivelPista] = None
    ) -> int:
        """Cuenta pistas usadas por el estudiante."""
        query = select(func.count(UsoPista.id)).where(
            UsoPista.estudiante_id == estudiante_id
        )
        
        if nivel_pista:
            query = query.where(UsoPista.nivel_pista == nivel_pista)
        
        result = await self.db.execute(query)
        return result.scalar() or 0
    
    # ============================================
    # Gestión de Videos
    # ============================================
    
    async def get_video(self, video_id: int) -> Optional[VideoEducativo]:
        """Obtiene un video por ID."""
        result = await self.db.execute(
            select(VideoEducativo).where(VideoEducativo.id == video_id)
        )
        return result.scalar_one_or_none()
    
    async def get_videos_por_error(
        self,
        tipo_error: TipoError,
        operacion: Optional[Operacion] = None,
        limit: int = 3
    ) -> List[VideoEducativo]:
        """
        Obtiene videos recomendados para un tipo de error.
        
        Prioriza videos específicos de la operación si se proporciona.
        """
        query = select(VideoEducativo).where(
            and_(
                VideoEducativo.tipo_error == tipo_error,
                VideoEducativo.activo == True
            )
        )
        
        if operacion:
            query = query.where(VideoEducativo.operacion == operacion)
        
        query = query.order_by(VideoEducativo.nivel_dificultad).limit(limit)
        
        result = await self.db.execute(query)
        videos = list(result.scalars().all())
        
        # Si no hay videos específicos de la operación, buscar genéricos
        if not videos and operacion:
            return await self.get_videos_por_error(tipo_error, None, limit)
        
        return videos
    
    async def get_videos_guardados(
        self,
        estudiante_id: int
    ) -> List[VideoGuardado]:
        """Obtiene los videos guardados del estudiante."""
        result = await self.db.execute(
            select(VideoGuardado)
            .where(VideoGuardado.estudiante_id == estudiante_id)
            .order_by(VideoGuardado.fecha_guardado.desc())
        )
        return list(result.scalars().all())
    
    async def count_videos_guardados(self, estudiante_id: int) -> int:
        """Cuenta cuántos videos tiene guardados."""
        result = await self.db.execute(
            select(func.count(VideoGuardado.id))
            .where(VideoGuardado.estudiante_id == estudiante_id)
        )
        return result.scalar() or 0
    
    async def video_esta_guardado(
        self,
        estudiante_id: int,
        video_id: int
    ) -> bool:
        """Verifica si un video ya está guardado."""
        result = await self.db.execute(
            select(func.count(VideoGuardado.id))
            .where(
                and_(
                    VideoGuardado.estudiante_id == estudiante_id,
                    VideoGuardado.video_id == video_id
                )
            )
        )
        count = result.scalar() or 0
        return count > 0
    
    async def guardar_video(
        self,
        estudiante_id: int,
        video_id: int
    ) -> VideoGuardado:
        """Guarda un video en la galería del estudiante."""
        video_guardado = VideoGuardado(
            estudiante_id=estudiante_id,
            video_id=video_id,
            fecha_guardado=datetime.utcnow(),
            visto=False,
            progreso_segundos=0
        )
        
        self.db.add(video_guardado)
        await self.db.commit()
        await self.db.refresh(video_guardado)
        
        return video_guardado
    
    async def eliminar_video_mas_viejo(
        self,
        estudiante_id: int
    ) -> Optional[VideoGuardado]:
        """
        Elimina el video más viejo (FIFO).
        
        Se usa cuando el estudiante intenta guardar el 11º video.
        """
        result = await self.db.execute(
            select(VideoGuardado)
            .where(VideoGuardado.estudiante_id == estudiante_id)
            .order_by(VideoGuardado.fecha_guardado.asc())
            .limit(1)
        )
        
        video_mas_viejo = result.scalar_one_or_none()
        
        if video_mas_viejo:
            await self.db.delete(video_mas_viejo)
            await self.db.commit()
        
        return video_mas_viejo
    
    async def actualizar_progreso_video(
        self,
        estudiante_id: int,
        video_id: int,
        progreso_segundos: int,
        visto: bool = False
    ) -> Optional[VideoGuardado]:
        """Actualiza el progreso de visualización de un video."""
        result = await self.db.execute(
            select(VideoGuardado)
            .where(
                and_(
                    VideoGuardado.estudiante_id == estudiante_id,
                    VideoGuardado.video_id == video_id
                )
            )
        )
        
        video_guardado = result.scalar_one_or_none()
        
        if video_guardado:
            video_guardado.progreso_segundos = progreso_segundos
            video_guardado.visto = visto
            await self.db.commit()
            await self.db.refresh(video_guardado)
        
        return video_guardado
    
    # ============================================
    # Gestión de Videos Temporales
    # ============================================
    
    async def crear_video_temporal(
        self,
        estudiante_id: int,
        video_id: int,
        horas_vida: int = 24
    ) -> VideoTemporal:
        """Crea registro de video temporal (se elimina en 24h)."""
        video_temp = VideoTemporal(
            estudiante_id=estudiante_id,
            video_id=video_id,
            fecha_generacion=datetime.utcnow(),
            fecha_expiracion=VideoTemporal.calcular_expiracion(horas_vida),
            eliminado=False
        )
        
        self.db.add(video_temp)
        await self.db.commit()
        await self.db.refresh(video_temp)
        
        return video_temp
    
    async def get_videos_temporales_expirados(self) -> List[VideoTemporal]:
        """Obtiene videos temporales que ya expiraron."""
        result = await self.db.execute(
            select(VideoTemporal)
            .where(
                and_(
                    VideoTemporal.fecha_expiracion <= datetime.utcnow(),
                    VideoTemporal.eliminado == False
                )
            )
        )
        return list(result.scalars().all())
    
    async def marcar_video_temporal_eliminado(
        self,
        video_temporal_id: int
    ) -> None:
        """Marca un video temporal como eliminado."""
        result = await self.db.execute(
            select(VideoTemporal).where(VideoTemporal.id == video_temporal_id)
        )
        
        video_temp = result.scalar_one_or_none()
        
        if video_temp:
            video_temp.eliminado = True
            video_temp.fecha_eliminacion = datetime.utcnow()
            await self.db.commit()
    
    # ============================================
    # Gestión de Generaciones LLM
    # ============================================
    
    async def registrar_generacion_llm(
        self,
        tipo: str,
        prompt_usado: str,
        respuesta_llm: str,
        modelo: str,
        problema_id: Optional[int] = None,
        tema: Optional[str] = None,
        tokens_usados: Optional[int] = None,
        tiempo_generacion_ms: Optional[int] = None,
        exitoso: bool = True,
        error: Optional[str] = None
    ) -> GeneracionLLM:
        """Registra una generación con LLM para analytics."""
        generacion = GeneracionLLM(
            tipo=tipo,
            problema_id=problema_id,
            tema=tema,
            prompt_usado=prompt_usado,
            modelo=modelo,
            respuesta_llm=respuesta_llm,
            tokens_usados=tokens_usados,
            tiempo_generacion_ms=tiempo_generacion_ms,
            fecha=datetime.utcnow(),
            exitoso=exitoso,
            error=error
        )
        
        self.db.add(generacion)
        await self.db.commit()
        await self.db.refresh(generacion)
        
        return generacion
    
    async def get_estadisticas_llm(
        self,
        tipo: Optional[str] = None,
        dias: int = 7
    ) -> dict:
        """Obtiene estadísticas de uso del LLM."""
        fecha_inicio = datetime.utcnow() - timedelta(days=dias)
        
        query = select(GeneracionLLM).where(
            GeneracionLLM.fecha >= fecha_inicio
        )
        
        if tipo:
            query = query.where(GeneracionLLM.tipo == tipo)
        
        result = await self.db.execute(query)
        generaciones = list(result.scalars().all())
        
        if not generaciones:
            return {
                "total": 0,
                "exitosas": 0,
                "fallidas": 0,
                "tiempo_promedio_ms": 0
            }
        
        exitosas = [g for g in generaciones if g.exitoso]
        fallidas = [g for g in generaciones if not g.exitoso]
        
        tiempos = [g.tiempo_generacion_ms for g in generaciones if g.tiempo_generacion_ms]
        tiempo_promedio = sum(tiempos) / len(tiempos) if tiempos else 0
        
        return {
            "total": len(generaciones),
            "exitosas": len(exitosas),
            "fallidas": len(fallidas),
            "tiempo_promedio_ms": int(tiempo_promedio),
            "dias_analizados": dias
        }
    
    # ============================================
    # Analytics
    # ============================================
    
    async def get_pistas_mas_solicitadas(self, limit: int = 10) -> List[dict]:
        """Obtiene las pistas más solicitadas."""
        # TODO: Implementar analytics avanzado
        return []
    
    async def get_videos_mas_vistos(self, limit: int = 10) -> List[dict]:
        """Obtiene los videos más vistos."""
        # TODO: Implementar analytics avanzado
        return []
