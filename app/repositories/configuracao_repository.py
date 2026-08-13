from sqlalchemy.orm import Session

from app.models.configuracao import Configuracao


class ConfiguracaoRepository:

    def buscar(
        self,
        db: Session,
    ) -> Configuracao | None:

        return (
            db.query(Configuracao)
            .first()
        )


    def criar(
        self,
        db: Session,
        configuracao: Configuracao,
    ) -> Configuracao:

        db.add(configuracao)

        db.commit()

        db.refresh(configuracao)

        return configuracao


    def atualizar(
        self,
        db: Session,
        configuracao: Configuracao,
    ) -> Configuracao:

        db.commit()

        db.refresh(configuracao)

        return configuracao