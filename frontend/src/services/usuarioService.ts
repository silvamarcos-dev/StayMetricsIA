import api from "../api/api";

import type {
  Usuario,
} from "../types/usuario";

// ============================================================
// LISTAR USUÁRIOS
// ============================================================

export async function listarUsuarios(): Promise<Usuario[]> {
  const response = await api.get<Usuario[]>(
    "/api/usuarios"
  );

  return response.data;
}

// ============================================================
// LISTAR CORRETORES
// ============================================================

export async function listarCorretores(): Promise<Usuario[]> {
  const usuarios =
    await listarUsuarios();

  return usuarios.filter(
    (usuario) =>
      usuario.tipo === "CORRETOR" &&
      usuario.ativo
  );
}

// ============================================================
// BUSCAR USUÁRIO
// ============================================================

export async function buscarUsuario(
  usuarioId: string
): Promise<Usuario> {
  const response = await api.get<Usuario>(
    `/api/usuarios/${encodeURIComponent(
      usuarioId
    )}`
  );

  return response.data;
}