import re

from sqlalchemy.orm import Session

from app.models.conversa import Conversa


class ConversaService:

    @staticmethod
    def normalizar_telefone(telefone: str) -> str:
        """
        Remove tudo que não for número.

        Exemplo:
        +55 44 99999-9999
        ->
        5544999999999
        """

        return re.sub(r"\D", "", telefone)


    def criar_ou_atualizar(
        self,
        db: Session,
        nome: str,
        telefone: str,
    ) -> Conversa:

        telefone_normalizado = self.normalizar_telefone(
            telefone
        )

        if not telefone_normalizado:
            raise ValueError(
                "Telefone inválido."
            )

        conversa = (
            db.query(Conversa)
            .filter(
                Conversa.telefone ==
                telefone_normalizado
            )
            .first()
        )

        if conversa:

            conversa.nome = nome

            db.commit()
            db.refresh(conversa)

            return conversa

        conversa = Conversa(
            nome=nome,
            telefone=telefone_normalizado,
            ultima_mensagem=None,
            nao_lidas=0,
            online=False,
        )

        db.add(conversa)

        db.commit()
        db.refresh(conversa)

        return conversa