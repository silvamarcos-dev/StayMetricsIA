
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.services.exportacao_service import ExportacaoService


router = APIRouter(
    prefix="/relatorios",
    tags=["Exportação"]
)


exportacao_service = ExportacaoService()


@router.get("/{relatorio_id}/pdf")
def exportar_relatorio_pdf(
    relatorio_id: UUID,
    db: Session = Depends(get_db)
):

    caminho_arquivo = (
        exportacao_service.gerar_pdf_relatorio(
            db=db,
            relatorio_id=relatorio_id
        )
    )

    if caminho_arquivo is None:

        raise HTTPException(
            status_code=404,
            detail="Relatório não encontrado."
        )

    return FileResponse(
        path=caminho_arquivo,
        media_type="application/pdf",
        filename="relatorio.pdf"
    )


@router.get("/competencia/pdf")
def exportar_competencia_pdf(
    mes: str,
    ano: int,
    db: Session = Depends(get_db)
):

    caminho_arquivo = (
        exportacao_service.gerar_pdf_competencia(
            db=db,
            mes=mes,
            ano=ano
        )
    )

    if caminho_arquivo is None:

        raise HTTPException(
            status_code=404,
            detail=(
                "Nenhum relatório encontrado "
                "para a competência informada."
            )
        )

    return FileResponse(
        path=caminho_arquivo,
        media_type="application/pdf",
        filename=(
            f"relatorio_{mes}_{ano}.pdf"
        )
    )


@router.get("/competencia/excel")
def exportar_competencia_excel(
    mes: str,
    ano: int,
    db: Session = Depends(get_db)
):

    caminho_arquivo = (
        exportacao_service.gerar_excel_competencia(
            db=db,
            mes=mes,
            ano=ano
        )
    )

    if caminho_arquivo is None:

        raise HTTPException(
            status_code=404,
            detail=(
                "Nenhum relatório encontrado "
                "para a competência informada."
            )
        )

    return FileResponse(
        path=caminho_arquivo,
        media_type=(
            "application/vnd.openxmlformats-officedocument."
            "spreadsheetml.sheet"
        ),
        filename=(
            f"relatorio_{mes}_{ano}.xlsx"
        )
    )

