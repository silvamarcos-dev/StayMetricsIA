
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field

from app.models.usuario import TipoUsuario


class UsuarioCreate(BaseModel):

    nome: str = Field(
        ...,
        min_length=1,
        max_length=255
    )

    email: EmailStr

    senha: str = Field(
        ...,
        min_length=8,
        max_length=128
    )

    tipo: TipoUsuario = TipoUsuario.ATENDENTE

    ativo: bool = True


class UsuarioUpdate(BaseModel):

    nome: str | None = Field(
        default=None,
        min_length=1,
        max_length=255
    )

    email: EmailStr | None = None

    tipo: TipoUsuario | None = None

    ativo: bool | None = None


class UsuarioResponse(BaseModel):

    id: UUID

    nome: str

    email: EmailStr

    tipo: TipoUsuario

    ativo: bool

    criadoEm: datetime

    atualizadoEm: datetime

    class Config:

        from_attributes = True

