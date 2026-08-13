import uuid

from datetime import date

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query
)

from sqlalchemy.orm import Session

from app.database.session import get_db

from app.models.visita import Visita

from app.schemas.visita import (
    VisitaCreate,
    VisitaResponse
)

from app.services.agenda_service import (
    AgendaService
)


router = APIRouter(
    prefix="/api/agenda",
    tags=["Agenda"]
)


agenda_service = AgendaService()


# ============================================================
# CRIAR VISITA
# ============================================================

@router.post(
    "/visitas",
    response_model=VisitaResponse,
    status_code=201
)
def criar_visita(
    dados: VisitaCreate,
    db: Session = Depends(get_db)
):

    visita = Visita(
        apartamento_id=dados.apartamento_id,
        contato_id=dados.contato_id,
        corretor_id=dados.corretor_id,
        data=dados.data,
        hora_inicio=dados.hora_inicio,
        hora_fim=dados.hora_fim,
        observacoes=dados.observacoes
    )

    try:

        return agenda_service.criar_visita(
            db=db,
            visita=visita
        )

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )


# ============================================================
# LISTAR VISITAS
# ============================================================

@router.get(
    "/visitas",
    response_model=list[VisitaResponse]
)
def listar_visitas(
    data: date | None = Query(
        default=None,
        description="Filtra as visitas por data."
    ),
    db: Session = Depends(get_db)
):

    if data:

        return agenda_service.listar_visitas_por_data(
            db=db,
            data=data
        )

    return agenda_service.listar_visitas(
        db=db
    )


# ============================================================
# BUSCAR VISITA
# ============================================================

@router.get(
    "/visitas/{visita_id}",
    response_model=VisitaResponse
)
def buscar_visita(
    visita_id: uuid.UUID,
    db: Session = Depends(get_db)
):

    visita = agenda_service.buscar_por_id(
        db=db,
        visita_id=visita_id
    )

    if not visita:

        raise HTTPException(
            status_code=404,
            detail="Visita não encontrada."
        )

    return visita