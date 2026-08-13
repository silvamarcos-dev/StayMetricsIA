
from collections.abc import Callable

from fastapi import Depends, HTTPException, status

from app.dependencies.auth import get_current_user
from app.models.usuario import TipoUsuario, Usuario


def exigir_perfis(
    *perfis_permitidos: TipoUsuario,
) -> Callable:

    def verificar_permissao(
        usuario: Usuario = Depends(
            get_current_user
        ),
    ) -> Usuario:

        if usuario.tipo not in perfis_permitidos:

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Você não possui permissão para executar esta ação.",
            )

        return usuario

    return verificar_permissao

