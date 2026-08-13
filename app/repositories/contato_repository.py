from uuid import UUID

from sqlalchemy.orm import Session

from app.models.contato import Contato


class ContatoRepository:

    def criar(
        self,
        db: Session,
        contato: Contato
    ) -> Contato:

        db.add(contato)

        db.commit()

        db.refresh(contato)

        return contato


    def listar(
        self,
        db: Session,
        skip: int = 0,
        limit: int = 100
    ) -> list[Contato]:

        return (
            db.query(Contato)
            .offset(skip)
            .limit(limit)
            .all()
        )


    def buscar_por_id(
        self,
        db: Session,
        contato_id: UUID
    ) -> Contato | None:

        return (
            db.query(Contato)
            .filter(
                Contato.id == contato_id
            )
            .first()
        )


    def atualizar(
        self,
        db: Session,
        contato: Contato
    ) -> Contato:

        db.commit()

        db.refresh(contato)

        return contato


    def deletar(
        self,
        db: Session,
        contato: Contato
    ) -> None:

        db.delete(contato)

        db.commit()