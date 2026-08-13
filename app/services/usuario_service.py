
from uuid import UUID

from argon2 import PasswordHasher
from sqlalchemy.orm import Session

from app.models.usuario import Usuario
from app.repositories.usuario_repository import UsuarioRepository


class UsuarioService:

    def __init__(self):

        self.repository = UsuarioRepository()

        self.password_hasher = PasswordHasher()


    def criar(
        self,
        db: Session,
        usuario: Usuario,
        senha: str
    ) -> Usuario:

        if not usuario.nome or not usuario.nome.strip():

            raise ValueError(
                "Nome do usuário não pode ser vazio"
            )

        usuario_existente = (
            self.repository.buscar_por_email(
                db,
                usuario.email
            )
        )

        if usuario_existente:

            raise ValueError(
                "Já existe um usuário com este e-mail"
            )

        if not senha or not senha.strip():

            raise ValueError(
                "Senha não pode ser vazia"
            )

        usuario.senhaHash = (
            self.password_hasher.hash(senha)
        )

        return self.repository.criar(
            db,
            usuario
        )


    def listar(
        self,
        db: Session,
        skip: int = 0,
        limit: int = 100
    ) -> list[Usuario]:

        return self.repository.listar(
            db,
            skip,
            limit
        )


    def buscar_por_id(
        self,
        db: Session,
        usuario_id: UUID
    ) -> Usuario:

        usuario = (
            self.repository.buscar_por_id(
                db,
                usuario_id
            )
        )

        if not usuario:

            raise ValueError(
                "Usuário não encontrado"
            )

        return usuario


    def atualizar(
        self,
        db: Session,
        usuario_id: UUID,
        dados: dict
    ) -> Usuario:

        usuario = self.buscar_por_id(
            db,
            usuario_id
        )

        if "nome" in dados:

            if (
                not dados["nome"]
                or not dados["nome"].strip()
            ):

                raise ValueError(
                    "Nome do usuário não pode ser vazio"
                )

        if "email" in dados:

            usuario_existente = (
                self.repository.buscar_por_email(
                    db,
                    dados["email"]
                )
            )

            if (
                usuario_existente
                and usuario_existente.id != usuario.id
            ):

                raise ValueError(
                    "Já existe um usuário com este e-mail"
                )

        for campo, valor in dados.items():

            setattr(
                usuario,
                campo,
                valor
            )

        return self.repository.atualizar(
            db,
            usuario
        )


    def deletar(
        self,
        db: Session,
        usuario_id: UUID
    ) -> None:

        usuario = self.buscar_por_id(
            db,
            usuario_id
        )

        self.repository.deletar(
            db,
            usuario
        )

