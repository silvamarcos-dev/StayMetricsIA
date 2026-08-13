from fastapi import APIRouter, Depends, Query
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.configuracao import Configuracao
from app.models.google_calendar import GoogleCalendarIntegration
from app.services.google_calendar import criar_flow


router = APIRouter(
    prefix="/api/google/calendar",
    tags=["Google Calendar"],
)


# ============================================================
# ESTADOS OAuth
# ============================================================

# Temporário para desenvolvimento.
#
# Em produção, isso deve ser substituído por Redis ou
# algum armazenamento persistente associado ao usuário.
oauth_states: dict[str, str] = {}


# ============================================================
# URL DO FRONTEND
# ============================================================

FRONTEND_CONFIGURACOES_URL = (
    "http://localhost:5173/configuracoes"
)


# ============================================================
# CONECTAR GOOGLE CALENDAR
# ============================================================

@router.get("/connect")
def conectar_google_calendar():

    flow = criar_flow()

    authorization_url, state = (
        flow.authorization_url(
            access_type="offline",
            include_granted_scopes="true",
            prompt="consent",
        )
    )

    # --------------------------------------------------------
    # SALVAR CODE VERIFIER
    # --------------------------------------------------------

    if flow.code_verifier:

        oauth_states[state] = (
            flow.code_verifier
        )

    return RedirectResponse(
        url=authorization_url
    )


# ============================================================
# CALLBACK GOOGLE
# ============================================================

@router.get("/callback")
def google_calendar_callback(
    code: str = Query(...),
    state: str = Query(...),
    db: Session = Depends(get_db),
):

    try:

        # ----------------------------------------------------
        # RECUPERAR CODE VERIFIER
        # ----------------------------------------------------

        code_verifier = oauth_states.pop(
            state,
            None,
        )

        if not code_verifier:

            return RedirectResponse(
                url=(
                    f"{FRONTEND_CONFIGURACOES_URL}"
                    "?google=erro"
                )
            )


        # ----------------------------------------------------
        # RECRIAR FLOW
        # ----------------------------------------------------

        flow = criar_flow()

        flow.code_verifier = (
            code_verifier
        )


        # ----------------------------------------------------
        # TROCAR CODE POR TOKEN
        # ----------------------------------------------------

        flow.fetch_token(
            code=code
        )

        credentials = flow.credentials


        # ----------------------------------------------------
        # VALIDAR REFRESH TOKEN
        # ----------------------------------------------------

        if not credentials.refresh_token:

            return RedirectResponse(
                url=(
                    f"{FRONTEND_CONFIGURACOES_URL}"
                    "?google=erro"
                )
            )


        # ----------------------------------------------------
        # BUSCAR CONFIGURAÇÃO ATIVA
        # ----------------------------------------------------

        configuracao = (
            db.query(Configuracao)
            .filter(
                Configuracao.ativo.is_(True)
            )
            .first()
        )


        if not configuracao:

            return RedirectResponse(
                url=(
                    f"{FRONTEND_CONFIGURACOES_URL}"
                    "?google=erro"
                )
            )


        # ----------------------------------------------------
        # BUSCAR INTEGRAÇÃO EXISTENTE
        # ----------------------------------------------------

        integracao = (
            db.query(
                GoogleCalendarIntegration
            )
            .filter(
                GoogleCalendarIntegration.configuracao_id
                == configuracao.id
            )
            .first()
        )


        # ----------------------------------------------------
        # E-MAIL GOOGLE
        # ----------------------------------------------------
        #
        # Neste momento deixamos None caso não exista uma
        # informação de e-mail disponível.
        #
        # Posteriormente podemos buscar o e-mail através
        # da API Google UserInfo.
        # ----------------------------------------------------

        email_google = None


        # ----------------------------------------------------
        # ATUALIZAR INTEGRAÇÃO EXISTENTE
        # ----------------------------------------------------

        if integracao:

            integracao.refresh_token = (
                credentials.refresh_token
            )

            integracao.calendar_id = (
                "primary"
            )

            integracao.conectado = True

            integracao.email_google = (
                email_google
            )


        # ----------------------------------------------------
        # CRIAR NOVA INTEGRAÇÃO
        # ----------------------------------------------------

        else:

            integracao = (
                GoogleCalendarIntegration(

                    configuracao_id=(
                        configuracao.id
                    ),

                    email_google=(
                        email_google
                    ),

                    refresh_token=(
                        credentials.refresh_token
                    ),

                    calendar_id=(
                        "primary"
                    ),

                    conectado=True,
                )
            )

            db.add(integracao)


        # ----------------------------------------------------
        # SALVAR NO BANCO
        # ----------------------------------------------------

        db.commit()

        db.refresh(integracao)


        # ----------------------------------------------------
        # VOLTAR PARA O FRONTEND
        # ----------------------------------------------------

        return RedirectResponse(
            url=(
                f"{FRONTEND_CONFIGURACOES_URL}"
                "?google=conectado"
            )
        )


    except Exception as error:

        print(
            "Erro no OAuth do Google Calendar:",
            error,
        )

        db.rollback()

        return RedirectResponse(
            url=(
                f"{FRONTEND_CONFIGURACOES_URL}"
                "?google=erro"
            )
        )


# ============================================================
# STATUS GOOGLE CALENDAR
# ============================================================

@router.get("/status")
def status_google_calendar(
    db: Session = Depends(get_db),
):

    # --------------------------------------------------------
    # BUSCAR CONFIGURAÇÃO ATIVA
    # --------------------------------------------------------

    configuracao = (
        db.query(Configuracao)
        .filter(
            Configuracao.ativo.is_(True)
        )
        .first()
    )


    # --------------------------------------------------------
    # NÃO EXISTE CONFIGURAÇÃO
    # --------------------------------------------------------

    if not configuracao:

        return {
            "conectado": False,
            "email_google": None,
            "calendar_id": None,
        }


    # --------------------------------------------------------
    # BUSCAR INTEGRAÇÃO
    # --------------------------------------------------------

    integracao = (
        db.query(
            GoogleCalendarIntegration
        )
        .filter(
            GoogleCalendarIntegration.configuracao_id
            == configuracao.id
        )
        .first()
    )


    # --------------------------------------------------------
    # NÃO EXISTE INTEGRAÇÃO
    # --------------------------------------------------------

    if not integracao:

        return {
            "conectado": False,
            "email_google": None,
            "calendar_id": None,
        }


    # --------------------------------------------------------
    # RETORNAR STATUS
    # --------------------------------------------------------

    return {
        "conectado": bool(
            integracao.conectado
        ),

        "email_google": (
            integracao.email_google
        ),

        "calendar_id": (
            integracao.calendar_id
        ),
    }