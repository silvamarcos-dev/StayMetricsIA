from sqlalchemy.orm import Session

from app.models.mensagem import Mensagem


class MensagemRepository:

    def criar(
        self,
        db: Session,
        mensagem: Mensagem
    ) -> Mensagem:

        db.add(mensagem)

        db.commit()

        db.refresh(mensagem)

        return mensagem


    def buscar_por_whatsapp_id(
        self,
        db: Session,
        whatsapp_message_id: str
    ) -> Mensagem | None:

        return (
            db.query(Mensagem)
            .filter(
                Mensagem.whatsapp_message_id ==
                whatsapp_message_id
            )
            .first()
        )
