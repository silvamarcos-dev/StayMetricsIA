from datetime import datetime, timedelta, timezone

import jwt

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

from sqlalchemy.orm import Session

from app.core.config import (
    JWT_ALGORITHM,
    JWT_EXPIRE_MINUTES,
    JWT_SECRET_KEY,
)

from app.models.usuario import Usuario

from app.repositories.usuario_repository import (
    UsuarioRepository,
)


class AuthService:

    def __init__(self):

        self.repository = UsuarioRepository()

        self.password_hasher = PasswordHasher()


    # ============================================================
    # REGISTRAR USUÁRIO
    # ============================================================

    def registrar(
        self,
        db: Session,
        nome: str,
        email: str,
        senha: str,
        tipo,
    ) -> Usuario:

        if not nome.strip():

            raise ValueError(
                "Nome do usuário não pode ser vazio"
            )

        usuario_existente = (
            self.repository.buscar_por_email(
                db,
                email.lower(),
            )
        )

        if usuario_existente:

            raise ValueError(
                "Já existe um usuário com este e-mail"
            )

        senha_hash = self.password_hasher.hash(
            senha
        )

        usuario = Usuario(
            nome=nome.strip(),
            email=email.lower(),
            senhaHash=senha_hash,
            tipo=tipo,
        )

        return self.repository.criar(
            db,
            usuario,
        )


    # ============================================================
    # AUTENTICAR USUÁRIO
    # ============================================================

    def autenticar(
        self,
        db: Session,
        email: str,
        senha: str,
    ) -> Usuario:

        usuario = (
            self.repository.buscar_por_email(
                db,
                email.lower(),
            )
        )

        if not usuario:

            raise ValueError(
                "E-mail ou senha inválidos"
            )

        try:

            senha_valida = (
                self.password_hasher.verify(
                    usuario.senhaHash,
                    senha,
                )
            )

        except VerifyMismatchError:

            raise ValueError(
                "E-mail ou senha inválidos"
            )

        if not senha_valida:

            raise ValueError(
                "E-mail ou senha inválidos"
            )

        if not usuario.ativo:

            raise ValueError(
                "Usuário está inativo"
            )

        return usuario


    # ============================================================
    # GERAR TOKEN JWT
    # ============================================================

    def gerar_token(
        self,
        usuario: Usuario,
    ) -> str:

        print(
            "GERANDO TOKEN PARA:",
            usuario.nome,
            usuario.email,
            usuario.id,
        )

        agora = datetime.now(
            timezone.utc
        )

        expiracao = (
            agora
            + timedelta(
                minutes=JWT_EXPIRE_MINUTES
            )
        )

        payload = {
            "sub": str(usuario.id),
            "email": usuario.email,
            "tipo": usuario.tipo.value,
            "iat": agora,
            "exp": expiracao,
        }

        token = jwt.encode(
            payload,
            JWT_SECRET_KEY,
            algorithm=JWT_ALGORITHM,
        )

        return token