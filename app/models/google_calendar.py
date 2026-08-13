from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    String,
    Text,
    func,
)

from sqlalchemy.dialects.postgresql import UUID as PostgreSQLUUID

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
)

from app.database.base import Base


class GoogleCalendarIntegration(Base):

    __tablename__ = "google_calendar_integrations"

    id: Mapped[UUID] = mapped_column(
        PostgreSQLUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )

    configuracao_id: Mapped[UUID] = mapped_column(
        PostgreSQLUUID(as_uuid=True),
        ForeignKey("configuracoes.id"),
        nullable=False,
        unique=True,
    )

    email_google: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    refresh_token: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    calendar_id: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        default="primary",
    )

    conectado: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )

    criado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    atualizado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )