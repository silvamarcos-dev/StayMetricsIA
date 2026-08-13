import api from "../api/api";

import type {
  Apartamento,
  ApartamentoCreate,
} from "../types/apartamento";

export async function listarApartamentos(): Promise<Apartamento[]> {
  const response = await api.get<Apartamento[]>(
    "/api/crm/apartamentos"
  );

  return response.data;
}

export async function buscarApartamento(
  apartamentoId: string
): Promise<Apartamento> {
  const response = await api.get<Apartamento>(
    `/api/crm/apartamentos/${encodeURIComponent(
      apartamentoId
    )}`
  );

  return response.data;
}

export async function criarApartamento(
  dados: ApartamentoCreate
): Promise<Apartamento> {
  const response = await api.post<Apartamento>(
    "/api/crm/apartamentos",
    dados
  );

  return response.data;
}