from datetime import date
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.visita import Visita


class VisitaRepository:

    def criar(
        self,
        db: Session,
        visita: Visita,
    ) -> Visita:

        db.add(visita)

        db.commit()

        db.refresh(visita)

        return visita


    def listar(
        self,
        db: Session,
        data: date | None = None,
    ) -> list[Visita]:

        query = (
            db.query(Visita)
        )

        if data is not None:

            query = query.filter(
                Visita.data == data
            )

        return (
            query
            .order_by(
                Visita.data,
                Visita.hora_inicio,
            )
            .all()
        )


    def buscar_por_id(
        self,
        db: Session,
        visita_id: UUID,
    ) -> Visita | None:

        return (
            db.query(Visita)
            .filter(
                Visita.id == visita_id
            )
            .first()
        )


    def atualizar(
        self,
        db: Session,
        visita: Visita,
    ) -> Visita:

        db.commit()

        db.refresh(visita)

        return visita


    def deletar(
        self,
        db: Session,
        visita: Visita,
    ) -> None:

        db.delete(visita)

        db.commit()