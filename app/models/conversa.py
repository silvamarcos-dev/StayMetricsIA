from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.sql import func

from app.database.base import Base


class Conversa(Base):
    __tablename__ = "conversas"

    id = Column(Integer, primary_key=True, index=True)

    nome = Column(String(255), nullable=False)

    telefone = Column(String(30), nullable=False, index=True)

    ultima_mensagem = Column(String(1000), nullable=True)

    horario = Column(DateTime(timezone=True), server_default=func.now())

    nao_lidas = Column(Integer, nullable=False, default=0)

    online = Column(Boolean, nullable=False, default=False)

    criado_em = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    atualizado_em = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )