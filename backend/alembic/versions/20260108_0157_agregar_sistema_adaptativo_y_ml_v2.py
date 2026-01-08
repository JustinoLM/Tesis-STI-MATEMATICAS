"""agregar sistema adaptativo y ml v2

Revision ID: c938e451b03f
Revises: 62bd192fe6c2
Create Date: 2026-01-08 01:57:46.412350+00:00
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "c938e451b03f"
down_revision: Union[str, None] = "62bd192fe6c2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


# ======================================================
# ENUMs
# - estadodiagnostico YA EXISTE
# - perfilaprendizaje y tipoalerta SE CREAN AQUÍ
# ======================================================

estado_diagnostico_enum = sa.Enum(
    "pendiente",
    "en_progreso",
    "completado",
    name="estadodiagnostico",
    create_type=False,  # ya existe
)

perfil_aprendizaje_enum = sa.Enum(
    "RAPIDO_PRECISO",
    "CUIDADOSO_METODICO",
    "IMPULSIVO",
    "EN_DESARROLLO",
    "NO_CLASIFICADO",
    name="perfilaprendizaje",
    create_type=True,
)

tipo_alerta_enum = sa.Enum(
    "POSIBLE_TRAMPA",
    "REZAGADO",
    "INACTIVO",
    "PROMOCION_RAPIDA",
    "DIFICULTAD_PERSISTENTE",
    "EXCELENCIA",
    name="tipoalerta",
    create_type=False,
)


def upgrade() -> None:
    bind = op.get_bind()

    # Crear ENUMs nuevos
    perfil_aprendizaje_enum.create(bind, checkfirst=True)

    # ============================
    # Tablas nuevas
    # ============================

    op.create_table(
        "prueba_diagnostica",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("estudiante_id", sa.Integer(), nullable=False),
        sa.Column("estado", estado_diagnostico_enum, nullable=True),
        sa.Column("fecha_inicio", sa.DateTime(), nullable=True),
        sa.Column("fecha_fin", sa.DateTime(), nullable=True),
        sa.Column("problemas_ids", sa.JSON(), nullable=True),
        sa.Column("nivel_actual_asignado", sa.Integer(), nullable=True),
        sa.Column("perfecto", sa.Boolean(), nullable=True),
        sa.ForeignKeyConstraint(["estudiante_id"], ["estudiante.id"]),
    )

    op.create_table(
        "alerta_estudiante",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("estudiante_id", sa.Integer(), nullable=False),
        sa.Column("perfil_id", sa.Integer(), nullable=False),
        sa.Column("tipo", tipo_alerta_enum, nullable=False),
        sa.Column("severidad", sa.String(20), nullable=True),
        sa.Column("titulo", sa.String(200), nullable=False),
        sa.Column("mensaje", sa.Text(), nullable=False),
        sa.Column("datos_contexto", sa.JSON(), nullable=True),
        sa.Column("activa", sa.Boolean(), nullable=True),
        sa.Column("leida", sa.Boolean(), nullable=True),
        sa.Column("fecha_creacion", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["estudiante_id"], ["estudiante.id"]),
        sa.ForeignKeyConstraint(["perfil_id"], ["perfil_estudiante.estudiante_id"]),
    )

    op.create_table(
        "sesion_practica",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("estudiante_id", sa.Integer(), nullable=False),
        sa.Column("perfil_id", sa.Integer(), nullable=False),
        sa.Column("fecha_inicio", sa.DateTime(), nullable=True),
        sa.Column("fecha_fin", sa.DateTime(), nullable=True),
        sa.Column("cantidad_problemas", sa.Integer(), nullable=True),
        sa.Column("problemas_correctos", sa.Integer(), nullable=True),
        sa.Column("problemas_incorrectos", sa.Integer(), nullable=True),
        sa.Column("tiempo_total_segundos", sa.Integer(), nullable=True),
        sa.Column("velocidad_promedio", sa.Numeric(6, 2), nullable=True),
        sa.Column("es_practica_perfecta", sa.Boolean(), nullable=True),
        sa.Column("probabilidad_exito_predicha", sa.Numeric(3, 2), nullable=True),
        sa.ForeignKeyConstraint(["estudiante_id"], ["estudiante.id"]),
        sa.ForeignKeyConstraint(["perfil_id"], ["perfil_estudiante.estudiante_id"]),
    )

    # ============================
    # Cambios en tablas existentes
    # ============================

    op.add_column("intento", sa.Column("sesion_id", sa.Integer(), nullable=True))
    op.create_foreign_key(None, "intento", "sesion_practica", ["sesion_id"], ["id"])

    op.add_column(
        "perfil_estudiante",
        sa.Column("perfil_aprendizaje", perfil_aprendizaje_enum, nullable=True),
    )
    op.add_column(
        "perfil_estudiante",
        sa.Column("confianza_perfil", sa.Numeric(3, 2), nullable=True),
    )
    op.add_column(
        "perfil_estudiante",
        sa.Column("diagnostico_completado", sa.Boolean(), nullable=True),
    )
    op.add_column(
        "perfil_estudiante",
        sa.Column("fecha_diagnostico", sa.DateTime(), nullable=True),
    )


def downgrade() -> None:
    bind = op.get_bind()

    op.drop_column("perfil_estudiante", "fecha_diagnostico")
    op.drop_column("perfil_estudiante", "diagnostico_completado")
    op.drop_column("perfil_estudiante", "confianza_perfil")
    op.drop_column("perfil_estudiante", "perfil_aprendizaje")

    op.drop_constraint(None, "intento", type_="foreignkey")
    op.drop_column("intento", "sesion_id")

    op.drop_table("sesion_practica")
    op.drop_table("alerta_estudiante")
    op.drop_table("prueba_diagnostica")

    # Eliminar ENUMs creados en esta migración
    tipo_alerta_enum.drop(bind, checkfirst=True)
    perfil_aprendizaje_enum.drop(bind, checkfirst=True)
