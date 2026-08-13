
from pathlib import Path
from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
)

from sqlalchemy.orm import Session

from app.database.session import get_db

from app.repositories.apartamento_repository import (
    ApartamentoRepository,
)

from app.services.relatorio_service import (
    RelatorioService,
)


router = APIRouter(
    prefix="/relatorios",
    tags=["Relatórios"],
)


relatorio_service = RelatorioService()

apartamento_repository = ApartamentoRepository()


# ====================================================================
# HELPERS
# ====================================================================

def decimal_to_float(valor):
    """
    Converte Decimal para float.

    Mantém None quando o valor não existir.
    """

    if valor is None:
        return None

    return float(valor)


def relatorio_para_dict(relatorio) -> dict:
    """
    Converte um objeto Relatorio SQLAlchemy
    para um dicionário serializável em JSON.
    """

    return {
        "id": str(
            relatorio.id
        ),

        "apartamento_id": str(
            relatorio.apartamento_id
        ),

        "mes": relatorio.mes,

        "ano": relatorio.ano,

        "receita_bruta": float(
            relatorio.receita_bruta or 0
        ),

        "internet": float(
            relatorio.internet or 0
        ),

        "copel": float(
            relatorio.copel or 0
        ),

        "condominio": float(
            relatorio.condominio or 0
        ),

        "limpeza": float(
            relatorio.limpeza or 0
        ),

        "reparos": float(
            relatorio.reparos or 0
        ),

        "administracao": float(
            relatorio.administracao or 0
        ),

        "custos": float(
            relatorio.custos or 0
        ),

        "receita_liquida": float(
            relatorio.receita_liquida or 0
        ),

        "ocupacao": decimal_to_float(
            relatorio.ocupacao
        ),

        "valor_ap": decimal_to_float(
            relatorio.valor_ap
        ),

        "locacao_normal": decimal_to_float(
            relatorio.locacao_normal
        ),

        "renda_passiva": decimal_to_float(
            relatorio.renda_passiva
        ),

        "rentabilidade": decimal_to_float(
            relatorio.rentabilidade
        ),

        "media_mercado": decimal_to_float(
            relatorio.media_mercado
        ),

        "criado_em": (
            relatorio.criado_em.isoformat()
            if relatorio.criado_em
            else None
        ),
    }


def obter_nome_apartamento(
    db: Session,
    apartamento_id: UUID,
) -> str:
    """
    Busca o apartamento e monta o nome exibido no frontend.
    """

    apartamento = (
        apartamento_repository.buscar_por_id(
            db,
            apartamento_id,
        )
    )

    if apartamento is None:
        return (
            f"Apartamento {apartamento_id}"
        )

    return (
        f"ED. DUBAI AP {apartamento.numero}"
    )


def relatorio_para_resposta_importacao(
    db: Session,
    relatorio,
) -> dict:
    """
    Converte um relatório para o formato
    utilizado pela resposta da importação.
    """

    dados = relatorio_para_dict(
        relatorio
    )

    dados["apartamento"] = (
        obter_nome_apartamento(
            db,
            relatorio.apartamento_id,
        )
    )

    return dados


# ====================================================================
# IMPORTAR EXCEL
# ====================================================================

@router.post(
    "/importar-excel"
)
async def importar_excel(
    arquivo: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    if not arquivo.filename:

        raise HTTPException(
            status_code=400,
            detail="Arquivo não informado.",
        )

    extensoes_permitidas = {
        ".xlsx",
        ".xlsm",
    }

    extensao = Path(
        arquivo.filename
    ).suffix.lower()

    if extensao not in extensoes_permitidas:

        raise HTTPException(
            status_code=400,
            detail=(
                "Formato inválido. "
                "Envie um arquivo .xlsx ou .xlsm."
            ),
        )

    try:

        relatorios = (
            await relatorio_service.importar_excel(
                db,
                arquivo,
            )
        )

        apartamentos_resposta = [
            relatorio_para_resposta_importacao(
                db,
                relatorio,
            )
            for relatorio in relatorios
        ]

        return {
            "sucesso": True,

            "arquivo":
                arquivo.filename,

            "total_apartamentos":
                len(
                    apartamentos_resposta
                ),

            "apartamentos":
                apartamentos_resposta,
        }

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    except HTTPException:

        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                "Erro ao importar Excel: "
                f"{str(e)}"
            ),
        )


# ====================================================================
# RESUMO DE UMA COMPETÊNCIA
# ====================================================================

@router.get(
    "/resumo"
)
def resumo_relatorios(
    mes: str,
    ano: int,
    db: Session = Depends(get_db),
):

    resumo = (
        relatorio_service.calcular_resumo(
            db=db,
            mes=mes,
            ano=ano,
        )
    )

    return {
        "sucesso": True,

        "mes": mes,

        "ano": ano,

        "resumo": {
            "total_apartamentos":
                resumo[
                    "total_apartamentos"
                ],

            "receita_bruta_total":
                float(
                    resumo[
                        "receita_bruta_total"
                    ]
                    or 0
                ),

            "custos_total":
                float(
                    resumo[
                        "custos_total"
                    ]
                    or 0
                ),

            "receita_liquida_total":
                float(
                    resumo[
                        "receita_liquida_total"
                    ]
                    or 0
                ),

            "internet_total":
                float(
                    resumo[
                        "internet_total"
                    ]
                    or 0
                ),

            "copel_total":
                float(
                    resumo[
                        "copel_total"
                    ]
                    or 0
                ),

            "condominio_total":
                float(
                    resumo[
                        "condominio_total"
                    ]
                    or 0
                ),

            "limpeza_total":
                float(
                    resumo[
                        "limpeza_total"
                    ]
                    or 0
                ),

            "reparos_total":
                float(
                    resumo[
                        "reparos_total"
                    ]
                    or 0
                ),

            "administracao_total":
                float(
                    resumo[
                        "administracao_total"
                    ]
                    or 0
                ),

            "ocupacao_media":
                decimal_to_float(
                    resumo[
                        "ocupacao_media"
                    ]
                ),

            "rentabilidade_media":
                decimal_to_float(
                    resumo[
                        "rentabilidade_media"
                    ]
                ),
        },
    }


# ====================================================================
# RESUMO DO APARTAMENTO
# ====================================================================

@router.get(
    "/apartamento/{apartamento_id}/resumo"
)
def buscar_resumo_apartamento(
    apartamento_id: UUID,
    db: Session = Depends(get_db),
):

    # IMPORTANTE:
    # O RelatorioService possui
    # buscar_resumo_por_apartamento()
    # e não buscar_ultimo_por_apartamento().

    relatorio = (
        relatorio_service
        .buscar_resumo_por_apartamento(
            db=db,
            apartamento_id=apartamento_id,
        )
    )

    if relatorio is None:

        raise HTTPException(
            status_code=404,
            detail=(
                "Nenhum relatório encontrado "
                "para este apartamento."
            ),
        )

    return {
        "sucesso": True,

        "apartamento_id":
            str(
                apartamento_id
            ),

        "resumo":
            relatorio_para_dict(
                relatorio
            ),
    }


# ====================================================================
# LISTAR RELATÓRIOS DO APARTAMENTO
# ====================================================================

@router.get(
    "/apartamento/{apartamento_id}"
)
def listar_relatorios_por_apartamento(
    apartamento_id: UUID,
    db: Session = Depends(get_db),
):

    relatorios = (
        relatorio_service
        .listar_por_apartamento(
            db,
            apartamento_id,
        )
    )

    return {
        "sucesso": True,

        "apartamento_id":
            str(
                apartamento_id
            ),

        "total":
            len(
                relatorios
            ),

        "relatorios": [
            relatorio_para_dict(
                relatorio
            )
            for relatorio in relatorios
        ],
    }


# ====================================================================
# BUSCAR RELATÓRIO POR APARTAMENTO + COMPETÊNCIA
# ====================================================================

@router.get(
    "/apartamento/{apartamento_id}/competencia"
)
def buscar_relatorio_por_apartamento_competencia(
    apartamento_id: UUID,
    mes: str,
    ano: int,
    db: Session = Depends(get_db),
):

    relatorio = (
        relatorio_service
        .buscar_por_apartamento_e_competencia(
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
                "para o apartamento e "
                "competência informados."
            ),
        )

    return {
        "sucesso": True,

        "relatorio":
            relatorio_para_dict(
                relatorio
            ),
    }


# ====================================================================
# LISTAR RELATÓRIOS POR COMPETÊNCIA
# ====================================================================

@router.get(
    "/competencia"
)
def listar_relatorios_por_competencia(
    mes: str,
    ano: int,
    db: Session = Depends(get_db),
):

    relatorios = (
        relatorio_service
        .listar_por_competencia(
            db,
            mes,
            ano,
        )
    )

    return {
        "sucesso": True,

        "mes": mes,

        "ano": ano,

        "total":
            len(
                relatorios
            ),

        "relatorios": [
            relatorio_para_dict(
                relatorio
            )
            for relatorio in relatorios
        ],
    }


# ====================================================================
# LISTAR TODOS
# ====================================================================

@router.get("")
def listar_relatorios(
    db: Session = Depends(get_db),
):

    relatorios = (
        relatorio_service.listar(
            db
        )
    )

    return {
        "sucesso": True,

        "total":
            len(
                relatorios
            ),

        "relatorios": [
            relatorio_para_dict(
                relatorio
            )
            for relatorio in relatorios
        ],
    }

# ====================================================================
# GERAR PDF DO RELATÓRIO
# ====================================================================

@router.get(
    "/{relatorio_id}/pdf"
)
def gerar_pdf_relatorio(
    relatorio_id: UUID,
    db: Session = Depends(get_db),
):

    try:

        arquivo, nome_arquivo = (
            relatorio_service.gerar_pdf(
                db=db,
                relatorio_id=relatorio_id,
            )
        )

        from fastapi.responses import StreamingResponse

        return StreamingResponse(
            arquivo,
            media_type="application/pdf",
            headers={
                "Content-Disposition": (
                    f'inline; filename="{nome_arquivo}"'
                )
            },
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=(
                "Erro ao gerar PDF: "
                f"{str(e)}"
            ),
        )

# ====================================================================
# BUSCAR POR ID
# ====================================================================

@router.get(
    "/{relatorio_id}"
)
def buscar_relatorio(
    relatorio_id: UUID,
    db: Session = Depends(get_db),
):

    relatorio = (
        relatorio_service.buscar_por_id(
            db,
            relatorio_id,
        )
    )

    if relatorio is None:

        raise HTTPException(
            status_code=404,
            detail="Relatório não encontrado.",
        )

    return {
        "sucesso": True,

        "relatorio":
            relatorio_para_dict(
                relatorio
            ),
    }

