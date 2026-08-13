
import uuid

from datetime import date

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.visita import (
    VisitaCreate,
    VisitaResponse,
    VisitaUpdate,
)
from app.services.visita_service import VisitaService


router = APIRouter(
    prefix="/api/agenda",
    tags=["Agenda"]
)


visita_service = VisitaService()


@router.post(
    "/visitas",
    response_model=VisitaResponse,
    status_code=status.HTTP_201_CREATED
)
def criar_visita(
    dados: VisitaCreate,
    db: Session = Depends(get_db)
):

    return visita_service.criar(
        db=db,
        dados=dados
    )


@router.get(
    "/visitas",
    response_model=list[VisitaResponse]
)
def listar_visitas(
    data: date | None = None,
    db: Session = Depends(get_db)
):

    return visita_service.listar(
        db=db,
        data=data
    )


@router.get(
    "/visitas/{visita_id}",
    response_model=VisitaResponse
)
def buscar_visita(
    visita_id: uuid.UUID,
    db: Session = Depends(get_db)
):

    return visita_service.buscar_por_id(
        db=db,
        visita_id=visita_id
    )


@router.put(
    "/visitas/{visita_id}",
    response_model=VisitaResponse
)
def atualizar_visita(
    visita_id: uuid.UUID,
    dados: VisitaUpdate,
    db: Session = Depends(get_db)
):

    return visita_service.atualizar(
        db=db,
        visita_id=visita_id,
        dados=dados
    )


@router.delete(
    "/visitas/{visita_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def deletar_visita(
    visita_id: uuid.UUID,
    db: Session = Depends(get_db)
):

    visita_service.deletar(
        db=db,
        visita_id=visita_id
    )

    return None

