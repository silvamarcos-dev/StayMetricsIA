
import uuid

from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import Boolean, DateTime, Enum, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class TipoContato(str, PyEnum):
    CLIENTE = "CLIENTE"
    PROPRIETARIO = "PROPRIETARIO"
    HOSPEDE = "HOSPEDE"
    CORRETOR = "CORRETOR"


class Contato(Base):

    __tablename__ = "contatos"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4
    )

    nome: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    telefoneWhatsapp: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True
    )

    email: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )

    apartamentoVinculado: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )

    tipo: Mapped[TipoContato] = mapped_column(
        Enum(TipoContato),
        nullable=False
    )

    observacoes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    whatsappOptIn: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False
    )

    criadoEm: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    atualizadoEm: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

