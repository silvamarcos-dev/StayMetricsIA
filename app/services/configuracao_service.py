from sqlalchemy.orm import Session

from app.models.configuracao import Configuracao
from app.repositories.configuracao_repository import (
    ConfiguracaoRepository,
)


class ConfiguracaoService:

    def __init__(self):

        self.repository = ConfiguracaoRepository()


    def buscar(
        self,
        db: Session,
    ) -> Configuracao:

        configuracao = self.repository.buscar(db)

        if configuracao:
            return configuracao

        configuracao = Configuracao()

        return self.repository.criar(
            db,
            configuracao,
        )


    def atualizar(
        self,
        db: Session,
        dados: dict,
    ) -> Configuracao:

        configuracao = self.buscar(db)

        for campo, valor in dados.items():

            setattr(
                configuracao,
                campo,
                valor,
            )

        return self.repository.atualizar(
            db,
            configuracao,
        )