import os

from datetime import datetime
from uuid import UUID

from dotenv import load_dotenv

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build

from sqlalchemy.orm import Session

from app.models.google_calendar import (
    GoogleCalendarIntegration,
)


load_dotenv()


GOOGLE_CLIENT_ID = os.getenv(
    "GOOGLE_CLIENT_ID"
)

GOOGLE_CLIENT_SECRET = os.getenv(
    "GOOGLE_CLIENT_SECRET"
)

GOOGLE_REDIRECT_URI = os.getenv(
    "GOOGLE_REDIRECT_URI",
    "http://localhost:8000/api/google/calendar/callback",
)


SCOPES = [
    "https://www.googleapis.com/auth/calendar",
]


class GoogleCalendarRepository:

    # ========================================================
    # BANCO DE DADOS
    # ========================================================

    def criar(
        self,
        db: Session,
        integracao: GoogleCalendarIntegration,
    ) -> GoogleCalendarIntegration:

        db.add(integracao)

        db.commit()

        db.refresh(integracao)

        return integracao

    # ========================================================
    # BUSCAR POR CONFIGURAÇÃO
    # ========================================================

    def buscar_por_configuracao(
        self,
        db: Session,
        configuracao_id: UUID,
    ) -> GoogleCalendarIntegration | None:

        return (
            db.query(
                GoogleCalendarIntegration
            )
            .filter(
                GoogleCalendarIntegration.configuracao_id
                == configuracao_id
            )
            .first()
        )

    # ========================================================
    # ATUALIZAR
    # ========================================================

    def atualizar(
        self,
        db: Session,
        integracao: GoogleCalendarIntegration,
    ) -> GoogleCalendarIntegration:

        db.commit()

        db.refresh(integracao)

        return integracao

    # ========================================================
    # OAUTH
    # ========================================================

    def criar_flow(self) -> Flow:

        client_config = {

            "web": {

                "client_id":
                    GOOGLE_CLIENT_ID,

                "client_secret":
                    GOOGLE_CLIENT_SECRET,

                "auth_uri":
                    "https://accounts.google.com/o/oauth2/auth",

                "token_uri":
                    "https://oauth2.googleapis.com/token",

                "redirect_uris": [
                    GOOGLE_REDIRECT_URI,
                ],
            }
        }

        return Flow.from_client_config(
            client_config,
            scopes=SCOPES,
            redirect_uri=GOOGLE_REDIRECT_URI,
        )

    # ========================================================
    # CREDENCIAIS
    # ========================================================

    def criar_credentials(
        self,
        refresh_token: str,
    ) -> Credentials:

        credentials = Credentials(
            token=None,
            refresh_token=refresh_token,
            token_uri=(
                "https://oauth2.googleapis.com/token"
            ),
            client_id=GOOGLE_CLIENT_ID,
            client_secret=GOOGLE_CLIENT_SECRET,
            scopes=SCOPES,
        )

        if not credentials.valid:

            credentials.refresh(
                Request()
            )

        return credentials

    # ========================================================
    # SERVIÇO GOOGLE CALENDAR
    # ========================================================

    def criar_servico(
        self,
        refresh_token: str,
    ):

        credentials = self.criar_credentials(
            refresh_token
        )

        return build(
            "calendar",
            "v3",
            credentials=credentials,
            cache_discovery=False,
        )

    # ========================================================
    # CRIAR EVENTO
    # ========================================================

    def criar_evento(
        self,
        refresh_token: str,
        calendar_id: str,
        titulo: str,
        inicio: datetime,
        fim: datetime,
        descricao: str | None = None,
    ):

        service = self.criar_servico(
            refresh_token
        )

        evento = {

            "summary": titulo,

            "description":
                descricao or "",

            "start": {

                "dateTime":
                    inicio.isoformat(),

                "timeZone":
                    "America/Sao_Paulo",
            },

            "end": {

                "dateTime":
                    fim.isoformat(),

                "timeZone":
                    "America/Sao_Paulo",
            },
        }

        return (
            service.events()
            .insert(
                calendarId=calendar_id,
                body=evento,
            )
            .execute()
        )

    # ========================================================
    # ATUALIZAR EVENTO
    # ========================================================

    def atualizar_evento(
        self,
        refresh_token: str,
        calendar_id: str,
        google_event_id: str,
        titulo: str,
        inicio: datetime,
        fim: datetime,
        descricao: str | None = None,
    ):

        service = self.criar_servico(
            refresh_token
        )

        evento = {

            "summary": titulo,

            "description":
                descricao or "",

            "start": {

                "dateTime":
                    inicio.isoformat(),

                "timeZone":
                    "America/Sao_Paulo",
            },

            "end": {

                "dateTime":
                    fim.isoformat(),

                "timeZone":
                    "America/Sao_Paulo",
            },
        }

        return (
            service.events()
            .update(
                calendarId=calendar_id,
                eventId=google_event_id,
                body=evento,
            )
            .execute()
        )

    # ========================================================
    # DELETAR EVENTO
    # ========================================================

    def deletar_evento(
        self,
        refresh_token: str,
        calendar_id: str,
        google_event_id: str,
    ) -> None:

        service = self.criar_servico(
            refresh_token
        )

        (
            service.events()
            .delete(
                calendarId=calendar_id,
                eventId=google_event_id,
            )
            .execute()
        )