from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.models.usuario import Usuario

from app.schemas.usuario import (
    UsuarioCreate,
    UsuarioResponse,
)

from app.schemas.auth import (
    LoginRequest,
    TokenResponse,
)

from app.services.auth_service import AuthService
from app.dependencies.auth import get_current_user


router = APIRouter(
    prefix="/api/auth",
    tags=["Autenticação"],
)


service = AuthService()


# ============================================================
# REGISTRAR USUÁRIO
# ============================================================

@router.post(
    "/registrar",
    response_model=UsuarioResponse,
    status_code=201,
)
def registrar(
    dados: UsuarioCreate,
    db: Session = Depends(get_db),
):

    try:

        return service.registrar(
            db=db,
            nome=dados.nome,
            email=dados.email,
            senha=dados.senha,
            tipo=dados.tipo,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


# ============================================================
# LOGIN
# ============================================================

@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    dados: LoginRequest,
    db: Session = Depends(get_db),
):

    try:

        usuario = service.autenticar(
            db=db,
            email=dados.email,
            senha=dados.senha,
        )

        token = service.gerar_token(
            usuario,
        )

        return {
            "access_token": token,
            "token_type": "bearer",
        }

    except ValueError as e:

        raise HTTPException(
            status_code=401,
            detail=str(e),
        )


# ============================================================
# REFRESH TOKEN
# ============================================================

@router.post("/refresh")
def refresh_token(
    refresh_token: str,
    db: Session = Depends(get_db),
):

    novo_token = service.renovar_token(
        db=db,
        refresh_token=refresh_token,
    )

    if novo_token is None:

        raise HTTPException(
            status_code=401,
            detail=(
                "Refresh token inválido "
                "ou expirado."
            ),
        )

    return {
        "sucesso": True,
        "access_token": novo_token,
        "token_type": "bearer",
    }


# ============================================================
# USUÁRIO AUTENTICADO
# ============================================================

@router.get("/me")
def usuario_atual(
    usuario: Usuario = Depends(
        get_current_user,
    ),
):

    return {
        "sucesso": True,
        "usuario": {
            "id": str(usuario.id),
            "nome": usuario.nome,
            "email": usuario.email,
            "tipo": (
                usuario.tipo.value
                if hasattr(usuario.tipo, "value")
                else usuario.tipo
            ),
        },
    }