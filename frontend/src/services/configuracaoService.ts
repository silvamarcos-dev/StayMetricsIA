import api from "../api/api";

export interface Configuracao {
  id: string;

  nomeEmpresa: string;

  email: string | null;

  telefone: string | null;

  whatsappNumero: string | null;

  whatsappNumeroId: string | null;

  notificacoesEmail: boolean;

  notificacoesWhatsapp: boolean;

  notificacoesAgenda: boolean;

  automacaoIA: boolean;

  respostasAutomaticas: boolean;
}


export type ConfiguracaoUpdate = Omit<
  Configuracao,
  "id"
>;


export async function buscarConfiguracoes(): Promise<Configuracao> {

  const response =
    await api.get<Configuracao>(
      "/api/configuracoes"
    );

  return response.data;
}


export async function atualizarConfiguracoes(
  dados: ConfiguracaoUpdate
): Promise<Configuracao> {

  const response =
    await api.put<Configuracao>(
      "/api/configuracoes",
      dados
    );

  return response.data;
}