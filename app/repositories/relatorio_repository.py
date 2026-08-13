from uuid import UUID

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.relatorio import RelatorioApartamento


class RelatorioRepository:

    def criar(
        self,
        db: Session,
        relatorio: RelatorioApartamento
    ) -> RelatorioApartamento:

        db.add(relatorio)

        db.commit()

        db.refresh(relatorio)

        return relatorio

    def listar(
        self,
        db: Session,
        skip: int = 0,
        limit: int = 100
    ) -> list[RelatorioApartamento]:

        return (
            db.query(RelatorioApartamento)
            .order_by(
                RelatorioApartamento.ano.desc(),
                RelatorioApartamento.criado_em.desc()
            )
            .offset(skip)
            .limit(limit)
            .all()
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

    def listar_por_apartamento(
        self,
        db: Session,
        apartamento_id: UUID
    ) -> list[RelatorioApartamento]:

        return (
            db.query(RelatorioApartamento)
            .filter(
                RelatorioApartamento.apartamento_id
                == apartamento_id
            )
            .order_by(
                RelatorioApartamento.ano.desc(),
                RelatorioApartamento.criado_em.desc()
            )
            .all()
        )

    def buscar_ultimo_por_apartamento(
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
                RelatorioApartamento.ano.desc(),
                RelatorioApartamento.criado_em.desc()
            )
            .first()
        )

    def buscar_por_competencia(
        self,
        db: Session,
        apartamento_id: UUID,
        mes: str,
        ano: int
    ) -> RelatorioApartamento | None:

        return (
            db.query(RelatorioApartamento)
            .filter(
                RelatorioApartamento.apartamento_id
                == apartamento_id,
                RelatorioApartamento.mes == mes,
                RelatorioApartamento.ano == ano
            )
            .first()
        )

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
                RelatorioApartamento.apartamento_id
            )
            .all()
        )

    def calcular_resumo(
        self,
        db: Session,
        mes: str,
        ano: int
    ) -> dict:

        resultado = (
            db.query(
                func.count(
                    RelatorioApartamento.id
                ).label("total_apartamentos"),

                func.coalesce(
                    func.sum(
                        RelatorioApartamento.receita_bruta
                    ),
                    0
                ).label("receita_bruta_total"),

                func.coalesce(
                    func.sum(
                        RelatorioApartamento.custos
                    ),
                    0
                ).label("custos_total"),

                func.coalesce(
                    func.sum(
                        RelatorioApartamento.receita_liquida
                    ),
                    0
                ).label("receita_liquida_total"),

                func.coalesce(
                    func.sum(
                        RelatorioApartamento.internet
                    ),
                    0
                ).label("internet_total"),

                func.coalesce(
                    func.sum(
                        RelatorioApartamento.copel
                    ),
                    0
                ).label("copel_total"),

                func.coalesce(
                    func.sum(
                        RelatorioApartamento.condominio
                    ),
                    0
                ).label("condominio_total"),

                func.coalesce(
                    func.sum(
                        RelatorioApartamento.limpeza
                    ),
                    0
                ).label("limpeza_total"),

                func.coalesce(
                    func.sum(
                        RelatorioApartamento.reparos
                    ),
                    0
                ).label("reparos_total"),

                func.coalesce(
                    func.sum(
                        RelatorioApartamento.administracao
                    ),
                    0
                ).label("administracao_total"),

                func.avg(
                    RelatorioApartamento.ocupacao
                ).label("ocupacao_media"),

                func.avg(
                    RelatorioApartamento.rentabilidade
                ).label("rentabilidade_media")
            )
            .filter(
                RelatorioApartamento.mes == mes,
                RelatorioApartamento.ano == ano
            )
            .one()
        )

        return {
            "total_apartamentos": (
                resultado.total_apartamentos or 0
            ),

            "receita_bruta_total": (
                resultado.receita_bruta_total
                or 0
            ),

            "custos_total": (
                resultado.custos_total
                or 0
            ),

            "receita_liquida_total": (
                resultado.receita_liquida_total
                or 0
            ),

            "internet_total": (
                resultado.internet_total
                or 0
            ),

            "copel_total": (
                resultado.copel_total
                or 0
            ),

            "condominio_total": (
                resultado.condominio_total
                or 0
            ),

            "limpeza_total": (
                resultado.limpeza_total
                or 0
            ),

            "reparos_total": (
                resultado.reparos_total
                or 0
            ),

            "administracao_total": (
                resultado.administracao_total
                or 0
            ),

            "ocupacao_media": (
                resultado.ocupacao_media
            ),

            "rentabilidade_media": (
                resultado.rentabilidade_media
            )
        }

    def atualizar(
        self,
        db: Session,
        relatorio: RelatorioApartamento
    ) -> RelatorioApartamento:

        db.commit()

        db.refresh(relatorio)

        return relatorio

    def deletar(
        self,
        db: Session,
        relatorio: RelatorioApartamento
    ) -> None:

        db.delete(relatorio)

        db.commit()