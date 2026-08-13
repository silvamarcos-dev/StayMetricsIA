from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ConversaResponse(BaseModel):
    id: int
    nome: str
    telefone: str
    ultima_mensagem: str | None = None
    horario: datetime | None = None
    nao_lidas: int
    online: bool

    model_config = ConfigDict(from_attributes=True)