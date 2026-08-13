from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.models.apartamento import Apartamento

from app.schemas.apartamento import (
    ApartamentoCreate,
    ApartamentoResponse,
    ApartamentoUpdate,
)

from app.services.apartamento_service import (
    ApartamentoService,
)


router = APIRouter(
    prefix="/api/crm/apartamentos",
    tags=["CRM - Apartamentos"],
)


service = ApartamentoService()


# ============================================================
# CRIAR APARTAMENTO
# ============================================================

@router.post(
    "",
    response_model=ApartamentoResponse,
    status_code=201,
)
def criar_apartamento(
    dados: ApartamentoCreate,
    db: Session = Depends(get_db),
) -> Apartamento:

    try:

        apartamento = Apartamento(
            numero=dados.numero,
            bloco=dados.bloco,
            status=dados.status,
            proprietarioId=dados.proprietarioId,
            observacoes=dados.observacoes,
        )

        return service.criar(
            db,
            apartamento,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


# ============================================================
# LISTAR APARTAMENTOS
# ============================================================

@router.get(
    "",
    response_model=list[ApartamentoResponse],
)
def listar_apartamentos(
    page: int = Query(
        default=1,
        ge=1,
        description="Número da página",
    ),
    size: int = Query(
        default=10,
        ge=1,
        le=100,
        description="Quantidade de apartamentos por página",
    ),
    db: Session = Depends(get_db),
) -> list[Apartamento]:

    skip = (page - 1) * size

    return service.listar(
        db,
        skip,
        size,
    )


# ============================================================
# BUSCAR APARTAMENTO POR ID
# ============================================================

@router.get(
    "/{apartamento_id}",
    response_model=ApartamentoResponse,
)
def buscar_apartamento(
    apartamento_id: UUID,
    db: Session = Depends(get_db),
) -> Apartamento:

    try:

        return service.buscar_por_id(
            db,
            apartamento_id,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


# ============================================================
# ATUALIZAR APARTAMENTO
# ============================================================

@router.put(
    "/{apartamento_id}",
    response_model=ApartamentoResponse,
)
def atualizar_apartamento(
    apartamento_id: UUID,
    dados: ApartamentoUpdate,
    db: Session = Depends(get_db),
) -> Apartamento:

    try:

        dados_atualizacao = dados.model_dump(
            exclude_unset=True,
        )

        return service.atualizar(
            db,
            apartamento_id,
            dados_atualizacao,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


# ============================================================
# DELETAR APARTAMENTO
# ============================================================

@router.delete(
    "/{apartamento_id}",
    status_code=204,
)
def deletar_apartamento(
    apartamento_id: UUID,
    db: Session = Depends(get_db),
) -> None:

    try:

        service.deletar(
            db,
            apartamento_id,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )