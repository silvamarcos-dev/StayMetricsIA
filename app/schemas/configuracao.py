from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr


class ConfiguracaoBase(BaseModel):

    nome_empresa: str
    nome_sistema: str

    logo_url: str | None = None

    email: EmailStr | None = None

    telefone: str | None = None

    whatsapp: str | None = None

    endereco: str | None = None

    cor_primaria: str
    cor_secundaria: str

    timezone: str

    ativo: bool


class ConfiguracaoCreate(BaseModel):

    nome_empresa: str = "Aurion System"

    nome_sistema: str = "Aurion CRM"

    logo_url: str | None = None

    email: EmailStr | None = None

    telefone: str | None = None

    whatsapp: str | None = None

    endereco: str | None = None

    cor_primaria: str = "#2563EB"

    cor_secundaria: str = "#4F46E5"

    timezone: str = "America/Sao_Paulo"

    ativo: bool = True


class ConfiguracaoUpdate(BaseModel):

    nome_empresa: str | None = None

    nome_sistema: str | None = None

    logo_url: str | None = None

    email: EmailStr | None = None

    telefone: str | None = None

    whatsapp: str | None = None

    endereco: str | None = None

    cor_primaria: str | None = None

    cor_secundaria: str | None = None

    timezone: str | None = None

    ativo: bool | None = None


class ConfiguracaoResponse(BaseModel):

    model_config = ConfigDict(
        from_attributes=True
    )

    id: UUID

    nome_empresa: str
    nome_sistema: str

    logo_url: str | None

    email: EmailStr | None

    telefone: str | None

    whatsapp: str | None

    endereco: str | None

    cor_primaria: str
    cor_secundaria: str

    timezone: str

    ativo: bool

    atualizado_em: datetime