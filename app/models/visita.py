
import uuid

from datetime import datetime, date, time

from sqlalchemy import Date, DateTime, ForeignKey, String, Text, Time, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class Visita(Base):

    __tablename__ = "visitas"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4
    )

    apartamento_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("apartamentos.id"),
        nullable=False
    )

    contato_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("contatos.id"),
        nullable=False
    )

    corretor_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("usuarios.id"),
        nullable=False
    )

    data: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    hora_inicio: Mapped[time] = mapped_column(
        Time,
        nullable=False
    )

    hora_fim: Mapped[time | None] = mapped_column(
        Time,
        nullable=True
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="AGENDADA"
    )

    observacoes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    google_event_id: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )

    whatsapp_status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="PENDENTE"
    )

    criado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
