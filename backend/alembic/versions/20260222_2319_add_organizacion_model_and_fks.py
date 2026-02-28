"""add_organizacion_model_and_fks

Revision ID: add_organizacion_v1
Revises: a5e9f19ec896
Create Date: 2026-02-22 23:19:00.000000+00:00

Crea la tabla `organizacion` y agrega organizacion_id a profesor y estudiante.
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'add_organizacion_v1'
down_revision: Union[str, None] = 'a5e9f19ec896'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Crear tabla organizacion
    op.create_table(
        'organizacion',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('nombre', sa.String(255), nullable=False),
        sa.Column('codigo', sa.String(50), nullable=False),
        sa.Column('descripcion', sa.Text(), nullable=True),
        sa.Column('ciudad', sa.String(100), nullable=True),
        sa.Column('pais', sa.String(100), nullable=True, server_default='Colombia'),
        sa.Column('fecha_creacion', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        sa.Column('activa', sa.Integer(), nullable=False, server_default='1'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('nombre'),
        sa.UniqueConstraint('codigo'),
    )
    op.create_index('ix_organizacion_id', 'organizacion', ['id'])
    op.create_index('ix_organizacion_codigo', 'organizacion', ['codigo'])

    # 2. Agregar organizacion_id a profesor
    op.add_column('profesor', sa.Column('organizacion_id', sa.Integer(), nullable=True))
    op.create_foreign_key(
        'fk_profesor_organizacion_id',
        'profesor', 'organizacion',
        ['organizacion_id'], ['id'],
        ondelete='SET NULL'
    )

    # 3. Agregar organizacion_id a estudiante
    op.add_column('estudiante', sa.Column('organizacion_id', sa.Integer(), nullable=True))
    op.create_foreign_key(
        'fk_estudiante_organizacion_id',
        'estudiante', 'organizacion',
        ['organizacion_id'], ['id'],
        ondelete='SET NULL'
    )


def downgrade() -> None:
    op.drop_constraint('fk_estudiante_organizacion_id', 'estudiante', type_='foreignkey')
    op.drop_column('estudiante', 'organizacion_id')
    op.drop_constraint('fk_profesor_organizacion_id', 'profesor', type_='foreignkey')
    op.drop_column('profesor', 'organizacion_id')
    op.drop_index('ix_organizacion_codigo', table_name='organizacion')
    op.drop_index('ix_organizacion_id', table_name='organizacion')
    op.drop_table('organizacion')
