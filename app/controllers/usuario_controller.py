
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.models.usuario import Usuario

from app.schemas.usuario import (
    UsuarioCreate,
    UsuarioResponse,
    UsuarioUpdate
)

from app.services.usuario_service import UsuarioService


router = APIRouter(
    prefix="/api/crm/usuarios",
    tags=["CRM - Usuários"]
)


service = UsuarioService()


@router.post(
    "",
    response_model=UsuarioResponse,
    status_code=201
)
def criar_usuario(
    dados: UsuarioCreate,
    db: Session = Depends(get_db)
):

    try:

        usuario = Usuario(
            nome=dados.nome,
            email=dados.email,
            senhaHash="",
            tipo=dados.tipo,
            ativo=dados.ativo
        )

        return service.criar(
            db,
            usuario,
            dados.senha
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.get(
    "",
    response_model=list[UsuarioResponse]
)
def listar_usuarios(
    page: int = Query(
        default=1,
        ge=1
    ),
    size: int = Query(
        default=10,
        ge=1,
        le=100
    ),
    db: Session = Depends(get_db)
):

    skip = (page - 1) * size

    return service.listar(
        db,
        skip,
        size
    )

@router.get(
    "/corretores",
    response_model=list[UsuarioResponse],
)
def listar_corretores(
    db: Session = Depends(get_db),
):
    return service.listar_corretores(db)

@router.get(
    "/{usuario_id}",
    response_model=UsuarioResponse
)
def buscar_usuario(
    usuario_id: UUID,
    db: Session = Depends(get_db)
):

    try:

        return service.buscar_por_id(
            db,
            usuario_id
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


@router.put(
    "/{usuario_id}",
    response_model=UsuarioResponse
)
def atualizar_usuario(
    usuario_id: UUID,
    dados: UsuarioUpdate,
    db: Session = Depends(get_db)
):

    try:

        dados_atualizacao = dados.model_dump(
            exclude_unset=True
        )

        return service.atualizar(
            db,
            usuario_id,
            dados_atualizacao
        )

    except ValueError as e:

        if "e-mail" in str(e):

            raise HTTPException(
                status_code=400,
                detail=str(e)
            )

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


@router.delete(
    "/{usuario_id}",
    status_code=204
)
def deletar_usuario(
    usuario_id: UUID,
    db: Session = Depends(get_db)
):

    try:

        service.deletar(
            db,
            usuario_id
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e)
        )

