from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.dependencies.permissions import exigir_perfis
from app.models.usuario import TipoUsuario

from app.schemas.configuracao import (
    ConfiguracaoResponse,
    ConfiguracaoUpdate,
)

from app.services.configuracao_service import (
    ConfiguracaoService,
)


router = APIRouter(
    prefix="/api/configuracoes",
    tags=["Configurações"],
    dependencies=[
        Depends(get_current_user),
    ],
)


service = ConfiguracaoService()


# ============================================================
# BUSCAR CONFIGURAÇÕES
# ============================================================

@router.get(
    "",
    response_model=ConfiguracaoResponse,
)
def buscar_configuracoes(
    db: Session = Depends(get_db),
):

    return service.buscar(db)


# ============================================================
# ATUALIZAR CONFIGURAÇÕES
# ============================================================

@router.put(
    "",
    response_model=ConfiguracaoResponse,
    dependencies=[
        Depends(
            exigir_perfis(
                TipoUsuario.ADMINISTRADOR,
            )
        )
    ],
)
def atualizar_configuracoes(
    dados: ConfiguracaoUpdate,
    db: Session = Depends(get_db),
):

    try:

        dados_atualizacao = dados.model_dump(
            exclude_unset=True,
        )

        return service.atualizar(
            db,
            dados_atualizacao,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )