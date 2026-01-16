from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = '558f36268c78'
down_revision: Union[str, None] = '20260108_1230'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()

    # ENUM existente
    operacion_enum = postgresql.ENUM(
        'SUMA', 'RESTA', 'MULTIPLICACION', 'DIVISION',
        name='operacion',
        create_type=False
    )

    # ENUMs nuevos
    nivelpista = postgresql.ENUM(
        'NIVEL_1', 'NIVEL_2', 'NIVEL_3',
        name='nivelpista',
        create_type=False
    )
    nivelpista.create(bind, checkfirst=True)

    tipoerror = postgresql.ENUM(
        'DESALINEACION_DECIMALES',
        'PUNTO_MAL_COLOCADO',
        'CONFUNDIO_OPERACION',
        'ORDEN_INCORRECTO',
        'ERROR_TABLA',
        'ERROR_CALCULO_GENERAL',
        name='tipoerror',
        create_type=False
    )
    tipoerror.create(bind, checkfirst=True)

    fuentevideo = postgresql.ENUM(
        'YOUTUBE', 'GENERADO',
        name='fuentevideo',
        create_type=False
    )
    fuentevideo.create(bind, checkfirst=True)

    # ------------------ TABLAS ------------------

    op.create_table(
        'pista_generica',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('tipo_problema', sa.String(100), nullable=False),
        sa.Column('operacion', operacion_enum, nullable=False),
        sa.Column('tiene_decimales', sa.Boolean()),
        sa.Column('nivel_pista', nivelpista, nullable=False),
        sa.Column('contenido', sa.Text(), nullable=False),
        sa.Column('orden', sa.Integer()),
        sa.Column('fecha_creacion', sa.DateTime()),
        sa.Column('activa', sa.Boolean()),
    )
    op.create_index('ix_pista_generica_id', 'pista_generica', ['id'])

    op.create_table(
        'video_educativo',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('titulo', sa.String(200), nullable=False),
        sa.Column('descripcion', sa.Text()),
        sa.Column('duracion_segundos', sa.Integer(), nullable=False),
        sa.Column('url', sa.String(500), nullable=False),
        sa.Column('fuente', fuentevideo, nullable=False),
        sa.Column('cloudinary_public_id', sa.String(200)),
        sa.Column('cloudinary_url', sa.String(500)),
        sa.Column('tipo_error', tipoerror, nullable=False),
        sa.Column('operacion', operacion_enum, nullable=False),
        sa.Column('nivel_dificultad', sa.Integer()),
        sa.Column('prompt_generacion', sa.Text()),
        sa.Column('script_manim', sa.Text()),
        sa.Column('thumbnail_url', sa.String(500)),
        sa.Column('fecha_creacion', sa.DateTime()),
        sa.Column('activo', sa.Boolean()),
    )
    op.create_index('ix_video_educativo_id', 'video_educativo', ['id'])
    op.create_index('ix_video_educativo_tipo_error', 'video_educativo', ['tipo_error'])
