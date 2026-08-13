from uuid import UUID
from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile
)

from sqlalchemy.orm import Session

from app.database.session import get_db
from app.services.relatorio_service import RelatorioService


router = APIRouter(
    prefix="/relatorios",
    tags=["Relatórios"]
)


relatorio_service = RelatorioService()


@router.post("/importar-excel")
async def importar_excel(
    arquivo: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    if not arquivo.filename:
        raise HTTPException(
            status_code=400,
            detail="Arquivo não informado."
        )

    extensoes_permitidas = {
        ".xlsx",
        ".xlsm"
    }

    nome_arquivo = arquivo.filename.lower()

    if not any(
        nome_arquivo.endswith(extensao)
        for extensao in extensoes_permitidas
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "Formato inválido. "
                "Envie um arquivo .xlsx ou .xlsm."
            )
        )

    try:

        relatorios = (
            await relatorio_service.importar_excel(
                db,
                arquivo
            )
        )

        return {
            "sucesso": True,
            "arquivo": arquivo.filename,
            "total_relatorios": len(
                relatorios
            ),
            "relatorios": [
                {
                    "id": str(relatorio.id),
                    "apartamento_id": str(
                        relatorio.apartamento_id
                    ),
                    "mes": relatorio.mes,
                    "ano": relatorio.ano,
                    "receita_bruta": float(
                        relatorio.receita_bruta
                    ),
                    "custos": float(
                        relatorio.custos
                    ),
                    "receita_liquida": float(
                        relatorio.receita_liquida
                    )
                }
                for relatorio in relatorios
            ]
        }

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                f"Erro ao importar Excel: {str(e)}"
            )
        )

@router.get("")
def listar_relatorios(
    db: Session = Depends(get_db)
):

    relatorios = (
        relatorio_service.listar(
            db
        )
    )

    return {
        "sucesso": True,
        "total": len(relatorios),
        "relatorios": [
            {
                "id": str(relatorio.id),
                "apartamento_id": str(
                    relatorio.apartamento_id
                ),
                "mes": relatorio.mes,
                "ano": relatorio.ano,
                "receita_bruta": float(
                    relatorio.receita_bruta
                ),
                "internet": float(
                    relatorio.internet
                ),
                "copel": float(
                    relatorio.copel
                ),
                "condominio": float(
                    relatorio.condominio
                ),
                "limpeza": float(
                    relatorio.limpeza
                ),
                "reparos": float(
                    relatorio.reparos
                ),
                "administracao": float(
                    relatorio.administracao
                ),
                "custos": float(
                    relatorio.custos
                ),
                "receita_liquida": float(
                    relatorio.receita_liquida
                ),
                "ocupacao": (
                    float(relatorio.ocupacao)
                    if relatorio.ocupacao is not None
                    else None
                ),
                "valor_ap": (
                    float(relatorio.valor_ap)
                    if relatorio.valor_ap is not None
                    else None
                ),
                "locacao_normal": (
                    float(relatorio.locacao_normal)
                    if relatorio.locacao_normal is not None
                    else None
                ),
                "renda_passiva": (
                    float(relatorio.renda_passiva)
                    if relatorio.renda_passiva is not None
                    else None
                ),
                "rentabilidade": (
                    float(relatorio.rentabilidade)
                    if relatorio.rentabilidade is not None
                    else None
                ),
                "media_mercado": (
                    float(relatorio.media_mercado)
                    if relatorio.media_mercado is not None
                    else None
                ),
                "criado_em": (
                    relatorio.criado_em.isoformat()
                    if relatorio.criado_em
                    else None
                )
            }
            for relatorio in relatorios
        ]
    }

@router.get("/{relatorio_id}")
def buscar_relatorio(
    relatorio_id: UUID,
    db: Session = Depends(get_db)
):

    relatorio = relatorio_service.buscar_por_id(
        db,
        relatorio_id
    )

    if relatorio is None:

        raise HTTPException(
            status_code=404,
            detail="Relatório não encontrado."
        )

    return {
        "sucesso": True,
        "relatorio": {
            "id": str(relatorio.id),
            "apartamento_id": str(
                relatorio.apartamento_id
            ),
            "mes": relatorio.mes,
            "ano": relatorio.ano,
            "receita_bruta": float(
                relatorio.receita_bruta
            ),
            "internet": float(
                relatorio.internet
            ),
            "copel": float(
                relatorio.copel
            ),
            "condominio": float(
                relatorio.condominio
            ),
            "limpeza": float(
                relatorio.limpeza
            ),
            "reparos": float(
                relatorio.reparos
            ),
            "administracao": float(
                relatorio.administracao
            ),
            "custos": float(
                relatorio.custos
            ),
            "receita_liquida": float(
                relatorio.receita_liquida
            ),
            "ocupacao": (
                float(relatorio.ocupacao)
                if relatorio.ocupacao is not None
                else None
            ),
            "valor_ap": (
                float(relatorio.valor_ap)
                if relatorio.valor_ap is not None
                else None
            ),
            "locacao_normal": (
                float(relatorio.locacao_normal)
                if relatorio.locacao_normal is not None
                else None
            ),
            "renda_passiva": (
                float(relatorio.renda_passiva)
                if relatorio.renda_passiva is not None
                else None
            ),
            "rentabilidade": (
                float(relatorio.rentabilidade)
                if relatorio.rentabilidade is not None
                else None
            ),
            "media_mercado": (
                float(relatorio.media_mercado)
                if relatorio.media_mercado is not None
                else None
            ),
            "criado_em": (
                relatorio.criado_em.isoformat()
                if relatorio.criado_em
                else None
            )
        }
    }

@router.get("/apartamento/{apartamento_id}")
def listar_relatorios_por_apartamento(
    apartamento_id: UUID,
    db: Session = Depends(get_db)
):

    relatorios = (
        relatorio_service
        .listar_por_apartamento(
            db,
            apartamento_id
        )
    )

    return {
        "sucesso": True,
        "apartamento_id": str(
            apartamento_id
        ),
        "total": len(relatorios),
        "relatorios": [
            {
                "id": str(relatorio.id),
                "mes": relatorio.mes,
                "ano": relatorio.ano,
                "receita_bruta": float(
                    relatorio.receita_bruta
                ),
                "internet": float(
                    relatorio.internet
                ),
                "copel": float(
                    relatorio.copel
                ),
                "condominio": float(
                    relatorio.condominio
                ),
                "limpeza": float(
                    relatorio.limpeza
                ),
                "reparos": float(
                    relatorio.reparos
                ),
                "administracao": float(
                    relatorio.administracao
                ),
                "custos": float(
                    relatorio.custos
                ),
                "receita_liquida": float(
                    relatorio.receita_liquida
                ),
                "ocupacao": (
                    float(relatorio.ocupacao)
                    if relatorio.ocupacao is not None
                    else None
                ),
                "valor_ap": (
                    float(relatorio.valor_ap)
                    if relatorio.valor_ap is not None
                    else None
                ),
                "locacao_normal": (
                    float(relatorio.locacao_normal)
                    if relatorio.locacao_normal is not None
                    else None
                ),
                "renda_passiva": (
                    float(relatorio.renda_passiva)
                    if relatorio.renda_passiva is not None
                    else None
                ),
                "rentabilidade": (
                    float(relatorio.rentabilidade)
                    if relatorio.rentabilidade is not None
                    else None
                ),
                "media_mercado": (
                    float(relatorio.media_mercado)
                    if relatorio.media_mercado is not None
                    else None
                ),
                "criado_em": (
                    relatorio.criado_em.isoformat()
                    if relatorio.criado_em
                    else None
                )
            }
            for relatorio in relatorios
        ]
    }

@router.get("/competencia")
def listar_relatorios_por_competencia(
    mes: str,
    ano: int,
    db: Session = Depends(get_db)
):

    relatorios = (
        relatorio_service
        .listar_por_competencia(
            db,
            mes,
            ano
        )
    )

    return {
        "sucesso": True,
        "mes": mes,
        "ano": ano,
        "total": len(relatorios),
        "relatorios": [
            {
                "id": str(relatorio.id),

                "apartamento_id": str(
                    relatorio.apartamento_id
                ),

                "mes": relatorio.mes,

                "ano": relatorio.ano,

                "receita_bruta": float(
                    relatorio.receita_bruta
                ),

                "internet": float(
                    relatorio.internet
                ),

                "copel": float(
                    relatorio.copel
                ),

                "condominio": float(
                    relatorio.condominio
                ),

                "limpeza": float(
                    relatorio.limpeza
                ),

                "reparos": float(
                    relatorio.reparos
                ),

                "administracao": float(
                    relatorio.administracao
                ),

                "custos": float(
                    relatorio.custos
                ),

                "receita_liquida": float(
                    relatorio.receita_liquida
                ),

                "ocupacao": (
                    float(relatorio.ocupacao)
                    if relatorio.ocupacao is not None
                    else None
                ),

                "valor_ap": (
                    float(relatorio.valor_ap)
                    if relatorio.valor_ap is not None
                    else None
                ),

                "locacao_normal": (
                    float(relatorio.locacao_normal)
                    if relatorio.locacao_normal is not None
                    else None
                ),

                "renda_passiva": (
                    float(relatorio.renda_passiva)
                    if relatorio.renda_passiva is not None
                    else None
                ),

                "rentabilidade": (
                    float(relatorio.rentabilidade)
                    if relatorio.rentabilidade is not None
                    else None
                ),

                "media_mercado": (
                    float(relatorio.media_mercado)
                    if relatorio.media_mercado is not None
                    else None
                ),

                "criado_em": (
                    relatorio.criado_em.isoformat()
                    if relatorio.criado_em
                    else None
                )
            }
            for relatorio in relatorios
        ]
    }

@router.get(
    "/apartamento/{apartamento_id}/competencia"
)
def buscar_relatorio_por_apartamento_competencia(
    apartamento_id: UUID,
    mes: str,
    ano: int,
    db: Session = Depends(get_db)
):

    relatorio = (
        relatorio_service
        .buscar_por_apartamento_competencia(
            db=db,
            apartamento_id=apartamento_id,
            mes=mes,
            ano=ano
        )
    )

    if relatorio is None:

        raise HTTPException(
            status_code=404,
            detail=(
                "Relatório não encontrado "
                "para o apartamento e competência informados."
            )
        )

    return {
        "sucesso": True,
        "relatorio": {
            "id": str(relatorio.id),

            "apartamento_id": str(
                relatorio.apartamento_id
            ),

            "mes": relatorio.mes,

            "ano": relatorio.ano,

            "receita_bruta": float(
                relatorio.receita_bruta
            ),

            "internet": float(
                relatorio.internet
            ),

            "copel": float(
                relatorio.copel
            ),

            "condominio": float(
                relatorio.condominio
            ),

            "limpeza": float(
                relatorio.limpeza
            ),

            "reparos": float(
                relatorio.reparos
            ),

            "administracao": float(
                relatorio.administracao
            ),

            "custos": float(
                relatorio.custos
            ),

            "receita_liquida": float(
                relatorio.receita_liquida
            ),

            "ocupacao": (
                float(relatorio.ocupacao)
                if relatorio.ocupacao is not None
                else None
            ),

            "valor_ap": (
                float(relatorio.valor_ap)
                if relatorio.valor_ap is not None
                else None
            ),

            "locacao_normal": (
                float(relatorio.locacao_normal)
                if relatorio.locacao_normal is not None
                else None
            ),

            "renda_passiva": (
                float(relatorio.renda_passiva)
                if relatorio.renda_passiva is not None
                else None
            ),

            "rentabilidade": (
                float(relatorio.rentabilidade)
                if relatorio.rentabilidade is not None
                else None
            ),

            "media_mercado": (
                float(relatorio.media_mercado)
                if relatorio.media_mercado is not None
                else None
            ),

            "criado_em": (
                relatorio.criado_em.isoformat()
                if relatorio.criado_em
                else None
            )
        }
    }


@router.get("/resumo")
def resumo_relatorios(
    mes: str,
    ano: int,
    db: Session = Depends(get_db)
):

    resumo = (
        relatorio_service
        .calcular_resumo(
            db=db,
            mes=mes,
            ano=ano
        )
    )

    return {
        "sucesso": True,
        "mes": mes,
        "ano": ano,
        "resumo": {
            "total_apartamentos": (
                resumo["total_apartamentos"]
            ),

            "receita_bruta_total": (
                float(
                    resumo["receita_bruta_total"]
                )
            ),

            "custos_total": (
                float(
                    resumo["custos_total"]
                )
            ),

            "receita_liquida_total": (
                float(
                    resumo["receita_liquida_total"]
                )
            ),

            "internet_total": (
                float(
                    resumo["internet_total"]
                )
            ),

            "copel_total": (
                float(
                    resumo["copel_total"]
                )
            ),

            "condominio_total": (
                float(
                    resumo["condominio_total"]
                )
            ),

            "limpeza_total": (
                float(
                    resumo["limpeza_total"]
                )
            ),

            "reparos_total": (
                float(
                    resumo["reparos_total"]
                )
            ),

            "administracao_total": (
                float(
                    resumo["administracao_total"]
                )
            ),

            "ocupacao_media": (
                float(
                    resumo["ocupacao_media"]
                )
                if resumo["ocupacao_media"] is not None
                else None
            ),

            "rentabilidade_media": (
                float(
                    resumo["rentabilidade_media"]
                )
                if resumo["rentabilidade_media"] is not None
                else None
            )
        }
    }


