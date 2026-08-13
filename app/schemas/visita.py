import uuid

from datetime import date, time, datetime

from pydantic import BaseModel, ConfigDict


class VisitaCreate(BaseModel):

    apartamento_id: uuid.UUID
    contato_id: uuid.UUID
    corretor_id: uuid.UUID

    data: date

    hora_inicio: time

    hora_fim: time | None = None

    observacoes: str | None = None


class VisitaUpdate(BaseModel):

    apartamento_id: uuid.UUID | None = None
    contato_id: uuid.UUID | None = None
    corretor_id: uuid.UUID | None = None

    data: date | None = None

    hora_inicio: time | None = None

    hora_fim: time | None = None

    status: str | None = None

    observacoes: str | None = None


class VisitaResponse(BaseModel):

    model_config = ConfigDict(
        from_attributes=True
    )

    id: uuid.UUID

    apartamento_id: uuid.UUID
    contato_id: uuid.UUID
    corretor_id: uuid.UUID

    data: date

    hora_inicio: time
    hora_fim: time | None

    status: str

    observacoes: str | None

    google_event_id: str | None

    whatsapp_status: str

    criado_em: datetime