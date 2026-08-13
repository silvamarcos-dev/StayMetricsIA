import uuid

from datetime import datetime

from sqlalchemy.orm import Session

from app.models.google_calendar import (
    GoogleCalendarIntegration,
)

from app.repositories.google_calendar import (
    GoogleCalendarRepository,
)


class GoogleCalendarService:

    def __init__(self):

        self.repository = (
            GoogleCalendarRepository()
        )

    # ============================================================
    # BUSCAR INTEGRAÇÃO
    # ============================================================

    def buscar_integracao(
        self,
        db: Session,
        configuracao_id: uuid.UUID,
    ) -> GoogleCalendarIntegration | None:

        return self.repository.buscar_por_configuracao(
            db=db,
            configuracao_id=configuracao_id,
        )

    # ============================================================
    # SALVAR INTEGRAÇÃO
    # ============================================================

    def salvar_integracao(
        self,
        db: Session,
        configuracao_id: uuid.UUID,
        email_google: str | None,
        refresh_token: str,
        calendar_id: str = "primary",
    ) -> GoogleCalendarIntegration:

        integracao = (
            self.repository.buscar_por_configuracao(
                db=db,
                configuracao_id=configuracao_id,
            )
        )

        # --------------------------------------------------------
        # ATUALIZA INTEGRAÇÃO EXISTENTE
        # --------------------------------------------------------

        if integracao:

            integracao.email_google = (
                email_google
            )

            integracao.refresh_token = (
                refresh_token
            )

            integracao.calendar_id = (
                calendar_id
            )

            integracao.conectado = True

            return self.repository.atualizar(
                db=db,
                integracao=integracao,
            )

        # --------------------------------------------------------
        # CRIA NOVA INTEGRAÇÃO
        # --------------------------------------------------------

        integracao = GoogleCalendarIntegration(
            configuracao_id=configuracao_id,
            email_google=email_google,
            refresh_token=refresh_token,
            calendar_id=calendar_id,
            conectado=True,
        )

        return self.repository.criar(
            db=db,
            integracao=integracao,
        )

    # ============================================================
    # DESCONECTAR
    # ============================================================

    def desconectar(
        self,
        db: Session,
        configuracao_id: uuid.UUID,
    ) -> None:

        integracao = (
            self.repository.buscar_por_configuracao(
                db=db,
                configuracao_id=configuracao_id,
            )
        )

        if not integracao:
            return

        integracao.conectado = False

        self.repository.atualizar(
            db=db,
            integracao=integracao,
        )

    # ============================================================
    # CRIAR EVENTO
    # ============================================================

    def criar_evento(
        self,
        db: Session,
        configuracao_id: uuid.UUID,
        titulo: str,
        inicio: datetime,
        fim: datetime,
        descricao: str | None = None,
    ):

        integracao = (
            self.repository.buscar_por_configuracao(
                db=db,
                configuracao_id=configuracao_id,
            )
        )

        if not integracao:

            raise ValueError(
                "Google Calendar não está conectado."
            )

        if not integracao.conectado:

            raise ValueError(
                "Google Calendar está desconectado."
            )

        return self.repository.criar_evento(
            refresh_token=(
                integracao.refresh_token
            ),
            calendar_id=(
                integracao.calendar_id
            ),
            titulo=titulo,
            inicio=inicio,
            fim=fim,
            descricao=descricao,
        )

    # ============================================================
    # ATUALIZAR EVENTO
    # ============================================================

    def atualizar_evento(
        self,
        db: Session,
        configuracao_id: uuid.UUID,
        google_event_id: str,
        titulo: str,
        inicio: datetime,
        fim: datetime,
        descricao: str | None = None,
    ):

        integracao = (
            self.repository.buscar_por_configuracao(
                db=db,
                configuracao_id=configuracao_id,
            )
        )

        if not integracao:

            raise ValueError(
                "Google Calendar não está conectado."
            )

        if not integracao.conectado:

            raise ValueError(
                "Google Calendar está desconectado."
            )

        return self.repository.atualizar_evento(
            refresh_token=(
                integracao.refresh_token
            ),
            calendar_id=(
                integracao.calendar_id
            ),
            google_event_id=google_event_id,
            titulo=titulo,
            inicio=inicio,
            fim=fim,
            descricao=descricao,
        )

    # ============================================================
    # DELETAR EVENTO
    # ============================================================

    def deletar_evento(
        self,
        db: Session,
        configuracao_id: uuid.UUID,
        google_event_id: str,
    ) -> None:

        integracao = (
            self.repository.buscar_por_configuracao(
                db=db,
                configuracao_id=configuracao_id,
            )
        )

        if not integracao:

            raise ValueError(
                "Google Calendar não está conectado."
            )

        if not integracao.conectado:

            raise ValueError(
                "Google Calendar está desconectado."
            )

        self.repository.deletar_evento(
            refresh_token=(
                integracao.refresh_token
            ),
            calendar_id=(
                integracao.calendar_id
            ),
            google_event_id=google_event_id,
        )