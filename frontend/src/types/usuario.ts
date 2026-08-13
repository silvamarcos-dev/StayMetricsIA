export type TipoUsuario =
  | "ADMINISTRADOR"
  | "CORRETOR"
  | "ATENDENTE";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo: TipoUsuario;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}