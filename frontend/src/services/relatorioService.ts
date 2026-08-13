import api from "../api/api";

export interface Relatorio {
  id: string;
  apartamento_id: string;
  mes: string | number;
  ano: string | number;

  receita_bruta: number;
  custos: number;
  receita_liquida: number;

  internet?: number;
  copel?: number;
  condominio?: number;
  limpeza?: number;
  reparos?: number;
  administracao?: number;

  ocupacao?: number;
  valor_ap?: number;
  locacao_normal?: number;
  renda_passiva?: number;
  rentabilidade?: number;
  media_mercado?: number;

  criado_em?: string | null;
}

export interface ResumoApartamento {
  id: string;
  apartamento_id: string;

  mes: string;
  ano: number;

  receita_bruta: number;
  internet: number;
  copel: number;
  condominio: number;
  limpeza: number;
  reparos: number;
  administracao: number;
  custos: number;
  receita_liquida: number;

  ocupacao: number | null;
  valor_ap: number | null;
  locacao_normal: number | null;
  renda_passiva: number | null;
  rentabilidade: number | null;
  media_mercado: number | null;

  criado_em: string | null;
}

export interface ResumoApartamentoResponse {
  sucesso: boolean;
  apartamento_id: string;
  resumo: ResumoApartamento;
}

export async function buscarResumoApartamento(
  apartamentoId: string
): Promise<ResumoApartamento> {

  const response =
    await api.get<ResumoApartamentoResponse>(
      `/relatorios/apartamento/${apartamentoId}/resumo`
    );

  return response.data.resumo;
}