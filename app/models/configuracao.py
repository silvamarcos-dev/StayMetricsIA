from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import Boolean, DateTime, String, Text
from sqlalchemy.dialects.postgresql import UUID as PostgreSQLUUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class Configuracao(Base):

    __tablename__ = "configuracoes"

    id: Mapped[UUID] = mapped_column(
        PostgreSQLUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )

    nome_empresa: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
        default="Aurion System",
    )

    nome_sistema: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
        default="Aurion CRM",
    )

    logo_url: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    email: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    telefone: Mapped[str | None] = mapped_column(
        String(30),
        nullable=True,
    )

    whatsapp: Mapped[str | None] = mapped_column(
        String(30),
        nullable=True,
    )

    endereco: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    cor_primaria: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="#2563EB",
    )

    cor_secundaria: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="#4F46E5",
    )

    timezone: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        default="America/Sao_Paulo",
    )

    ativo: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )

    atualizado_em: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )