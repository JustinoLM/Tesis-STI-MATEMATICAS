"""Add medalla_destacada_id to personalizacion_estudiante

Revision ID: add_medalla_destacada
Revises: add_puntos_totales_to_estudiante
Create Date: 2026-02-28

"""
from alembic import op
import sqlalchemy as sa

revision = 'b1c2d3e4f5a6'
down_revision = '0092496bbdfc'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        'personalizacion_estudiante',
        sa.Column('medalla_destacada_id', sa.Integer(), sa.ForeignKey('medalla.id'), nullable=True)
    )


def downgrade() -> None:
    op.drop_column('personalizacion_estudiante', 'medalla_destacada_id')
