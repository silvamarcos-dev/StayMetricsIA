
import uuid

from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import DateTime, Enum, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class StatusApartamento(str, PyEnum):

    DISPONIVEL = "DISPONIVEL"
    RESERVADO = "RESERVADO"
    OCUPADO = "OCUPADO"
    MANUTENCAO = "MANUTENCAO"


class Apartamento(Base):

    __tablename__ = "apartamentos"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4
    )

    numero: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )

    bloco: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True
    )

    status: Mapped[StatusApartamento] = mapped_column(
        Enum(StatusApartamento),
        nullable=False,
        default=StatusApartamento.DISPONIVEL
    )

    proprietarioId: Mapped[uuid.UUID | None] = mapped_column(
        nullable=True
    )

    observacoes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
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

