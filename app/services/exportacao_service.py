
from pathlib import Path
from tempfile import NamedTemporaryFile
from uuid import UUID

from openpyxl import Workbook
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from sqlalchemy.orm import Session

from app.models.relatorio import RelatorioApartamento


class ExportacaoService:

    def gerar_pdf_relatorio(
        self,
        db: Session,
        relatorio_id: UUID
    ) -> str | None:

        relatorio = (
            db.query(RelatorioApartamento)
            .filter(
                RelatorioApartamento.id
                == relatorio_id
            )
            .first()
        )

        if relatorio is None:
            return None

        arquivo = NamedTemporaryFile(
            delete=False,
            suffix=".pdf"
        )

        caminho = arquivo.name

        arquivo.close()

        pdf = canvas.Canvas(
            caminho,
            pagesize=A4
        )

        largura, altura = A4

        y = altura - 50

        pdf.setFont(
            "Helvetica-Bold",
            16
        )

        pdf.drawString(
            50,
            y,
            "Relatório do Apartamento"
        )

        y -= 40

        pdf.setFont(
            "Helvetica",
            11
        )

        dados = [
            (
                "Apartamento ID",
                str(relatorio.apartamento_id)
            ),
            (
                "Competência",
                f"{relatorio.mes}/{relatorio.ano}"
            ),
            (
                "Receita Bruta",
                f"R$ {relatorio.receita_bruta:.2f}"
            ),
            (
                "Internet",
                f"R$ {relatorio.internet:.2f}"
            ),
            (
                "COPEL",
                f"R$ {relatorio.copel:.2f}"
            ),
            (
                "Condomínio",
                f"R$ {relatorio.condominio:.2f}"
            ),
            (
                "Limpeza",
                f"R$ {relatorio.limpeza:.2f}"
            ),
            (
                "Reparos",
                f"R$ {relatorio.reparos:.2f}"
            ),
            (
                "Administração",
                f"R$ {relatorio.administracao:.2f}"
            ),
            (
                "Custos",
                f"R$ {relatorio.custos:.2f}"
            ),
            (
                "Receita Líquida",
                f"R$ {relatorio.receita_liquida:.2f}"
            )
        ]

        for nome, valor in dados:

            pdf.drawString(
                50,
                y,
                f"{nome}: {valor}"
            )

            y -= 25

        pdf.save()

        return caminho


    def gerar_pdf_competencia(
        self,
        db: Session,
        mes: str,
        ano: int
    ) -> str | None:

        relatorios = (
            db.query(RelatorioApartamento)
            .filter(
                RelatorioApartamento.mes == mes,
                RelatorioApartamento.ano == ano
            )
            .all()
        )

        if not relatorios:
            return None

        arquivo = NamedTemporaryFile(
            delete=False,
            suffix=".pdf"
        )

        caminho = arquivo.name

        arquivo.close()

        pdf = canvas.Canvas(
            caminho,
            pagesize=A4
        )

        largura, altura = A4

        y = altura - 50

        pdf.setFont(
            "Helvetica-Bold",
            16
        )

        pdf.drawString(
            50,
            y,
            f"Relatório {mes}/{ano}"
        )

        y -= 40

        pdf.setFont(
            "Helvetica",
            10
        )

        for relatorio in relatorios:

            texto = (
                f"AP {relatorio.apartamento_id} | "
                f"Bruta: R$ "
                f"{relatorio.receita_bruta:.2f} | "
                f"Custos: R$ "
                f"{relatorio.custos:.2f} | "
                f"Líquida: R$ "
                f"{relatorio.receita_liquida:.2f}"
            )

            pdf.drawString(
                30,
                y,
                texto[:110]
            )

            y -= 18

            if y < 50:

                pdf.showPage()

                y = altura - 50

                pdf.setFont(
                    "Helvetica",
                    10
                )

        pdf.save()

        return caminho


    def gerar_excel_competencia(
        self,
        db: Session,
        mes: str,
        ano: int
    ) -> str | None:

        relatorios = (
            db.query(RelatorioApartamento)
            .filter(
                RelatorioApartamento.mes == mes,
                RelatorioApartamento.ano == ano
            )
            .all()
        )

        if not relatorios:
            return None

        workbook = Workbook()

        sheet = workbook.active

        sheet.title = "Relatórios"

        cabecalho = [
            "Apartamento ID",
            "Mês",
            "Ano",
            "Receita Bruta",
            "Internet",
            "COPEL",
            "Condomínio",
            "Limpeza",
            "Reparos",
            "Administração",
            "Custos",
            "Receita Líquida",
            "Ocupação",
            "Valor AP",
            "Locação Normal",
            "Renda Passiva",
            "Rentabilidade",
            "Média Mercado"
        ]

        sheet.append(cabecalho)

        for relatorio in relatorios:

            sheet.append([
                str(
                    relatorio.apartamento_id
                ),
                relatorio.mes,
                relatorio.ano,
                float(
                    relatorio.receita_bruta
                ),
                float(
                    relatorio.internet
                ),
                float(
                    relatorio.copel
                ),
                float(
                    relatorio.condominio
                ),
                float(
                    relatorio.limpeza
                ),
                float(
                    relatorio.reparos
                ),
                float(
                    relatorio.administracao
                ),
                float(
                    relatorio.custos
                ),
                float(
                    relatorio.receita_liquida
                ),
                (
                    float(relatorio.ocupacao)
                    if relatorio.ocupacao
                    is not None
                    else None
                ),
                (
                    float(relatorio.valor_ap)
                    if relatorio.valor_ap
                    is not None
                    else None
                ),
                (
                    float(
                        relatorio.locacao_normal
                    )
                    if relatorio.locacao_normal
                    is not None
                    else None
                ),
                (
                    float(
                        relatorio.renda_passiva
                    )
                    if relatorio.renda_passiva
                    is not None
                    else None
                ),
                (
                    float(
                        relatorio.rentabilidade
                    )
                    if relatorio.rentabilidade
                    is not None
                    else None
                ),
                (
                    float(
                        relatorio.media_mercado
                    )
                    if relatorio.media_mercado
                    is not None
                    else None
                )
            ])

        arquivo = NamedTemporaryFile(
            delete=False,
            suffix=".xlsx"
        )

        caminho = arquivo.name

        arquivo.close()

        workbook.save(caminho)

        workbook.close()

        return caminho

