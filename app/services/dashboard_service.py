
from decimal import Decimal

from sqlalchemy.orm import Session

from app.models.apartamento import Apartamento, StatusApartamento
from app.models.relatorio import RelatorioApartamento


class DashboardService:

    def obter_resumo(
        self,
        db: Session,
        mes: str,
        ano: int
    ) -> dict:

        total_apartamentos = (
            db.query(Apartamento)
            .count()
        )

        apartamentos_disponiveis = (
            db.query(Apartamento)
            .filter(
                Apartamento.status
                == StatusApartamento.DISPONIVEL
            )
            .count()
        )

        apartamentos_reservados = (
            db.query(Apartamento)
            .filter(
                Apartamento.status
                == StatusApartamento.RESERVADO
            )
            .count()
        )

        apartamentos_ocupados = (
            db.query(Apartamento)
            .filter(
                Apartamento.status
                == StatusApartamento.OCUPADO
            )
            .count()
        )

        apartamentos_manutencao = (
            db.query(Apartamento)
            .filter(
                Apartamento.status
                == StatusApartamento.MANUTENCAO
            )
            .count()
        )

        relatorios = (
            db.query(RelatorioApartamento)
            .filter(
                RelatorioApartamento.mes == mes,
                RelatorioApartamento.ano == ano
            )
            .all()
        )

        receita_bruta_total = sum(
            (
                relatorio.receita_bruta
                for relatorio in relatorios
            ),
            Decimal("0")
        )

        receita_liquida_total = sum(
            (
                relatorio.receita_liquida
                for relatorio in relatorios
            ),
            Decimal("0")
        )

        custos_total = sum(
            (
                relatorio.custos
                for relatorio in relatorios
            ),
            Decimal("0")
        )

        return {
            "total_apartamentos": total_apartamentos,
            "apartamentos_disponiveis": (
                apartamentos_disponiveis
            ),
            "apartamentos_reservados": (
                apartamentos_reservados
            ),
            "apartamentos_ocupados": (
                apartamentos_ocupados
            ),
            "apartamentos_manutencao": (
                apartamentos_manutencao
            ),
            "total_relatorios": len(relatorios),
            "receita_bruta_total": (
                receita_bruta_total
            ),
            "custos_total": custos_total,
            "receita_liquida_total": (
                receita_liquida_total
            )
        }

    def obter_financeiro(
        self,
        db: Session,
        mes: str,
        ano: int
    ) -> dict:

        relatorios = (
            db.query(RelatorioApartamento)
            .filter(
                RelatorioApartamento.mes == mes,
                RelatorioApartamento.ano == ano
            )
            .all()
        )

        receita_bruta = sum(
            (
                relatorio.receita_bruta
                for relatorio in relatorios
            ),
            Decimal("0")
        )

        custos = sum(
            (
                relatorio.custos
                for relatorio in relatorios
            ),
            Decimal("0")
        )

        receita_liquida = sum(
            (
                relatorio.receita_liquida
                for relatorio in relatorios
            ),
            Decimal("0")
        )

        return {
            "total_apartamentos": len(relatorios),
            "receita_bruta": receita_bruta,
            "custos": custos,
            "receita_liquida": receita_liquida
        }

    def obter_ocupacao(
        self,
        db: Session,
        mes: str,
        ano: int
    ) -> dict:

        relatorios = (
            db.query(RelatorioApartamento)
            .filter(
                RelatorioApartamento.mes == mes,
                RelatorioApartamento.ano == ano
            )
            .all()
        )

        valores = [
            relatorio.ocupacao
            for relatorio in relatorios
            if relatorio.ocupacao is not None
        ]

        if not valores:
            return {
                "total_apartamentos": len(
                    relatorios
                ),
                "ocupacao_media": None
            }

        ocupacao_media = (
            sum(valores, Decimal("0"))
            / len(valores)
        )

        return {
            "total_apartamentos": len(
                relatorios
            ),
            "ocupacao_media": ocupacao_media
        }

    def obter_rentabilidade(
        self,
        db: Session,
        mes: str,
        ano: int
    ) -> dict:

        relatorios = (
            db.query(RelatorioApartamento)
            .filter(
                RelatorioApartamento.mes == mes,
                RelatorioApartamento.ano == ano
            )
            .all()
        )

        valores = [
            relatorio.rentabilidade
            for relatorio in relatorios
            if relatorio.rentabilidade is not None
        ]

        if not valores:
            return {
                "total_apartamentos": len(
                    relatorios
                ),
                "rentabilidade_media": None
            }

        rentabilidade_media = (
            sum(valores, Decimal("0"))
            / len(valores)
        )

        return {
            "total_apartamentos": len(
                relatorios
            ),
            "rentabilidade_media": (
                rentabilidade_media
            )
        }

