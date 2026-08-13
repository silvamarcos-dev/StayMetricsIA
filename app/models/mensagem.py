
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.sql import func

from app.database.base import Base


class Mensagem(Base):

    __tablename__ = "mensagens"

    id = Column(Integer, primary_key=True, index=True)

    conversa_id = Column(
        Integer,
        ForeignKey("conversas.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    direcao = Column(
        String(20),
        nullable=False,
        default="enviada"
    )

    tipo = Column(
        String(20),
        nullable=False
    )

    texto = Column(Text, nullable=True)

    arquivo_url = Column(String(500), nullable=True)

    audio_url = Column(String(500), nullable=True)

    whatsapp_message_id = Column(
        String(255),
        nullable=True,
        unique=True,
        index=True
    )

    horario = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    criado_em = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

