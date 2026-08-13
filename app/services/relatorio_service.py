
from uuid import UUID
from decimal import Decimal
from io import BytesIO

from fastapi import UploadFile
from sqlalchemy.orm import Session

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import (
    getSampleStyleSheet,
    ParagraphStyle
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle
)

from app.models.relatorio import RelatorioApartamento

from app.repositories.apartamento_repository import (
    ApartamentoRepository
)

from app.repositories.relatorio_repository import (
    RelatorioRepository
)

from app.services.excel_service import ExcelService


class RelatorioService:

    def __init__(self):

        self.excel_service = ExcelService()

        self.apartamento_repository = (
            ApartamentoRepository()
        )

        self.relatorio_repository = (
            RelatorioRepository()
        )

    # ================================================================
    # LISTAR TODOS
    # ================================================================

    def listar(
        self,
        db: Session
    ) -> list[RelatorioApartamento]:

        return (
            db.query(RelatorioApartamento)
            .order_by(
                RelatorioApartamento.criado_em.desc()
            )
            .all()
        )

    # ================================================================
    # LISTAR POR APARTAMENTO
    # ================================================================

    def listar_por_apartamento(
        self,
        db: Session,
        apartamento_id: UUID
    ) -> list[RelatorioApartamento]:

        return (
            self.relatorio_repository
            .listar_por_apartamento(
                db,
                apartamento_id
            )
        )

    # ================================================================
    # LISTAR POR COMPETÊNCIA
    # ================================================================

    def listar_por_competencia(
        self,
        db: Session,
        mes: str,
        ano: int
    ) -> list[RelatorioApartamento]:

        return (
            db.query(RelatorioApartamento)
            .filter(
                RelatorioApartamento.mes == mes,
                RelatorioApartamento.ano == ano
            )
            .order_by(
                RelatorioApartamento.criado_em.desc()
            )
            .all()
        )

    # ================================================================
    # BUSCAR POR ID
    # ================================================================

    def buscar_por_id(
        self,
        db: Session,
        relatorio_id: UUID
    ) -> RelatorioApartamento | None:

        return (
            self.relatorio_repository
            .buscar_por_id(
                db,
                relatorio_id
            )
        )

    # ================================================================
    # BUSCAR ÚLTIMO RELATÓRIO DO APARTAMENTO
    # ================================================================

    def buscar_resumo_por_apartamento(
        self,
        db: Session,
        apartamento_id: UUID
    ) -> RelatorioApartamento | None:

        return (
            db.query(RelatorioApartamento)
            .filter(
                RelatorioApartamento.apartamento_id
                == apartamento_id
            )
            .order_by(
                RelatorioApartamento.criado_em.desc()
            )
            .first()
        )

    # ================================================================
    # BUSCAR POR APARTAMENTO + COMPETÊNCIA
    # ================================================================

    def buscar_por_apartamento_e_competencia(
        self,
        db: Session,
        apartamento_id: UUID,
        mes: str,
        ano: int
    ) -> RelatorioApartamento | None:

        return (
            self.relatorio_repository
            .buscar_por_competencia(
                db,
                apartamento_id,
                mes,
                ano
            )
        )

    # ================================================================
    # CALCULAR RESUMO
    # ================================================================

    def calcular_resumo(
        self,
        db: Session,
        mes: str,
        ano: int
    ) -> dict:

        relatorios = (
            self.listar_por_competencia(
                db,
                mes,
                ano
            )
        )

        total_apartamentos = len(
            relatorios
        )

        receita_bruta_total = sum(
            (
                relatorio.receita_bruta
                or Decimal("0")
            )
            for relatorio in relatorios
        )

        custos_total = sum(
            (
                relatorio.custos
                or Decimal("0")
            )
            for relatorio in relatorios
        )

        receita_liquida_total = sum(
            (
                relatorio.receita_liquida
                or Decimal("0")
            )
            for relatorio in relatorios
        )

        internet_total = sum(
            (
                relatorio.internet
                or Decimal("0")
            )
            for relatorio in relatorios
        )

        copel_total = sum(
            (
                relatorio.copel
                or Decimal("0")
            )
            for relatorio in relatorios
        )

        condominio_total = sum(
            (
                relatorio.condominio
                or Decimal("0")
            )
            for relatorio in relatorios
        )

        limpeza_total = sum(
            (
                relatorio.limpeza
                or Decimal("0")
            )
            for relatorio in relatorios
        )

        reparos_total = sum(
            (
                relatorio.reparos
                or Decimal("0")
            )
            for relatorio in relatorios
        )

        administracao_total = sum(
            (
                relatorio.administracao
                or Decimal("0")
            )
            for relatorio in relatorios
        )

        ocupacoes = [
            relatorio.ocupacao
            for relatorio in relatorios
            if relatorio.ocupacao is not None
        ]

        rentabilidades = [
            relatorio.rentabilidade
            for relatorio in relatorios
            if relatorio.rentabilidade is not None
        ]

        ocupacao_media = (
            sum(ocupacoes) / len(ocupacoes)
            if ocupacoes
            else None
        )

        rentabilidade_media = (
            sum(rentabilidades)
            / len(rentabilidades)
            if rentabilidades
            else None
        )

        return {
            "total_apartamentos":
                total_apartamentos,

            "receita_bruta_total":
                receita_bruta_total,

            "custos_total":
                custos_total,

            "receita_liquida_total":
                receita_liquida_total,

            "internet_total":
                internet_total,

            "copel_total":
                copel_total,

            "condominio_total":
                condominio_total,

            "limpeza_total":
                limpeza_total,

            "reparos_total":
                reparos_total,

            "administracao_total":
                administracao_total,

            "ocupacao_media":
                ocupacao_media,

            "rentabilidade_media":
                rentabilidade_media
        }

    # ================================================================
    # GERAR PDF
    # ================================================================

    def gerar_pdf(
        self,
        db: Session,
        relatorio_id: UUID
    ) -> tuple[BytesIO, str]:

        relatorio = (
            self.buscar_por_id(
                db,
                relatorio_id
            )
        )

        if relatorio is None:

            raise ValueError(
                "Relatório não encontrado."
            )

        apartamento = (
            self.apartamento_repository
            .buscar_por_id(
                db,
                relatorio.apartamento_id
            )
        )

        if apartamento is None:

            raise ValueError(
                "Apartamento não encontrado."
            )

        nome_apartamento = (
            f"ED. DUBAI AP "
            f"{apartamento.numero}"
        )

        buffer = BytesIO()

        documento = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=18 * mm,
            leftMargin=18 * mm,
            topMargin=18 * mm,
            bottomMargin=18 * mm
        )

        styles = getSampleStyleSheet()

        titulo = ParagraphStyle(
            "TituloRelatorio",
            parent=styles["Title"],
            alignment=TA_CENTER,
            fontSize=20,
            leading=24,
            spaceAfter=8
        )

        subtitulo = ParagraphStyle(
            "SubtituloRelatorio",
            parent=styles["Normal"],
            alignment=TA_CENTER,
            fontSize=11,
            leading=14,
            spaceAfter=18
        )

        secao = ParagraphStyle(
            "SecaoRelatorio",
            parent=styles["Heading2"],
            alignment=TA_LEFT,
            fontSize=13,
            leading=16,
            spaceBefore=10,
            spaceAfter=8
        )

        elementos = []

        # ------------------------------------------------------------
        # CABEÇALHO
        # ------------------------------------------------------------

        elementos.append(
            Paragraph(
                "RELATÓRIO DE DESEMPENHO",
                titulo
            )
        )

        elementos.append(
            Paragraph(
                (
                    f"{nome_apartamento}<br/>"
                    f"Competência: "
                    f"{relatorio.mes}/{relatorio.ano}"
                ),
                subtitulo
            )
        )

        # ------------------------------------------------------------
        # RESUMO FINANCEIRO
        # ------------------------------------------------------------

        elementos.append(
            Paragraph(
                "Resumo Financeiro",
                secao
            )
        )

        dados_financeiros = [
            [
                "Indicador",
                "Valor"
            ],
            [
                "Receita Bruta",
                self._formatar_moeda(
                    relatorio.receita_bruta
                )
            ],
            [
                "Custos",
                self._formatar_moeda(
                    relatorio.custos
                )
            ],
            [
                "Receita Líquida",
                self._formatar_moeda(
                    relatorio.receita_liquida
                )
            ]
        ]

        tabela_financeira = Table(
            dados_financeiros,
            colWidths=[
                100 * mm,
                60 * mm
            ]
        )

        tabela_financeira.setStyle(
            TableStyle([
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    colors.HexColor("#1f2937")
                ),
                (
                    "TEXTCOLOR",
                    (0, 0),
                    (-1, 0),
                    colors.white
                ),
                (
                    "FONTNAME",
                    (0, 0),
                    (-1, 0),
                    "Helvetica-Bold"
                ),
                (
                    "ALIGN",
                    (1, 1),
                    (1, -1),
                    "RIGHT"
                ),
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.grey
                ),
                (
                    "ROWBACKGROUNDS",
                    (0, 1),
                    (-1, -1),
                    [
                        colors.white,
                        colors.HexColor("#f3f4f6")
                    ]
                ),
                (
                    "FONTSIZE",
                    (0, 0),
                    (-1, -1),
                    9
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    7
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    7
                )
            ])
        )

        elementos.append(
            tabela_financeira
        )

        elementos.append(
            Spacer(1, 8 * mm)
        )

        # ------------------------------------------------------------
        # DETALHAMENTO DOS CUSTOS
        # ------------------------------------------------------------

        elementos.append(
            Paragraph(
                "Detalhamento dos Custos",
                secao
            )
        )

        dados_custos = [
            [
                "Despesa",
                "Valor"
            ],
            [
                "Internet",
                self._formatar_moeda(
                    relatorio.internet
                )
            ],
            [
                "COPEL",
                self._formatar_moeda(
                    relatorio.copel
                )
            ],
            [
                "Condomínio",
                self._formatar_moeda(
                    relatorio.condominio
                )
            ],
            [
                "Limpeza",
                self._formatar_moeda(
                    relatorio.limpeza
                )
            ],
            [
                "Reparos",
                self._formatar_moeda(
                    relatorio.reparos
                )
            ],
            [
                "Administração",
                self._formatar_moeda(
                    relatorio.administracao
                )
            ],
            [
                "Total de Custos",
                self._formatar_moeda(
                    relatorio.custos
                )
            ]
        ]

        tabela_custos = Table(
            dados_custos,
            colWidths=[
                100 * mm,
                60 * mm
            ]
        )

        tabela_custos.setStyle(
            TableStyle([
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    colors.HexColor("#1f2937")
                ),
                (
                    "TEXTCOLOR",
                    (0, 0),
                    (-1, 0),
                    colors.white
                ),
                (
                    "FONTNAME",
                    (0, 0),
                    (-1, 0),
                    "Helvetica-Bold"
                ),
                (
                    "ALIGN",
                    (1, 1),
                    (1, -1),
                    "RIGHT"
                ),
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.grey
                ),
                (
                    "FONTNAME",
                    (0, -1),
                    (-1, -1),
                    "Helvetica-Bold"
                ),
                (
                    "BACKGROUND",
                    (0, -1),
                    (-1, -1),
                    colors.HexColor("#e5e7eb")
                ),
                (
                    "FONTSIZE",
                    (0, 0),
                    (-1, -1),
                    9
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    7
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    7
                )
            ])
        )

        elementos.append(
            tabela_custos
        )

        elementos.append(
            Spacer(1, 8 * mm)
        )

        # ------------------------------------------------------------
        # INDICADORES
        # ------------------------------------------------------------

        elementos.append(
            Paragraph(
                "Indicadores de Desempenho",
                secao
            )
        )

        dados_indicadores = [
            [
                "Indicador",
                "Resultado"
            ],
            [
                "Ocupação",
                self._formatar_percentual(
                    relatorio.ocupacao
                )
            ],
            [
                "Rentabilidade",
                self._formatar_percentual(
                    relatorio.rentabilidade
                )
            ],
            [
                "Valor do Apartamento",
                self._formatar_moeda(
                    relatorio.valor_ap
                )
            ],
            [
                "Locação Normal",
                self._formatar_moeda(
                    relatorio.locacao_normal
                )
            ],
            [
                "Renda Passiva",
                self._formatar_moeda(
                    relatorio.renda_passiva
                )
            ],
            [
                "Média de Mercado",
                self._formatar_moeda(
                    relatorio.media_mercado
                )
            ]
        ]

        tabela_indicadores = Table(
            dados_indicadores,
            colWidths=[
                100 * mm,
                60 * mm
            ]
        )

        tabela_indicadores.setStyle(
            TableStyle([
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    colors.HexColor("#1f2937")
                ),
                (
                    "TEXTCOLOR",
                    (0, 0),
                    (-1, 0),
                    colors.white
                ),
                (
                    "FONTNAME",
                    (0, 0),
                    (-1, 0),
                    "Helvetica-Bold"
                ),
                (
                    "ALIGN",
                    (1, 1),
                    (1, -1),
                    "RIGHT"
                ),
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.grey
                ),
                (
                    "ROWBACKGROUNDS",
                    (0, 1),
                    (-1, -1),
                    [
                        colors.white,
                        colors.HexColor("#f3f4f6")
                    ]
                ),
                (
                    "FONTSIZE",
                    (0, 0),
                    (-1, -1),
                    9
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    7
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    7
                )
            ])
        )

        elementos.append(
            tabela_indicadores
        )

        elementos.append(
            Spacer(1, 15 * mm)
        )

        elementos.append(
            Paragraph(
                "Aurion System — "
                "Relatório gerado automaticamente",
                ParagraphStyle(
                    "Rodape",
                    parent=styles["Normal"],
                    alignment=TA_CENTER,
                    fontSize=8,
                    textColor=colors.grey
                )
            )
        )

        documento.build(
            elementos
        )

        buffer.seek(0)

        nome_arquivo = (
            f"relatorio_"
            f"apartamento_"
            f"{apartamento.numero}_"
            f"{relatorio.mes}_"
            f"{relatorio.ano}.pdf"
        )

        return buffer, nome_arquivo

    # ================================================================
    # IMPORTAR EXCEL
    # ================================================================

    async def importar_excel(
        self,
        db: Session,
        file: UploadFile
    ) -> list[RelatorioApartamento]:

        if not file.filename:

            raise ValueError(
                "Arquivo não informado."
            )

        extensoes_permitidas = (
            ".xlsx",
            ".xlsm"
        )

        if not file.filename.lower().endswith(
            extensoes_permitidas
        ):

            raise ValueError(
                "O arquivo precisa ser Excel "
                "(.xlsx ou .xlsm)."
            )

        apartamentos_excel = (
            await self.excel_service.ler_excel(
                file
            )
        )

        relatorios_criados = []

        for dados in apartamentos_excel:

            numero = str(
                dados["numero_apartamento"]
            )

            apartamento = (
                self.apartamento_repository
                .buscar_por_numero(
                    db,
                    numero
                )
            )

            if apartamento is None:

                raise ValueError(
                    f"Apartamento {numero} "
                    "não encontrado no CRM."
                )

            mes = dados["mes"]

            ano = int(
                dados["ano"]
            )

            relatorio_existente = (
                self.relatorio_repository
                .buscar_por_competencia(
                    db,
                    apartamento.id,
                    mes,
                    ano
                )
            )

            if relatorio_existente:

                relatorio = (
                    self._atualizar_relatorio(
                        relatorio_existente,
                        dados
                    )
                )

                relatorio = (
                    self.relatorio_repository
                    .atualizar(
                        db,
                        relatorio
                    )
                )

            else:

                relatorio = (
                    self._criar_relatorio(
                        apartamento.id,
                        dados
                    )
                )

                relatorio = (
                    self.relatorio_repository
                    .criar(
                        db,
                        relatorio
                    )
                )

            relatorios_criados.append(
                relatorio
            )

        return relatorios_criados

    # ================================================================
    # CRIAR RELATÓRIO
    # ================================================================

    def _criar_relatorio(
        self,
        apartamento_id,
        dados: dict
    ) -> RelatorioApartamento:

        return RelatorioApartamento(
            apartamento_id=apartamento_id,
            mes=dados["mes"],
            ano=int(dados["ano"]),
            receita_bruta=Decimal(
                str(dados["receita_bruta"])
            ),
            internet=Decimal(
                str(dados["internet"])
            ),
            copel=Decimal(
                str(dados["copel"])
            ),
            condominio=Decimal(
                str(dados["condominio"])
            ),
            limpeza=Decimal(
                str(dados["limpeza"])
            ),
            reparos=Decimal(
                str(dados["reparos"])
            ),
            administracao=Decimal(
                str(dados["administracao"])
            ),
            custos=Decimal(
                str(dados["custos"])
            ),
            receita_liquida=Decimal(
                str(dados["receita_liquida"])
            ),
            ocupacao=self._decimal_ou_none(
                dados.get("ocupacao")
            ),
            valor_ap=self._decimal_ou_none(
                dados.get("valor_ap")
            ),
            locacao_normal=self._decimal_ou_none(
                dados.get("locacao_normal")
            ),
            renda_passiva=self._decimal_ou_none(
                dados.get("renda_passiva")
            ),
            rentabilidade=self._decimal_ou_none(
                dados.get("rentabilidade")
            ),
            media_mercado=self._decimal_ou_none(
                dados.get("media_mercado")
            )
        )

    # ================================================================
    # ATUALIZAR RELATÓRIO
    # ================================================================

    def _atualizar_relatorio(
        self,
        relatorio: RelatorioApartamento,
        dados: dict
    ) -> RelatorioApartamento:

        relatorio.receita_bruta = Decimal(
            str(dados["receita_bruta"])
        )

        relatorio.internet = Decimal(
            str(dados["internet"])
        )

        relatorio.copel = Decimal(
            str(dados["copel"])
        )

        relatorio.condominio = Decimal(
            str(dados["condominio"])
        )

        relatorio.limpeza = Decimal(
            str(dados["limpeza"])
        )

        relatorio.reparos = Decimal(
            str(dados["reparos"])
        )

        relatorio.administracao = Decimal(
            str(dados["administracao"])
        )

        relatorio.custos = Decimal(
            str(dados["custos"])
        )

        relatorio.receita_liquida = Decimal(
            str(dados["receita_liquida"])
        )

        relatorio.ocupacao = (
            self._decimal_ou_none(
                dados.get("ocupacao")
            )
        )

        relatorio.valor_ap = (
            self._decimal_ou_none(
                dados.get("valor_ap")
            )
        )

        relatorio.locacao_normal = (
            self._decimal_ou_none(
                dados.get("locacao_normal")
            )
        )

        relatorio.renda_passiva = (
            self._decimal_ou_none(
                dados.get("renda_passiva")
            )
        )

        relatorio.rentabilidade = (
            self._decimal_ou_none(
                dados.get("rentabilidade")
            )
        )

        relatorio.media_mercado = (
            self._decimal_ou_none(
                dados.get("media_mercado")
            )
        )

        return relatorio

    # ================================================================
    # FORMATAÇÃO
    # ================================================================

    @staticmethod
    def _formatar_moeda(
        valor
    ) -> str:

        if valor is None:
            return "Não informado"

        return (
            f"R$ {float(valor):,.2f}"
            .replace(",", "X")
            .replace(".", ",")
            .replace("X", ".")
        )

    @staticmethod
    def _formatar_percentual(
        valor
    ) -> str:

        if valor is None:
            return "Não informado"

        return (
            f"{float(valor):.2f}"
            .replace(".", ",")
            + "%"
        )

    # ================================================================
    # DECIMAL
    # ================================================================

    def _decimal_ou_none(
        self,
        valor
    ) -> Decimal | None:

        if valor is None:
            return None

        return Decimal(
            str(valor)
        )

