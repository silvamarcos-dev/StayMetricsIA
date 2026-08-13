
export interface LoginRequest {
  email: string;
  senha: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo?: string;
}

