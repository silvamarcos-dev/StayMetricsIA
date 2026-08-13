
import uuid

from datetime import date, time

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.visita import Visita
from app.repositories.visita_repository import VisitaRepository
from app.schemas.visita import (
    VisitaCreate,
    VisitaUpdate,
)


class VisitaService:

    def __init__(self):

        self.repository = VisitaRepository()


    def criar(
        self,
        db: Session,
        dados: VisitaCreate
    ) -> Visita:

        if dados.hora_fim is not None:
            if dados.hora_fim <= dados.hora_inicio:
                raise HTTPException(
                    status_code=400,
                    detail=(
                        "O horário de término "
                        "deve ser posterior ao "
                        "horário de início."
                    )
                )

        visitas = self.repository.listar(
            db=db,
            data=dados.data
        )

        for visita in visitas:

            if visita.status == "CANCELADA":
                continue

            if visita.apartamento_id != dados.apartamento_id:
                continue

            if self._horarios_conflitam(
                visita.hora_inicio,
                visita.hora_fim,
                dados.hora_inicio,
                dados.hora_fim
            ):
                raise HTTPException(
                    status_code=409,
                    detail=(
                        "Já existe uma visita "
                        "agendada para este "
                        "apartamento nesse horário."
                    )
                )

        visita = Visita(
            apartamento_id=dados.apartamento_id,
            contato_id=dados.contato_id,
            corretor_id=dados.corretor_id,
            data=dados.data,
            hora_inicio=dados.hora_inicio,
            hora_fim=dados.hora_fim,
            observacoes=dados.observacoes,
            status="AGENDADA",
            whatsapp_status="PENDENTE"
        )

        return self.repository.criar(
            db,
            visita
        )


    def listar(
        self,
        db: Session,
        data: date | None = None
    ) -> list[Visita]:

        return self.repository.listar(
            db=db,
            data=data
        )


    def buscar_por_id(
        self,
        db: Session,
        visita_id: uuid.UUID
    ) -> Visita:

        visita = self.repository.buscar_por_id(
            db,
            visita_id
        )

        if visita is None:
            raise HTTPException(
                status_code=404,
                detail="Visita não encontrada."
            )

        return visita


    def atualizar(
        self,
        db: Session,
        visita_id: uuid.UUID,
        dados: VisitaUpdate
    ) -> Visita:

        visita = self.buscar_por_id(
            db,
            visita_id
        )

        if dados.apartamento_id is not None:
            visita.apartamento_id = (
                dados.apartamento_id
            )

        if dados.contato_id is not None:
            visita.contato_id = (
                dados.contato_id
            )

        if dados.corretor_id is not None:
            visita.corretor_id = (
                dados.corretor_id
            )

        if dados.data is not None:
            visita.data = dados.data

        if dados.hora_inicio is not None:
            visita.hora_inicio = (
                dados.hora_inicio
            )

        if dados.hora_fim is not None:
            visita.hora_fim = (
                dados.hora_fim
            )

        if dados.status is not None:
            visita.status = dados.status

        if dados.observacoes is not None:
            visita.observacoes = (
                dados.observacoes
            )

        return self.repository.atualizar(
            db,
            visita
        )


    def deletar(
        self,
        db: Session,
        visita_id: uuid.UUID
    ) -> None:

        visita = self.buscar_por_id(
            db,
            visita_id
        )

        self.repository.deletar(
            db,
            visita
        )


    @staticmethod
    def _horarios_conflitam(
        inicio_a: time,
        fim_a: time | None,
        inicio_b: time,
        fim_b: time | None
    ) -> bool:

        fim_a_real = (
            fim_a or inicio_a
        )

        fim_b_real = (
            fim_b or inicio_b
        )

        return (
            inicio_a < fim_b_real
            and inicio_b < fim_a_real
        )
