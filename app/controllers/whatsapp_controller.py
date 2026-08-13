from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
)

from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.mensagem import Mensagem
from app.repositories.mensagem import MensagemRepository
from app.services.conversa_service import ConversaService
from app.services.whatsapp_service import WhatsAppService


router = APIRouter(
    prefix="/whatsapp",
    tags=["WhatsApp"]
)


whatsapp_service = WhatsAppService()
conversa_service = ConversaService()
mensagem_repository = MensagemRepository()


@router.get("/connect")
def conectar_whatsapp():

    try:

        return whatsapp_service.conectar()

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


@router.get("/status")
def status_whatsapp():

    try:

        return whatsapp_service.status()

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


@router.post("/webhook")
async def webhook_whatsapp(
    request: Request,
    db: Session = Depends(get_db),
):

    payload = await request.json()

    resultado = whatsapp_service.processar_webhook(
        payload
    )

    if not resultado["processado"]:
        return resultado

    telefone = resultado["telefone"]
    nome = resultado["nome"] or "WhatsApp"
    texto = resultado["texto"]
    message_id = resultado["message_id"]
    from_me = resultado["from_me"]

    # ============================================================
    # EVITA DUPLICAR A MESMA MENSAGEM
    # ============================================================

    mensagem_existente = (
        mensagem_repository.buscar_por_whatsapp_id(
            db,
            message_id
        )
    )

    if mensagem_existente:

        return {
            "success": True,
            "duplicada": True,
            "mensagem_id": mensagem_existente.id,
        }

    # ============================================================
    # NORMALIZA O TELEFONE
    # ============================================================

    telefone = ConversaService.normalizar_telefone(
        telefone
    )

    # ============================================================
    # LOCALIZA OU CRIA A CONVERSA
    # ============================================================

    conversa = conversa_service.criar_ou_atualizar(
        db=db,
        nome=nome,
        telefone=telefone,
    )

    # ============================================================
    # DEFINE A DIREÇÃO
    # ============================================================

    direcao = (
        "enviada"
        if from_me
        else "recebida"
    )

    # ============================================================
    # CRIA A MENSAGEM
    # ============================================================

    mensagem = Mensagem(
        conversa_id=conversa.id,
        direcao=direcao,
        tipo="texto",
        texto=texto,
        whatsapp_message_id=message_id,
    )

    mensagem_repository.criar(
        db,
        mensagem
    )

    # ============================================================
    # ATUALIZA A CONVERSA
    # ============================================================

    conversa.ultima_mensagem = texto

    if not from_me:
        conversa.nao_lidas += 1
    else:
        conversa.nao_lidas = 0

    db.commit()
    db.refresh(conversa)

    return {
        "success": True,
        "processado": True,
        "conversa_id": conversa.id,
        "mensagem_id": mensagem.id,
        "direcao": direcao,
    }