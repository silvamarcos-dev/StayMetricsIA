from uuid import UUID
from decimal import Decimal

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.models.relatorio import RelatorioApartamento
from app.repositories.apartamento_repository import (
    ApartamentoRepository
)
from app.repositories.relatorio_repository import (
    RelatorioRepository
)
from app.services.excel_service import ExcelService


class RelatorioService:

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

    def __init__(self):

        self.excel_service = ExcelService()

        self.apartamento_repository = (
            ApartamentoRepository()
        )

        self.relatorio_repository = (
            RelatorioRepository()
        )

    def buscar_por_id(
        self,
        db: Session,
        relatorio_id: UUID
    ) -> RelatorioApartamento | None:

        return self.relatorio_repository.buscar_por_id(
            db,
            relatorio_id
        )

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
            ano = int(dados["ano"])

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

        relatorio.ocupacao = self._decimal_ou_none(
            dados.get("ocupacao")
        )

        relatorio.valor_ap = self._decimal_ou_none(
            dados.get("valor_ap")
        )

        relatorio.locacao_normal = self._decimal_ou_none(
            dados.get("locacao_normal")
        )

        relatorio.renda_passiva = self._decimal_ou_none(
            dados.get("renda_passiva")
        )

        relatorio.rentabilidade = self._decimal_ou_none(
            dados.get("rentabilidade")
        )

        relatorio.media_mercado = self._decimal_ou_none(
            dados.get("media_mercado")
        )

        return relatorio

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

    def buscar_por_id(
        self,
        db: Session,
        relatorio_id: UUID
    ) -> RelatorioApartamento | None:

        return (
            db.query(RelatorioApartamento)
            .filter(
                RelatorioApartamento.id == relatorio_id
            )
            .first()
        )

    def buscar_por_apartamento_e_competencia(
        self,
        db: Session,
        apartamento_id: UUID,
        mes: str,
        ano: int
    ) -> RelatorioApartamento | None:

        return self.relatorio_repository.buscar_por_competencia(
            db,
            apartamento_id,
            mes,
            ano
        )

    def _decimal_ou_none(
        self,
        valor
    ) -> Decimal | None:

        if valor is None:
            return None

        return Decimal(str(valor))