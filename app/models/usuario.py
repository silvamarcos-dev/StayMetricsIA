
import uuid

from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import Boolean, DateTime, Enum, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class TipoUsuario(str, PyEnum):

    ADMINISTRADOR = "ADMINISTRADOR"
    CORRETOR = "CORRETOR"
    ATENDENTE = "ATENDENTE"


class Usuario(Base):

    __tablename__ = "usuarios"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4
    )

    nome: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True
    )

    senhaHash: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    tipo: Mapped[TipoUsuario] = mapped_column(
        Enum(TipoUsuario),
        nullable=False,
        default=TipoUsuario.ATENDENTE
    )

    ativo: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True
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

