export type TipoContato =
  | "CLIENTE"
  | "PROPRIETARIO"
  | "HOSPEDE"
  | "CORRETOR";

export interface Contato {
  id: string;
  nome: string;
  telefoneWhatsapp: string | null;
  email: string | null;
  apartamentoVinculado: string | null;
  tipo: TipoContato;
  observacoes: string | null;
  whatsappOptIn: boolean;
  criadoEm: string;
  atualizadoEm: string;
}