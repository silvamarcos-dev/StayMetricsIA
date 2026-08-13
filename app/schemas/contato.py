
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field

from app.models.contato import TipoContato


class ContatoCreate(BaseModel):

    nome: str = Field(
        ...,
        min_length=1,
        max_length=255
    )

    telefoneWhatsapp: str | None = None

    email: EmailStr | None = None

    apartamentoVinculado: str | None = None

    tipo: TipoContato

    observacoes: str | None = None

    whatsappOptIn: bool = False


class ContatoUpdate(BaseModel):

    nome: str | None = Field(
        default=None,
        min_length=1,
        max_length=255
    )

    telefoneWhatsapp: str | None = None

    email: EmailStr | None = None

    apartamentoVinculado: str | None = None

    tipo: TipoContato | None = None

    observacoes: str | None = None

    whatsappOptIn: bool | None = None


class ContatoResponse(BaseModel):

    id: UUID

    nome: str

    telefoneWhatsapp: str | None

    email: str | None

    apartamentoVinculado: str | None

    tipo: TipoContato

    observacoes: str | None

    whatsappOptIn: bool

    criadoEm: datetime

    atualizadoEm: datetime

    class Config:
        from_attributes = True

