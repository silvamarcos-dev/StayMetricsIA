from uuid import UUID

from sqlalchemy.orm import Session

from app.models.apartamento import Apartamento


class ApartamentoRepository:

    def buscar_por_numero(
        self,
        db: Session,
        numero: str
    ) -> Apartamento | None:

        return (
            db.query(Apartamento)
            .filter(
                Apartamento.numero == numero
            )
            .first()
        )

    def criar(
        self,
        db: Session,
        apartamento: Apartamento
    ) -> Apartamento:

        db.add(apartamento)

        db.commit()

        db.refresh(apartamento)

        return apartamento

    def listar(
        self,
        db: Session,
        skip: int = 0,
        limit: int = 100
    ) -> list[Apartamento]:

        return (
            db.query(Apartamento)
            .order_by(Apartamento.numero)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def buscar_por_id(
        self,
        db: Session,
        apartamento_id: UUID
    ) -> Apartamento | None:

        return (
            db.query(Apartamento)
            .filter(
                Apartamento.id == apartamento_id
            )
            .first()
        )

    def atualizar(
        self,
        db: Session,
        apartamento: Apartamento
    ) -> Apartamento:

        db.commit()

        db.refresh(apartamento)

        return apartamento

    def deletar(
        self,
        db: Session,
        apartamento: Apartamento
    ) -> None:

        db.delete(apartamento)

        db.commit()