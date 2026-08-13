
"""create contatos table

Revision ID: 3f881687e4e2
Revises: 9de631643111
Create Date: 2026-08-10 21:23:15.167897

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.

revision: str = '3f881687e4e2'

down_revision: Union[str, Sequence[str], None] = '9de631643111'

branch_labels: Union[str, Sequence[str], None] = None

depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    tipo_contato = sa.Enum(
        'PROPRIETARIO',
        'HOSPEDE',
        name='tipocontato'
    )

    tipo_contato.create(
        op.get_bind(),
        checkfirst=True
    )

    op.add_column(
        'contatos',
        sa.Column(
            'tipo',
            tipo_contato,
            nullable=False
        )
    )

    op.add_column(
        'contatos',
        sa.Column(
            'criadoEm',
            sa.DateTime(timezone=True),
            server_default=sa.text('now()'),
            nullable=False
        )
    )

    op.add_column(
        'contatos',
        sa.Column(
            'atualizadoEm',
            sa.DateTime(timezone=True),
            server_default=sa.text('now()'),
            nullable=False
        )
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_column(
        'contatos',
        'atualizadoEm'
    )

    op.drop_column(
        'contatos',
        'criadoEm'
    )

    op.drop_column(
        'contatos',
        'tipo'
    )

    tipo_contato = sa.Enum(
        'PROPRIETARIO',
        'HOSPEDE',
        name='tipocontato'
    )

    tipo_contato.drop(
        op.get_bind(),
        checkfirst=True
    )

