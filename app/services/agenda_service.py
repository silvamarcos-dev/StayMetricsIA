from datetime import date, time
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.visita import Visita

from app.repositories.apartamento_repository import (
    ApartamentoRepository
)

from app.repositories.contato_repository import (
    ContatoRepository
)

from app.repositories.visita_repository import (
    VisitaRepository
)

from app.services.whatsapp_service import (
    WhatsAppService
)


class AgendaService:

    def __init__(self):

        self.visita_repository = (
            VisitaRepository()
        )

        self.apartamento_repository = (
            ApartamentoRepository()
        )

        self.contato_repository = (
            ContatoRepository()
        )

        self.whatsapp = WhatsAppService()


    # =========================================================
    # CRIAR VISITA
    # =========================================================

    def criar_visita(
        self,
        db: Session,
        visita: Visita
    ) -> Visita:

        # -----------------------------------------------------
        # VALIDAR APARTAMENTO
        # -----------------------------------------------------

        apartamento = (
            self.apartamento_repository.buscar_por_id(
                db,
                visita.apartamento_id
            )
        )

        if not apartamento:

            raise ValueError(
                "Apartamento não encontrado."
            )


        # -----------------------------------------------------
        # VALIDAR CONTATO
        # -----------------------------------------------------

        contato = (
            self.contato_repository.buscar_por_id(
                db,
                visita.contato_id
            )
        )

        if not contato:

            raise ValueError(
                "Contato não encontrado."
            )


        # -----------------------------------------------------
        # VALIDAR HORÁRIO
        # -----------------------------------------------------

        if visita.hora_fim:

            if visita.hora_fim <= visita.hora_inicio:

                raise ValueError(
                    "O horário de término deve ser "
                    "posterior ao horário de início."
                )


        # -----------------------------------------------------
        # VERIFICAR CONFLITO
        # -----------------------------------------------------

        visitas_do_dia = (
            self.visita_repository.listar_por_data(
                db,
                visita.data
            )
        )

        for existente in visitas_do_dia:

            if existente.status == "CANCELADA":

                continue


            # Se não houver hora_fim,
            # consideramos apenas o horário inicial.

            if not existente.hora_fim:

                if (
                    existente.apartamento_id
                    == visita.apartamento_id
                    and existente.hora_inicio
                    == visita.hora_inicio
                ):

                    raise ValueError(
                        "Já existe uma visita "
                        "agendada para este apartamento "
                        "neste horário."
                    )

                continue


            # Se a nova visita não possuir hora_fim,
            # comparamos apenas o horário inicial.

            if not visita.hora_fim:

                if (
                    existente.apartamento_id
                    == visita.apartamento_id
                    and existente.hora_inicio
                    <= visita.hora_inicio
                    < existente.hora_fim
                ):

                    raise ValueError(
                        "O horário informado conflita "
                        "com outra visita deste apartamento."
                    )

                continue


            # -------------------------------------------------
            # SOBREPOSIÇÃO DE HORÁRIOS
            # -------------------------------------------------

            existe_sobreposicao = (
                visita.hora_inicio
                < existente.hora_fim
                and
                visita.hora_fim
                > existente.hora_inicio
            )


            if (
                existente.apartamento_id
                == visita.apartamento_id
                and existe_sobreposicao
            ):

                raise ValueError(
                    "Já existe uma visita agendada "
                    "para este apartamento neste período."
                )


        # -----------------------------------------------------
        # CRIAR VISITA
        # -----------------------------------------------------

        visita = (
            self.visita_repository.criar(
                db,
                visita
            )
        )


        # -----------------------------------------------------
        # WHATSAPP
        # -----------------------------------------------------

        if (
            contato.telefoneWhatsapp
            and contato.whatsappOptIn
        ):

            data_formatada = (
                visita.data.strftime("%d/%m/%Y")
            )

            hora_formatada = (
                visita.hora_inicio.strftime("%H:%M")
            )

            mensagem = (
                f"Olá, {contato.nome}! 👋\n\n"
                f"Sua visita ao apartamento "
                f"{apartamento.numero} "
                f"foi agendada.\n\n"
                f"📅 Data: {data_formatada}\n"
                f"🕐 Horário: {hora_formatada}\n\n"
                f"Estamos aguardando você!"
            )

            try:

                self.whatsapp.enviar_mensagem(
                    telefone=contato.telefoneWhatsapp,
                    mensagem=mensagem
                )

                visita.whatsapp_status = "ENVIADO"

            except Exception as error:

                print(
                    f"Erro ao enviar WhatsApp: {error}"
                )

                visita.whatsapp_status = "ERRO"

        elif not contato.telefoneWhatsapp:

            visita.whatsapp_status = (
                "SEM_TELEFONE"
            )

        else:

            visita.whatsapp_status = (
                "SEM_OPT_IN"
            )


        # -----------------------------------------------------
        # SALVAR STATUS DO WHATSAPP
        # -----------------------------------------------------

        return (
            self.visita_repository.atualizar(
                db,
                visita
            )
        )


    # =========================================================
    # LISTAR VISITAS
    # =========================================================

    def listar_visitas(
        self,
        db: Session
    ) -> list[Visita]:

        return (
            self.visita_repository.listar(
                db
            )
        )


    # =========================================================
    # LISTAR VISITAS POR DATA
    # =========================================================

    def listar_visitas_por_data(
        self,
        db: Session,
        data: date
    ) -> list[Visita]:

        return (
            self.visita_repository.listar_por_data(
                db,
                data
            )
        )


    # =========================================================
    # BUSCAR POR ID
    # =========================================================

    def buscar_por_id(
        self,
        db: Session,
        visita_id: UUID
    ) -> Visita | None:

        return (
            self.visita_repository.buscar_por_id(
                db,
                visita_id
            )
        )