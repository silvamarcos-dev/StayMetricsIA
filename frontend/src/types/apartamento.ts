
export type StatusApartamento =
  | "DISPONIVEL"
  | "RESERVADO"
  | "OCUPADO"
  | "MANUTENCAO";

export interface Apartamento {
  id: string;
  numero: string;
  bloco: string | null;
  status: StatusApartamento;
  proprietarioId: string | null;
  observacoes: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

export interface ApartamentoCreate {
  numero: string;
  bloco?: string | null;
  status?: StatusApartamento;
  proprietarioId?: string | null;
  observacoes?: string | null;
}

