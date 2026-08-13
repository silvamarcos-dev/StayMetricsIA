import api from "../api/api";

import type {
  Visita,
  VisitaCreate,
  VisitaUpdate,
} from "../types/visita";

// ============================================================
// LISTAR VISITAS
// ============================================================

export async function listarVisitas(): Promise<Visita[]> {
  const response = await api.get<Visita[]>(
    "/api/agenda/visitas"
  );

  return response.data;
}

// ============================================================
// BUSCAR VISITA
// ============================================================

export async function buscarVisita(
  visitaId: string
): Promise<Visita> {
  const response = await api.get<Visita>(
    `/api/agenda/visitas/${encodeURIComponent(
      visitaId
    )}`
  );

  return response.data;
}

// ============================================================
// CRIAR VISITA
// ============================================================

export async function criarVisita(
  dados: VisitaCreate
): Promise<Visita> {
  const response = await api.post<Visita>(
    "/api/agenda/visitas",
    dados
  );

  return response.data;
}

// ============================================================
// ATUALIZAR VISITA
// ============================================================

export async function atualizarVisita(
  visitaId: string,
  dados: VisitaUpdate
): Promise<Visita> {
  const response = await api.put<Visita>(
    `/api/agenda/visitas/${encodeURIComponent(
      visitaId
    )}`,
    dados
  );

  return response.data;
}

// ============================================================
// DELETAR VISITA
// ============================================================

export async function deletarVisita(
  visitaId: string
): Promise<void> {
  await api.delete(
    `/api/agenda/visitas/${encodeURIComponent(
      visitaId
    )}`
  );
}