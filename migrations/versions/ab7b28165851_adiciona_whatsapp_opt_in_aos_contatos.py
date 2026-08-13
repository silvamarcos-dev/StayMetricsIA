
"""adiciona whatsapp opt in aos contatos"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "ab7b28165851"
down_revision = "be86c6f023f0"
branch_labels = None
depends_on = None


def upgrade() -> None:

    op.add_column(
        "contatos",
        sa.Column(
            "whatsappOptIn",
            sa.Boolean(),
            nullable=False,
            server_default=sa.false(),
        ),
    )


def downgrade() -> None:

    op.drop_column(
        "contatos",
        "whatsappOptIn",
    )

