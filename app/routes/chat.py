
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.conversa import Conversa
from app.models.mensagem import Mensagem
from app.schemas.conversa import ConversaResponse
from app.schemas.mensagem import MensagemCriar, MensagemResponse
from app.services.whatsapp_service import WhatsAppService


router = APIRouter(
    prefix="/api/chat",
    tags=["Chat"],
)


whatsapp_service = WhatsAppService()


@router.get(
    "/conversas",
    response_model=list[ConversaResponse],
)
def listar_conversas(
    db: Session = Depends(get_db),
):
    return (
        db.query(Conversa)
        .order_by(Conversa.atualizado_em.desc())
        .all()
    )


@router.get(
    "/conversas/{conversa_id}/mensagens",
    response_model=list[MensagemResponse],
)
def listar_mensagens(
    conversa_id: int,
    db: Session = Depends(get_db),
):
    conversa = (
        db.query(Conversa)
        .filter(Conversa.id == conversa_id)
        .first()
    )

    if not conversa:
        raise HTTPException(
            status_code=404,
            detail="Conversa não encontrada.",
        )

    return (
        db.query(Mensagem)
        .filter(Mensagem.conversa_id == conversa_id)
        .order_by(Mensagem.horario.asc())
        .all()
    )


@router.post(
    "/conversas/{conversa_id}/mensagens",
    response_model=MensagemResponse,
)
def enviar_mensagem(
    conversa_id: int,
    dados: MensagemCriar,
    db: Session = Depends(get_db),
):
    conversa = (
        db.query(Conversa)
        .filter(Conversa.id == conversa_id)
        .first()
    )

    if not conversa:
        raise HTTPException(
            status_code=404,
            detail="Conversa não encontrada.",
        )

    texto = dados.texto.strip()

    if not texto:
        raise HTTPException(
            status_code=422,
            detail="A mensagem não pode ser vazia.",
        )

    try:
        # ========================================================
        # ENVIA PARA O WHATSAPP ATRAVÉS DA EVOLUTION API
        # ========================================================

        whatsapp_service.enviar_mensagem(
            telefone=conversa.telefone,
            mensagem=texto,
        )

    except Exception as e:
        db.rollback()

        raise HTTPException(
            status_code=502,
            detail=f"Erro ao enviar mensagem pelo WhatsApp: {str(e)}",
        )

    # ============================================================
    # SALVA A MENSAGEM NO BANCO
    # ============================================================

    mensagem = Mensagem(
        conversa_id=conversa_id,
        tipo="enviada",
        texto=texto,
    )

    db.add(mensagem)

    conversa.ultima_mensagem = texto
    conversa.nao_lidas = 0

    db.commit()
    db.refresh(mensagem)

    return mensagem


@router.post(
    "/conversas/{conversa_id}/arquivos",
    response_model=MensagemResponse,
)
async def enviar_arquivo(
    conversa_id: int,
    arquivo: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    conversa = (
        db.query(Conversa)
        .filter(Conversa.id == conversa_id)
        .first()
    )

    if not conversa:
        raise HTTPException(
            status_code=404,
            detail="Conversa não encontrada.",
        )

    mensagem = Mensagem(
        conversa_id=conversa_id,
        tipo="arquivo",
        texto=arquivo.filename,
    )

    db.add(mensagem)

    conversa.ultima_mensagem = f"📎 {arquivo.filename}"

    db.commit()
    db.refresh(mensagem)

    return mensagem


@router.post(
    "/conversas/{conversa_id}/audio",
    response_model=MensagemResponse,
)
async def enviar_audio(
    conversa_id: int,
    arquivo: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    conversa = (
        db.query(Conversa)
        .filter(Conversa.id == conversa_id)
        .first()
    )

    if not conversa:
        raise HTTPException(
            status_code=404,
            detail="Conversa não encontrada.",
        )

    mensagem = Mensagem(
        conversa_id=conversa_id,
        tipo="audio",
        texto="Áudio",
    )

    db.add(mensagem)

    conversa.ultima_mensagem = "🎤 Áudio"

    db.commit()
    db.refresh(mensagem)

    return mensagem
