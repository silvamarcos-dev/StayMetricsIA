import api from "../api/api";

import type {
  Contato,
} from "../types/contato";

export async function listarContatos(): Promise<Contato[]> {
  const response = await api.get<Contato[]>(
    "/api/crm/contatos"
  );

  return response.data;
}

export async function buscarContato(
  contatoId: string
): Promise<Contato> {
  const response = await api.get<Contato>(
    `/api/crm/contatos/${encodeURIComponent(
      contatoId
    )}`
  );

  return response.data;
}