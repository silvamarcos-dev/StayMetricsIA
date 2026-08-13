
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.apartamento import Apartamento
from app.repositories.apartamento_repository import (
    ApartamentoRepository
)


class ApartamentoService:

    def __init__(self):

        self.repository = ApartamentoRepository()


    def criar(
        self,
        db: Session,
        apartamento: Apartamento
    ) -> Apartamento:

        if (
            not apartamento.numero
            or not apartamento.numero.strip()
        ):

            raise ValueError(
                "Número do apartamento não pode ser vazio"
            )

        return self.repository.criar(
            db,
            apartamento
        )


    def listar(
        self,
        db: Session,
        skip: int = 0,
        limit: int = 100
    ) -> list[Apartamento]:

        return self.repository.listar(
            db,
            skip,
            limit
        )


    def buscar_por_id(
        self,
        db: Session,
        apartamento_id: UUID
    ) -> Apartamento:

        apartamento = (
            self.repository.buscar_por_id(
                db,
                apartamento_id
            )
        )

        if not apartamento:

            raise ValueError(
                "Apartamento não encontrado"
            )

        return apartamento


    def atualizar(
        self,
        db: Session,
        apartamento_id: UUID,
        dados: dict
    ) -> Apartamento:

        apartamento = self.buscar_por_id(
            db,
            apartamento_id
        )

        if "numero" in dados:

            if (
                not dados["numero"]
                or not dados["numero"].strip()
            ):

                raise ValueError(
                    "Número do apartamento não pode ser vazio"
                )

        for campo, valor in dados.items():

            setattr(
                apartamento,
                campo,
                valor
            )

        return self.repository.atualizar(
            db,
            apartamento
        )


    def deletar(
        self,
        db: Session,
        apartamento_id: UUID
    ) -> None:

        apartamento = self.buscar_por_id(
            db,
            apartamento_id
        )

        self.repository.deletar(
            db,
            apartamento
        )

