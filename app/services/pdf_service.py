from io import BytesIO
from zipfile import ZipFile, ZIP_DEFLATED

from fpdf import FPDF
from fpdf.enums import XPos, YPos


class PdfService:

    def gerar_pdf_apartamento(self, dados: dict) -> bytes:

        pdf = FPDF()

        pdf.add_page()

        pdf.set_font("Helvetica", "B", 18)

        titulo_apartamento = (
            dados.get("apartamento")
            or (
                f"AP {dados.get('apartamento_id')}"
                if dados.get("apartamento_id")
                else "Aurion CRM"
            )
        )

        pdf.cell(
            0, 12,
            "Aurion CRM - Relatório Financeiro",
            new_x=XPos.LMARGIN,
            new_y=YPos.NEXT
        )

        pdf.set_font("Helvetica", "", 12)

        pdf.cell(
            0, 8,
            titulo_apartamento,
            new_x=XPos.LMARGIN,
            new_y=YPos.NEXT
        )

        competencia = " / ".join(
            str(valor)
            for valor in (
                dados.get("mes"),
                dados.get("ano")
            )
            if valor
        )

        if competencia:

            pdf.set_font("Helvetica", "", 10)

            pdf.set_text_color(90, 90, 90)

            pdf.cell(
                0, 8,
                f"Competência: {competencia}",
                new_x=XPos.LMARGIN,
                new_y=YPos.NEXT
            )

            pdf.set_text_color(0, 0, 0)

        pdf.ln(6)

        self._secao(
            pdf,
            "Resumo financeiro",
            [
                ("Receita bruta", dados.get("receita_bruta")),
                ("Custos", dados.get("custos")),
                ("Receita líquida", dados.get("receita_liquida")),
                ("Ocupação", dados.get("ocupacao"), "%"),
            ]
        )

        self._secao(
            pdf,
            "Custos operacionais",
            [
                ("Internet", dados.get("internet")),
                ("Copel", dados.get("copel")),
                ("Condomínio", dados.get("condominio")),
                ("Limpeza", dados.get("limpeza")),
                ("Reparos", dados.get("reparos")),
                ("Administração", dados.get("administracao")),
            ]
        )

        self._secao(
            pdf,
            "Rentabilidade",
            [
                ("Valor do apartamento", dados.get("valor_ap")),
                ("Locação normal", dados.get("locacao_normal")),
                ("Renda passiva", dados.get("renda_passiva")),
                ("Rentabilidade", dados.get("rentabilidade"), "%"),
                ("Média de mercado", dados.get("media_mercado"), "%"),
            ]
        )

        saida = pdf.output()

        return bytes(saida)

    def gerar_zip_relatorios(
        self,
        lista_dados: list[dict]
    ) -> bytes:

        buffer = BytesIO()

        with ZipFile(
            buffer,
            "w",
            ZIP_DEFLATED
        ) as arquivo_zip:

            for dados in lista_dados:

                pdf_bytes = self.gerar_pdf_apartamento(
                    dados
                )

                nome_apartamento = str(
                    dados.get("apartamento")
                    or dados.get("apartamento_id")
                    or "apartamento"
                ).replace("/", "-")

                arquivo_zip.writestr(
                    f"relatorio-{nome_apartamento}.pdf",
                    pdf_bytes
                )

        buffer.seek(0)

        return buffer.getvalue()

    def _secao(
        self,
        pdf: FPDF,
        titulo: str,
        itens: list
    ) -> None:

        pdf.set_font("Helvetica", "B", 13)

        pdf.cell(
            0, 10,
            titulo,
            new_x=XPos.LMARGIN,
            new_y=YPos.NEXT
        )

        pdf.set_font("Helvetica", "", 11)

        for item in itens:

            label = item[0]
            valor = item[1]
            sufixo = item[2] if len(item) > 2 else ""

            texto_valor = self._formatar_valor(
                valor,
                sufixo
            )

            pdf.cell(
                60, 8,
                f"{label}:",
                new_x=XPos.RIGHT,
                new_y=YPos.TOP
            )

            pdf.cell(
                0, 8,
                texto_valor,
                new_x=XPos.LMARGIN,
                new_y=YPos.NEXT
            )

        pdf.ln(4)

    def _formatar_valor(
        self,
        valor,
        sufixo: str
    ) -> str:

        if valor is None:
            return "-"

        if sufixo == "%":
            return f"{valor}%"

        try:
            return f"R$ {float(valor):,.2f}".replace(
                ",", "X"
            ).replace(
                ".", ","
            ).replace(
                "X", "."
            )
        except (TypeError, ValueError):
            return str(valor)