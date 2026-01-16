"""
Service para gestión de videos educativos.

Maneja recomendaciones, guardado y limpieza de videos temporales.
"""

from typing import Optional, List
from datetime import datetime
from fastapi import HTTPException, status

from app.repositories.hints_videos_repository import HintsVideosRepository
from app.models.hints_videos import TipoError, VideoEducativo
from app.models.problem import Operacion
from app.schemas.hints_videos import (
    VideoEducativoResponse,
    VideoRecomendacionResponse,
    GuardarVideoResponse,
    GaleriaVideosResponse,
)
from app.core.config import settings


class VideosService:
    """Service para gestión de videos."""
    
    # Máximo de videos guardados por estudiante
    MAX_VIDEOS_GUARDADOS = 10
    
    def __init__(
        self,
        hints_videos_repo: HintsVideosRepository
    ):
        self.hints_videos_repo = hints_videos_repo
        self.max_videos = getattr(settings, 'MAX_VIDEOS_GUARDADOS', self.MAX_VIDEOS_GUARDADOS)
    
    async def recomendar_video(
        self,
        tipo_error: TipoError,
        operacion: Operacion,
        estudiante_id: int
    ) -> Optional[VideoRecomendacionResponse]:
        """
        Recomienda un video basado en el tipo de error.
        
        Se llama cuando el estudiante agota los 3 intentos.
        """
        # Obtener videos recomendados
        videos = await self.hints_videos_repo.get_videos_por_error(
            tipo_error=tipo_error,
            operacion=operacion,
            limit=1
        )
        
        if not videos:
            return None
        
        video = videos[0]
        
        # Verificar si ya lo tiene guardado
        guardado = await self.hints_videos_repo.video_esta_guardado(
            estudiante_id,
            video.id
        )
        
        # Crear video temporal (vida 24h)
        await self.hints_videos_repo.crear_video_temporal(
            estudiante_id=estudiante_id,
            video_id=video.id,
            horas_vida=getattr(settings, 'VIDEO_TEMP_LIFETIME_HOURS', 24)
        )
        
        # Construir response
        video_response = await self._build_video_response(video, estudiante_id)
        
        mensaje = self._generar_mensaje_recomendacion(tipo_error)
        
        return VideoRecomendacionResponse(
            video=video_response,
            tipo_error_detectado=tipo_error.value,
            mensaje=mensaje
        )
    
    def _generar_mensaje_recomendacion(self, tipo_error: TipoError) -> str:
        """Genera mensaje contextual según el error."""
        mensajes = {
            TipoError.DESALINEACION_DECIMALES: "Parece que tuviste problemas alineando los decimales. ¿Quieres ver un video de 2 minutos?",
            TipoError.PUNTO_MAL_COLOCADO: "El punto decimal puede ser confuso. Este video te ayudará a colocarlo correctamente.",
            TipoError.CONFUNDIO_OPERACION: "Verifica qué operación necesitas usar. Este video explica las diferencias.",
            TipoError.ORDEN_INCORRECTO: "El orden importa en algunas operaciones. Mira este video para entenderlo mejor.",
            TipoError.ERROR_TABLA: "Repasemos las tablas de multiplicar con este video corto.",
            TipoError.ERROR_CALCULO_GENERAL: "Este video te mostrará cómo verificar tus cálculos paso a paso."
        }
        
        return mensajes.get(tipo_error, "Este video te ayudará a entender mejor el concepto.")
    
    async def guardar_video(
        self,
        estudiante_id: int,
        video_id: int
    ) -> GuardarVideoResponse:
        """
        Guarda un video en la galería personal.
        
        Si ya tiene 10, elimina el más viejo (FIFO).
        """
        # Verificar que el video existe
        video = await self.hints_videos_repo.get_video(video_id)
        
        if not video:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Video no encontrado"
            )
        
        # Verificar si ya lo tiene guardado
        ya_guardado = await self.hints_videos_repo.video_esta_guardado(
            estudiante_id,
            video_id
        )
        
        if ya_guardado:
            return GuardarVideoResponse(
                exito=False,
                mensaje="Ya tienes este video guardado",
                videos_guardados_total=await self.hints_videos_repo.count_videos_guardados(estudiante_id),
                video_eliminado=None
            )
        
        # Contar cuántos tiene guardados
        total_guardados = await self.hints_videos_repo.count_videos_guardados(estudiante_id)
        
        video_eliminado = None
        
        # Si ya tiene 10, eliminar el más viejo
        if total_guardados >= self.max_videos:
            video_guardado_eliminado = await self.hints_videos_repo.eliminar_video_mas_viejo(estudiante_id)
            
            if video_guardado_eliminado:
                video_eliminado_obj = await self.hints_videos_repo.get_video(video_guardado_eliminado.video_id)
                if video_eliminado_obj:
                    video_eliminado = await self._build_video_response(video_eliminado_obj, estudiante_id)
        
        # Guardar el nuevo video
        await self.hints_videos_repo.guardar_video(estudiante_id, video_id)
        
        nuevo_total = await self.hints_videos_repo.count_videos_guardados(estudiante_id)
        
        mensaje = "Video guardado en tu galería"
        if video_eliminado:
            mensaje += f" (se eliminó '{video_eliminado.titulo}' por límite de {self.max_videos})"
        
        return GuardarVideoResponse(
            exito=True,
            mensaje=mensaje,
            videos_guardados_total=nuevo_total,
            video_eliminado=video_eliminado
        )
    
    async def get_galeria(
        self,
        estudiante_id: int
    ) -> GaleriaVideosResponse:
        """Obtiene la galería personal de videos guardados."""
        videos_guardados = await self.hints_videos_repo.get_videos_guardados(estudiante_id)
        
        videos_response = []
        
        for vg in videos_guardados:
            video = await self.hints_videos_repo.get_video(vg.video_id)
            
            if video:
                video_response = await self._build_video_response(video, estudiante_id)
                video_response.guardado = True
                video_response.fecha_guardado = vg.fecha_guardado
                video_response.visto = vg.visto
                video_response.progreso_segundos = vg.progreso_segundos
                
                videos_response.append(video_response)
        
        return GaleriaVideosResponse(
            total=len(videos_response),
            maximo=self.max_videos,
            videos=videos_response
        )
    
    async def actualizar_progreso(
        self,
        estudiante_id: int,
        video_id: int,
        progreso_segundos: int,
        completo: bool = False
    ) -> None:
        """Actualiza el progreso de visualización de un video."""
        await self.hints_videos_repo.actualizar_progreso_video(
            estudiante_id=estudiante_id,
            video_id=video_id,
            progreso_segundos=progreso_segundos,
            visto=completo
        )
    
    async def limpiar_videos_temporales_expirados(self) -> int:
        """
        Limpia videos temporales expirados (>24h sin guardar).
        
        Se ejecuta con un cron job.
        
        Returns:
            Cantidad de videos eliminados
        """
        videos_expirados = await self.hints_videos_repo.get_videos_temporales_expirados()
        
        eliminados = 0
        
        for video_temp in videos_expirados:
            # Obtener el video
            video = await self.hints_videos_repo.get_video(video_temp.video_id)
            
            if video and video.fuente.value == "generado":
                # TODO: Eliminar de Cloudinary (cuando se implemente en 4.5.3)
                # await cloudinary_service.delete_video(video.cloudinary_public_id)
                pass
            
            # Marcar como eliminado
            await self.hints_videos_repo.marcar_video_temporal_eliminado(video_temp.id)
            eliminados += 1
        
        return eliminados
    
    async def _build_video_response(
        self,
        video: VideoEducativo,
        estudiante_id: int
    ) -> VideoEducativoResponse:
        """Construye response con información de guardado."""
        guardado = await self.hints_videos_repo.video_esta_guardado(
            estudiante_id,
            video.id
        )
        
        return VideoEducativoResponse(
            id=video.id,
            titulo=video.titulo,
            descripcion=video.descripcion,
            duracion_segundos=video.duracion_segundos,
            url=video.url,
            thumbnail_url=video.thumbnail_url,
            fuente=video.fuente.value,
            tipo_error=video.tipo_error.value,
            operacion=video.operacion.value,
            nivel_dificultad=video.nivel_dificultad,
            guardado=guardado,
            fecha_guardado=None,
            visto=False,
            progreso_segundos=0
        )
