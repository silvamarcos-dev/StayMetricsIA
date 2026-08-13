
import  api from "../api/api"; 

import type {
  LoginRequest,
  TokenResponse,
  Usuario,
} from "../types/auth";

export async function login(
  dados: LoginRequest
): Promise<TokenResponse> {
  const response = await api.post<TokenResponse>(
    "/api/auth/login",
    dados
  );

  localStorage.setItem(
    "access_token",
    response.data.access_token
  );

  return response.data;
}

export async function buscarUsuarioAtual(): Promise<Usuario> {
  const response = await api.get<{
    sucesso: boolean;
    usuario: Usuario;
  }>("/api/auth/me");

  return response.data.usuario;
}

export function logout(): void {
  localStorage.removeItem("access_token");
}

