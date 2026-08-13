
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.contato import Contato
from app.repositories.contato_repository import ContatoRepository
from app.services.conversa_service import ConversaService


class ContatoService:

    def __init__(self):
        self.repository = ContatoRepository()
        self.conversa_service = ConversaService()

    def criar(
        self,
        db: Session,
        contato: Contato
    ) -> Contato:

        if not contato.nome or not contato.nome.strip():
            raise ValueError(
                "Nome do contato não pode ser vazio"
            )

        contato = self.repository.criar(
            db,
            contato
        )

        # Só cria conversa se existir telefone
        if contato.telefoneWhatsapp:

            self.conversa_service.criar_ou_atualizar(
                db=db,
                nome=contato.nome,
                telefone=contato.telefoneWhatsapp,
            )

        return contato

    def listar(
        self,
        db: Session,
        skip: int = 0,
        limit: int = 100
    ) -> list[Contato]:

        return self.repository.listar(
            db,
            skip,
            limit
        )

    def buscar_por_id(
        self,
        db: Session,
        contato_id: UUID
    ) -> Contato:

        contato = self.repository.buscar_por_id(
            db,
            contato_id
        )

        if not contato:
            raise ValueError(
                "Contato não encontrado"
            )

        return contato

    def atualizar(
        self,
        db: Session,
        contato_id: UUID,
        dados: dict
    ) -> Contato:

        contato = self.buscar_por_id(
            db,
            contato_id
        )

        if "nome" in dados:

            if (
                not dados["nome"]
                or not dados["nome"].strip()
            ):
                raise ValueError(
                    "Nome do contato não pode ser vazio"
                )

        for campo, valor in dados.items():
            setattr(
                contato,
                campo,
                valor
            )

        contato = self.repository.atualizar(
            db,
            contato
        )

        # Se nome ou telefone mudou,
        # mantém a conversa sincronizada.
        if (
            contato.telefoneWhatsapp
            and (
                "nome" in dados
                or "telefoneWhatsapp" in dados
            )
        ):

            self.conversa_service.criar_ou_atualizar(
                db=db,
                nome=contato.nome,
                telefone=contato.telefoneWhatsapp,
            )

        return contato

    def deletar(
        self,
        db: Session,
        contato_id: UUID
    ) -> None:

        contato = self.buscar_por_id(
            db,
            contato_id
        )

        self.repository.deletar(
            db,
            contato
        )

