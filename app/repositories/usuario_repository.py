
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.usuario import Usuario


class UsuarioRepository:

    def criar(
        self,
        db: Session,
        usuario: Usuario
    ) -> Usuario:

        db.add(usuario)

        db.commit()

        db.refresh(usuario)

        return usuario


    def listar(
        self,
        db: Session,
        skip: int = 0,
        limit: int = 100
    ) -> list[Usuario]:

        return (
            db.query(Usuario)
            .offset(skip)
            .limit(limit)
            .all()
        )


    def buscar_por_id(
        self,
        db: Session,
        usuario_id: UUID
    ) -> Usuario | None:

        return (
            db.query(Usuario)
            .filter(
                Usuario.id == usuario_id
            )
            .first()
        )


    def buscar_por_email(
        self,
        db: Session,
        email: str
    ) -> Usuario | None:

        return (
            db.query(Usuario)
            .filter(
                Usuario.email == email
            )
            .first()
        )


    def atualizar(
        self,
        db: Session,
        usuario: Usuario
    ) -> Usuario:

        db.commit()

        db.refresh(usuario)

        return usuario


    def deletar(
        self,
        db: Session,
        usuario: Usuario
    ) -> None:

        db.delete(usuario)

        db.commit()

