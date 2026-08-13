import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict

from app.models.apartamento import StatusApartamento


class ApartamentoBase(BaseModel):

    numero: str

    bloco: str | None = None

    status: StatusApartamento = StatusApartamento.DISPONIVEL

    proprietarioId: uuid.UUID | None = None

    observacoes: str | None = None


class ApartamentoCreate(ApartamentoBase):
    pass


class ApartamentoUpdate(BaseModel):

    numero: str | None = None

    bloco: str | None = None

    status: StatusApartamento | None = None

    proprietarioId: uuid.UUID | None = None

    observacoes: str | None = None


class ApartamentoResponse(ApartamentoBase):

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID

    criadoEm: datetime

    atualizadoEm: datetime


class ApartamentoRelatorio(BaseModel):

    apartamento_id: str

    numero_apartamento: str

    mes: str

    ano: int

    receita_bruta: Decimal

    internet: Decimal = Decimal("0.00")

    copel: Decimal = Decimal("0.00")

    condominio: Decimal = Decimal("0.00")

    limpeza: Decimal = Decimal("0.00")

    reparos: Decimal = Decimal("0.00")

    administracao: Decimal = Decimal("0.00")

    custos: Decimal

    receita_liquida: Decimal

    ocupacao: Decimal | None = None

    valor_ap: Decimal | None = None

    locacao_normal: Decimal | None = None

    renda_passiva: Decimal | None = None

    rentabilidade: Decimal | None = None

    media_mercado: Decimal | None = None


class RelatorioResponse(BaseModel):

    apartamentos: list[ApartamentoRelatorio]

    total_apartamentos: int