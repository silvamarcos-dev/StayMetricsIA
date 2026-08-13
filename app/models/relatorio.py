import uuid

from datetime import datetime
from decimal import Decimal

from sqlalchemy import (
    DateTime,
    ForeignKey,
    Numeric,
    String,
    UniqueConstraint,
    func
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class RelatorioApartamento(Base):

    __tablename__ = "relatorios_apartamentos"

    __table_args__ = (
        UniqueConstraint(
            "apartamento_id",
            "mes",
            "ano",
            name="uq_relatorio_apartamento_competencia"
        ),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4
    )

    apartamento_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("apartamentos.id"),
        nullable=False
    )

    mes: Mapped[str] = mapped_column(
        String(20),
        nullable=False
    )

    ano: Mapped[int] = mapped_column(
        nullable=False
    )

    receita_bruta: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False
    )

    internet: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
        default=0
    )

    copel: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
        default=0
    )

    condominio: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
        default=0
    )

    limpeza: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
        default=0
    )

    reparos: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
        default=0
    )

    administracao: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
        default=0
    )

    custos: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False
    )

    receita_liquida: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False
    )

    ocupacao: Mapped[Decimal | None] = mapped_column(
        Numeric(5, 2),
        nullable=True
    )

    valor_ap: Mapped[Decimal | None] = mapped_column(
        Numeric(12, 2),
        nullable=True
    )

    locacao_normal: Mapped[Decimal | None] = mapped_column(
        Numeric(12, 2),
        nullable=True
    )

    renda_passiva: Mapped[Decimal | None] = mapped_column(
        Numeric(12, 2),
        nullable=True
    )

    rentabilidade: Mapped[Decimal | None] = mapped_column(
        Numeric(8, 4),
        nullable=True
    )

    media_mercado: Mapped[Decimal | None] = mapped_column(
        Numeric(8, 4),
        nullable=True
    )

    criado_em: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )