export type StatusVisita =
  | "AGENDADA"
  | "CONFIRMADA"
  | "REALIZADA"
  | "CANCELADA";

export type WhatsAppStatus =
  | "PENDENTE"
  | "ENVIADO"
  | "ERRO"
  | "SEM_TELEFONE";

export interface Visita {
  id: string;

  apartamento_id: string;
  contato_id: string;
  corretor_id: string;

  data: string;

  hora_inicio: string;
  hora_fim: string | null;

  status: StatusVisita;

  observacoes: string | null;

  google_event_id: string | null;

  whatsapp_status: WhatsAppStatus;

  criado_em: string;
}

export interface VisitaCreate {
  apartamento_id: string;
  contato_id: string;
  corretor_id: string;

  data: string;

  hora_inicio: string;
  hora_fim?: string | null;

  observacoes?: string | null;
}

export interface VisitaUpdate {
  apartamento_id?: string;
  contato_id?: string;
  corretor_id?: string;

  data?: string;

  hora_inicio?: string;
  hora_fim?: string | null;

  status?: StatusVisita;

  observacoes?: string | null;
}