
from uuid import UUID

from app.dependencies.permissions import exigir_perfis
from app.models.usuario import TipoUsuario
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.contato import Contato
from app.schemas.contato import (
    ContatoCreate,
    ContatoResponse,
    ContatoUpdate,
)
from app.services.contato_service import ContatoService


router = APIRouter(
    prefix="/api/crm/contatos",
    tags=["CRM - Contatos"],
    dependencies=[
        Depends(get_current_user)
    ],
)


service = ContatoService()


@router.post(
    "",
    response_model=ContatoResponse,
    status_code=201,
)
def criar_contato(
    dados: ContatoCreate,
    db: Session = Depends(get_db),
):

    try:

        contato = Contato(
            nome=dados.nome,
            telefoneWhatsapp=dados.telefoneWhatsapp,
            email=dados.email,
            apartamentoVinculado=dados.apartamentoVinculado,
            tipo=dados.tipo,
            observacoes=dados.observacoes,
            whatsappOptIn=dados.whatsappOptIn,
        )

        return service.criar(
            db,
            contato,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.get(
    "",
    response_model=list[ContatoResponse],
)
def listar_contatos(
    page: int = Query(
        default=1,
        ge=1,
    ),
    size: int = Query(
        default=10,
        ge=1,
        le=100,
    ),
    db: Session = Depends(get_db),
):

    skip = (page - 1) * size

    return service.listar(
        db,
        skip,
        size,
    )


@router.get(
    "/{contato_id}",
    response_model=ContatoResponse,
)
def buscar_contato(
    contato_id: UUID,
    db: Session = Depends(get_db),
):

    try:

        return service.buscar_por_id(
            db,
            contato_id,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


@router.put(
    "/{contato_id}",
    response_model=ContatoResponse,
    dependencies=[
        Depends(
            exigir_perfis(
                TipoUsuario.ADMINISTRADOR,
                TipoUsuario.CORRETOR,
            )
        )
    ],
)
def atualizar_contato(
    contato_id: UUID,
    dados: ContatoUpdate,
    db: Session = Depends(get_db),
):

    try:

        dados_atualizacao = dados.model_dump(
            exclude_unset=True,
        )

        return service.atualizar(
            db,
            contato_id,
            dados_atualizacao,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


@router.delete(
    "/{contato_id}",
    status_code=204,
    dependencies=[
        Depends(
            exigir_perfis(
                TipoUsuario.ADMINISTRADOR,
            )
        )
    ],
)
def deletar_contato(
    contato_id: UUID,
    db: Session = Depends(get_db),
):

    try:

        service.deletar(
            db,
            contato_id,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )

