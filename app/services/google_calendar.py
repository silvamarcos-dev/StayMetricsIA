import os

from datetime import datetime

from dotenv import load_dotenv

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build


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


# ============================================================
# CRIAR FLOW OAuth
# ============================================================

def criar_flow() -> Flow:

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

    flow = Flow.from_client_config(
        client_config,
        scopes=SCOPES,
        redirect_uri=GOOGLE_REDIRECT_URI,
    )

    return flow


# ============================================================
# CRIAR CREDENCIAIS A PARTIR DO REFRESH TOKEN
# ============================================================

def criar_credentials(
    refresh_token: str,
) -> Credentials:

    credentials = Credentials(
        token=None,
        refresh_token=refresh_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=GOOGLE_CLIENT_ID,
        client_secret=GOOGLE_CLIENT_SECRET,
        scopes=SCOPES,
    )

    if not credentials.valid:

        credentials.refresh(
            Request()
        )

    return credentials


# ============================================================
# CRIAR CLIENTE GOOGLE CALENDAR
# ============================================================

def criar_servico_calendar(
    refresh_token: str,
):

    credentials = criar_credentials(
        refresh_token
    )

    return build(
        "calendar",
        "v3",
        credentials=credentials,
        cache_discovery=False,
    )


# ============================================================
# CRIAR EVENTO
# ============================================================

def criar_evento(
    refresh_token: str,
    calendar_id: str,
    titulo: str,
    inicio: datetime,
    fim: datetime,
    descricao: str | None = None,
):

    service = criar_servico_calendar(
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

    return service.events().insert(
        calendarId=calendar_id,
        body=evento,
    ).execute()


# ============================================================
# ATUALIZAR EVENTO
# ============================================================

def atualizar_evento(
    refresh_token: str,
    calendar_id: str,
    google_event_id: str,
    titulo: str,
    inicio: datetime,
    fim: datetime,
    descricao: str | None = None,
):

    service = criar_servico_calendar(
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

    return service.events().update(
        calendarId=calendar_id,
        eventId=google_event_id,
        body=evento,
    ).execute()


# ============================================================
# DELETAR EVENTO
# ============================================================

def deletar_evento(
    refresh_token: str,
    calendar_id: str,
    google_event_id: str,
) -> None:

    service = criar_servico_calendar(
        refresh_token
    )

    service.events().delete(
        calendarId=calendar_id,
        eventId=google_event_id,
    ).execute()