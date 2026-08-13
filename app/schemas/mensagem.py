from datetime import datetime

from pydantic import BaseModel, ConfigDict


class MensagemCriar(BaseModel):
    texto: str


class MensagemResponse(BaseModel):
    id: int
    conversa_id: int
    direcao: str
    tipo: str
    texto: str | None = None
    arquivo_url: str | None = None
    audio_url: str | None = None
    horario: datetime | None = None

    model_config = ConfigDict(from_attributes=True)