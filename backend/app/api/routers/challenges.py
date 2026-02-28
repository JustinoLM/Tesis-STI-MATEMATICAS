"""
Router de desafíos grupales para estudiantes.

Expone los desafíos asignados al grupo del estudiante autenticado,
calculando el progreso en tiempo real para el tipo 'problemas_resueltos'.
"""

from typing import List
from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_

from app.core.database import get_db
from app.api.dependencies import CurrentStudent
from app.models.challenge import DesafioGrupal, GrupoDesafio
from app.models.group import EstudianteGrupo, Grupo
from app.models.adaptive import SesionPractica, EstadoSesion
from app.schemas.challenge import DesafioEstudianteResponse

router = APIRouter()


@router.get("/mis-desafios", response_model=List[DesafioEstudianteResponse])
async def mis_desafios(
    current_student: CurrentStudent,
    db: AsyncSession = Depends(get_db),
):
    """
    Devuelve los desafíos grupales activos (no eliminados) asignados
    al grupo del estudiante autenticado, junto con el progreso real del grupo.
    """

    # 1. Grupos activos del estudiante
    grupos_result = await db.execute(
        select(EstudianteGrupo.grupo_id).where(
            and_(
                EstudianteGrupo.estudiante_id == current_student.id,
                EstudianteGrupo.activo == True,
            )
        )
    )
    grupo_ids = [row[0] for row in grupos_result.fetchall()]

    if not grupo_ids:
        return []

    # 2. Desafíos grupales asignados a esos grupos (no eliminados)
    desafios_result = await db.execute(
        select(DesafioGrupal, GrupoDesafio, Grupo)
        .join(GrupoDesafio, GrupoDesafio.desafio_id == DesafioGrupal.id)
        .join(Grupo, Grupo.id == GrupoDesafio.grupo_id)
        .where(
            and_(
                GrupoDesafio.grupo_id.in_(grupo_ids),
                DesafioGrupal.eliminado == False,
            )
        )
        .order_by(DesafioGrupal.fecha_creacion.desc())
    )
    rows = desafios_result.all()

    if not rows:
        return []

    ahora = datetime.utcnow()
    resultado: List[DesafioEstudianteResponse] = []

    for desafio, grupo_desafio, grupo in rows:
        # 3. Calcular progreso según el tipo de desafío
        progreso = grupo_desafio.progreso_actual  # valor guardado como fallback

        if desafio.tipo == "problemas_resueltos":
            # Contar respuestas correctas de todos los miembros del grupo
            # desde la fecha de creación del desafío
            count_result = await db.execute(
                select(
                    func.coalesce(func.sum(SesionPractica.problemas_correctos), 0)
                )
                .join(
                    EstudianteGrupo,
                    EstudianteGrupo.estudiante_id == SesionPractica.estudiante_id,
                )
                .where(
                    and_(
                        EstudianteGrupo.grupo_id == grupo.id,
                        EstudianteGrupo.activo == True,
                        SesionPractica.estado == EstadoSesion.COMPLETADA,
                        SesionPractica.fecha_inicio >= desafio.fecha_creacion,
                    )
                )
            )
            progreso = count_result.scalar() or 0

        elif desafio.tipo == "nivel_alcanzado":
            # Contar estudiantes del grupo que alcanzaron ese nivel o superior
            from app.models.adaptive import PerfilEstudiante

            count_result = await db.execute(
                select(func.count(PerfilEstudiante.id))
                .join(
                    EstudianteGrupo,
                    EstudianteGrupo.estudiante_id == PerfilEstudiante.estudiante_id,
                )
                .where(
                    and_(
                        EstudianteGrupo.grupo_id == grupo.id,
                        EstudianteGrupo.activo == True,
                        PerfilEstudiante.nivel_actual >= desafio.objetivo_cantidad,
                    )
                )
            )
            progreso = count_result.scalar() or 0

        # 4. Calcular porcentaje (acotado a 100)
        porcentaje = (
            round(min((progreso / desafio.objetivo_cantidad) * 100, 100), 2)
            if desafio.objetivo_cantidad > 0
            else 0.0
        )
        grupo_completado = progreso >= desafio.objetivo_cantidad

        # 5. Fecha límite
        dias_restantes: int | None = None
        esta_expirado = False
        if desafio.fecha_limite:
            delta = desafio.fecha_limite - ahora
            dias_restantes = delta.days
            esta_expirado = delta.total_seconds() < 0

        resultado.append(
            DesafioEstudianteResponse(
                id=desafio.id,
                nombre=desafio.nombre,
                descripcion=desafio.descripcion,
                tipo=desafio.tipo,
                objetivo_cantidad=desafio.objetivo_cantidad,
                recompensa_texto=desafio.recompensa_texto,
                fecha_creacion=desafio.fecha_creacion,
                fecha_limite=desafio.fecha_limite,
                completado=desafio.completado or grupo_completado,
                grupo_id=grupo.id,
                grupo_nombre=grupo.nombre,
                progreso_actual=progreso,
                porcentaje=porcentaje,
                grupo_completado=grupo_completado,
                dias_restantes=dias_restantes,
                esta_expirado=esta_expirado,
            )
        )

    return resultado
