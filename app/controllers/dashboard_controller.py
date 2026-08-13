
from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.services.dashboard_service import DashboardService


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

dashboard_service = DashboardService()


@router.get("/resumo")
def dashboard_resumo(
    mes: str | None = None,
    ano: int | None = None,
    db: Session = Depends(get_db)
):
    hoje = date.today()

    mes = mes or f"{hoje.month:02d}"
    ano = ano or hoje.year

    resumo = dashboard_service.obter_resumo(
        db=db,
        mes=mes,
        ano=ano
    )

    return {
        "sucesso": True,
        "mes": mes,
        "ano": ano,
        "dashboard": resumo
    }


@router.get("/financeiro")
def dashboard_financeiro(
    mes: str | None = None,
    ano: int | None = None,
    db: Session = Depends(get_db)
):
    hoje = date.today()

    mes = mes or f"{hoje.month:02d}"
    ano = ano or hoje.year

    financeiro = dashboard_service.obter_financeiro(
        db=db,
        mes=mes,
        ano=ano
    )

    return {
        "sucesso": True,
        "mes": mes,
        "ano": ano,
        "financeiro": financeiro
    }


@router.get("/ocupacao")
def dashboard_ocupacao(
    mes: str | None = None,
    ano: int | None = None,
    db: Session = Depends(get_db)
):
    hoje = date.today()

    mes = mes or f"{hoje.month:02d}"
    ano = ano or hoje.year

    ocupacao = dashboard_service.obter_ocupacao(
        db=db,
        mes=mes,
        ano=ano
    )

    return {
        "sucesso": True,
        "mes": mes,
        "ano": ano,
        "ocupacao": ocupacao
    }


@router.get("/rentabilidade")
def dashboard_rentabilidade(
    mes: str | None = None,
    ano: int | None = None,
    db: Session = Depends(get_db)
):
    hoje = date.today()

    mes = mes or f"{hoje.month:02d}"
    ano = ano or hoje.year

    rentabilidade = dashboard_service.obter_rentabilidade(
        db=db,
        mes=mes,
        ano=ano
    )

    return {
        "sucesso": True,
        "mes": mes,
        "ano": ano,
        "rentabilidade": rentabilidade
    }

