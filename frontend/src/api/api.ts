import axios from "axios";

import type {
  Visita,
  VisitaCreate,
  VisitaUpdate,
} from "../types/visita";


const api = axios.create({
  baseURL: "https://staymetricsia.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});


// ============================================================
// INTERCEPTOR DE REQUISIÇÃO
// ============================================================

api.interceptors.request.use((config) => {

  const token =
    localStorage.getItem("access_token");

  if (token) {

    config.headers.Authorization =
      `Bearer ${token}`;

  }

  return config;

});


// ============================================================
// INTERCEPTOR DE RESPOSTA
// ============================================================

api.interceptors.response.use(

  (response) => response,

  (error) => {

    if (
      error.response?.status === 401
    ) {

      localStorage.removeItem(
        "access_token"
      );

    }

    return Promise.reject(error);

  }

);


// ============================================================
// AUTENTICAÇÃO
// ============================================================

export interface TokenResponse {

  access_token: string;

  token_type: string;

}


export interface UsuarioAtual {

  id: string;

  nome: string;

  email: string;

  tipo:
    | "ADMINISTRADOR"
    | "CORRETOR"
    | "FINANCEIRO"
    | "OPERACIONAL"
    | string;

}


export interface UsuarioAtualResponse {

  sucesso: boolean;

  usuario: UsuarioAtual;

}


export async function login(

  email: string,

  senha: string

): Promise<TokenResponse> {

  const response =
    await api.post<TokenResponse>(

      "/api/auth/login",

      {
        email,
        senha,
      }

    );

  return response.data;

}


export async function buscarUsuarioAtual(): Promise<UsuarioAtual> {

  const response =
    await api.get<UsuarioAtualResponse>(
      "/api/auth/me"
    );

  return response.data.usuario;

}


export function salvarToken(
  token: string
): void {

  localStorage.setItem(
    "access_token",
    token
  );

}


export function estaAutenticado(): boolean {

  return Boolean(
    localStorage.getItem(
      "access_token"
    )
  );

}


export function removerToken(): void {

  localStorage.removeItem(
    "access_token"
  );

}


// ============================================================
// CONTATOS
// ============================================================

export interface Contato {

  id: number;

  nome: string;

  telefoneWhatsapp: string;

  email?: string | null;

  apartamentoVinculado?: string | null;

  tipo:
    | "CLIENTE"
    | "PROPRIETARIO"
    | "HOSPEDE"
    | "CORRETOR";

  observacoes?: string | null;

  whatsappOptIn?: boolean;

  whatsappStatus?:
    | "ATIVO"
    | "INATIVO";

  criadoEm: string;

}


export type NovoContato = {

  nome: string;

  telefoneWhatsapp: string;

  email?: string;

  apartamentoVinculado?: string;

  tipo:
    | "CLIENTE"
    | "PROPRIETARIO"
    | "HOSPEDE"
    | "CORRETOR";

  observacoes?: string;

  whatsappOptIn?: boolean;

};


export async function listarContatos(): Promise<Contato[]> {

  const response =
    await api.get<Contato[]>(
      "/api/crm/contatos"
    );

  return response.data;

}


export async function criarContato(

  dados: NovoContato

): Promise<Contato> {

  const response =
    await api.post<Contato>(

      "/api/crm/contatos",

      dados

    );

  return response.data;

}


// ============================================================
// AGENDA
// ============================================================


// ============================================================
// LISTAR VISITAS
// ============================================================

export async function listarVisitas(): Promise<Visita[]> {

  const response =
    await api.get<Visita[]>(
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

  const response =
    await api.get<Visita>(

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

  const response =
    await api.post<Visita>(

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

  const response =
    await api.put<Visita>(

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


// ============================================================
// CHAT
// ============================================================

export interface Conversa {

  id: number;

  nome: string;

  telefone: string;

  online: boolean;

  horario: string;

  ultimaMensagem: string;

  naoLidas: number;

}


export interface Mensagem {

  id: number;

  conversaId?: number;

  texto?: string | null;

  tipo:
    | "texto"
    | "audio"
    | "arquivo";

  direcao?:
    | "enviada"
    | "recebida";

  horario: string;

  audioUrl?: string | null;

  arquivoUrl?: string | null;

}


export async function listarConversas(): Promise<Conversa[]> {

  const response =
    await api.get<Conversa[]>(
      "/api/chat/conversas"
    );

  return response.data;

}


export async function listarMensagens(

  conversaId: number

): Promise<Mensagem[]> {

  const response =
    await api.get<Mensagem[]>(

      `/api/chat/conversas/${conversaId}/mensagens`

    );

  return response.data;

}


export async function enviarMensagem(

  conversaId: number,

  texto: string

): Promise<Mensagem> {

  const response =
    await api.post<Mensagem>(

      `/api/chat/conversas/${conversaId}/mensagens`,

      {
        texto,
      }

    );

  return response.data;

}


export async function enviarArquivo(

  conversaId: number,

  arquivo: File

): Promise<Mensagem> {

  const formData =
    new FormData();

  formData.append(
    "arquivo",
    arquivo
  );

  const response =
    await api.post<Mensagem>(

      `/api/chat/conversas/${conversaId}/arquivos`,

      formData

    );

  return response.data;

}


export async function enviarAudio(

  conversaId: number,

  audio: Blob

): Promise<Mensagem> {

  const formData =
    new FormData();

  formData.append(

    "arquivo",

    audio,

    "audio.webm"

  );

  const response =
    await api.post<Mensagem>(

      `/api/chat/conversas/${conversaId}/audio`,

      formData

    );

  return response.data;

}


// ============================================================
// WHATSAPP
// ============================================================

export interface WhatsAppQrCode {

  pairingCode?: string | null;

  code?: string;

  base64?: string;

}


export interface WhatsAppStatus {

  instance?: {

    instanceName?: string;

    state?:
      | "open"
      | "connecting"
      | "close"
      | string;

  };

}


export async function conectarWhatsApp(): Promise<WhatsAppQrCode> {

  const response =
    await api.get<WhatsAppQrCode>(
      "/whatsapp/connect"
    );

  return response.data;

}


export async function statusWhatsApp(): Promise<WhatsAppStatus> {

  const response =
    await api.get<WhatsAppStatus>(
      "/whatsapp/status"
    );

  return response.data;

}


// ============================================================
// RELATÓRIOS
// ============================================================

export interface Relatorio {

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


export type ResumoApartamento =
  Relatorio;


// ============================================================
// RELATÓRIO RETORNADO PELA IMPORTAÇÃO
// ============================================================

export interface ApartamentoRelatorio {

  apartamento: string;

  apartamento_id: string;

  mes: string;

  ano: number;

  receitaBruta: number;

  internet: number;

  copel: number;

  condominio: number;

  limpeza: number;

  reparos: number;

  administracao: number;

  custos: number;

  receitaLiquida: number;

}


// ============================================================
// RESPOSTA DA IMPORTAÇÃO
// ============================================================

export interface ImportacaoResponse {

  sucesso: boolean;

  arquivo: string;

  total_apartamentos: number;

  apartamentos:
    ApartamentoRelatorio[];

}


// ============================================================
// RESUMO DE UM APARTAMENTO
// ============================================================

export interface ResumoApartamentoResponse {

  sucesso: boolean;

  apartamento_id: string;

  resumo: ResumoApartamento;

}


// ============================================================
// BUSCAR RELATÓRIO POR COMPETÊNCIA
// ============================================================

export interface RelatorioCompetenciaResponse {

  sucesso: boolean;

  relatorio: Relatorio;

}


// ============================================================
// IMPORTAR EXCEL
// ============================================================

export async function importarExcel(

  arquivo: File

): Promise<ImportacaoResponse> {

  const formData =
    new FormData();

  formData.append(
    "arquivo",
    arquivo
  );

  const response =
    await api.post<ImportacaoResponse>(

      "/relatorios/importar-excel",

      formData,

      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }

    );

  return response.data;

}


// ============================================================
// BUSCAR RESUMO DO APARTAMENTO
// ============================================================

export async function buscarResumoApartamento(

  apartamentoId: string

): Promise<ResumoApartamentoResponse> {

  const response =
    await api.get<ResumoApartamentoResponse>(

      `/relatorios/apartamento/${encodeURIComponent(
        apartamentoId
      )}/resumo`

    );

  return response.data;

}


// ============================================================
// BUSCAR RELATÓRIO POR APARTAMENTO + COMPETÊNCIA
// ============================================================

export async function buscarRelatorioPorApartamentoCompetencia(

  apartamentoId: string,

  mes: string,

  ano: number

): Promise<RelatorioCompetenciaResponse> {

  const response =
    await api.get<RelatorioCompetenciaResponse>(

      `/relatorios/apartamento/${encodeURIComponent(
        apartamentoId
      )}/competencia`,

      {
        params: {
          mes,
          ano,
        },
      }

    );

  return response.data;

}


// ============================================================
// LISTAR RELATÓRIOS DO APARTAMENTO
// ============================================================

export interface ListaRelatoriosApartamentoResponse {

  sucesso: boolean;

  apartamento_id: string;

  total: number;

  relatorios: Relatorio[];

}


export async function listarRelatoriosPorApartamento(

  apartamentoId: string

): Promise<ListaRelatoriosApartamentoResponse> {

  const response =
    await api.get<ListaRelatoriosApartamentoResponse>(

      `/relatorios/apartamento/${encodeURIComponent(
        apartamentoId
      )}`

    );

  return response.data;

}


// ============================================================
// LISTAR RELATÓRIOS POR COMPETÊNCIA
// ============================================================

export interface ListaRelatoriosCompetenciaResponse {

  sucesso: boolean;

  mes: string;

  ano: number;

  total: number;

  relatorios: Relatorio[];

}


export async function listarRelatoriosPorCompetencia(

  mes: string,

  ano: number

): Promise<ListaRelatoriosCompetenciaResponse> {

  const response =
    await api.get<ListaRelatoriosCompetenciaResponse>(

      "/relatorios/competencia",

      {
        params: {
          mes,
          ano,
        },
      }

    );

  return response.data;

}


// ============================================================
// LISTAR TODOS OS RELATÓRIOS
// ============================================================

export interface ListaRelatoriosResponse {

  sucesso: boolean;

  total: number;

  relatorios: Relatorio[];

}


export async function listarRelatorios(): Promise<ListaRelatoriosResponse> {

  const response =
    await api.get<ListaRelatoriosResponse>(
      "/relatorios"
    );

  return response.data;

}


// ============================================================
// BUSCAR RELATÓRIO POR ID
// ============================================================

export interface BuscarRelatorioResponse {

  sucesso: boolean;

  relatorio: Relatorio;

}


export async function buscarRelatorio(

  relatorioId: string

): Promise<BuscarRelatorioResponse> {

  const response =
    await api.get<BuscarRelatorioResponse>(

      `/relatorios/${encodeURIComponent(
        relatorioId
      )}`

    );

  return response.data;

}


// ============================================================
// GERAR PDF DE UM RELATÓRIO
// ============================================================

export async function gerarRelatorio(

  relatorioId: string

): Promise<Blob> {

  const response =
    await api.get(

      `/relatorios/${encodeURIComponent(
        relatorioId
      )}/pdf`,

      {
        responseType: "blob",
      }

    );

  return response.data;

}


// ============================================================
// GERAR PDF DA COMPETÊNCIA
// ============================================================

export async function gerarRelatorioCompetencia(

  mes: string,

  ano: number

): Promise<Blob> {

  const response =
    await api.get(

      "/relatorios/competencia/pdf",

      {
        params: {
          mes,
          ano,
        },

        responseType: "blob",
      }

    );

  return response.data;

}


// ============================================================
// GERAR ZIP DOS RELATÓRIOS
// ============================================================

export async function gerarRelatoriosZip(

  relatorios: ApartamentoRelatorio[]

): Promise<Blob> {

  const response =
    await api.post(

      "/relatorios/gerar-zip",

      relatorios,

      {
        responseType: "blob",
      }

    );

  return response.data;

}


// ============================================================
// CONFIGURAÇÕES
// ============================================================

export interface Configuracao {

  id: string;

  nome_empresa: string;

  nome_sistema: string;

  logo_url: string | null;

  email: string | null;

  telefone: string | null;

  whatsapp: string | null;

  whatsapp_id_numero:
    string | null;

  endereco: string | null;

  notificacoes_email: boolean;

  notificacoes_whatsapp: boolean;

  notificacoes_agenda: boolean;

  automacao_ia: boolean;

  respostas_automaticas: boolean;

  cor_primaria: string;

  cor_secundaria: string;

  timezone: string;

  ativo: boolean;

  atualizado_em: string;

}


export interface ConfiguracaoUpdate {

  nome_empresa?: string;

  nome_sistema?: string;

  logo_url?: string | null;

  email?: string | null;

  telefone?: string | null;

  whatsapp?: string | null;

  whatsapp_id_numero?:
    string | null;

  endereco?: string | null;

  notificacoes_email?: boolean;

  notificacoes_whatsapp?: boolean;

  notificacoes_agenda?: boolean;

  automacao_ia?: boolean;

  respostas_automaticas?: boolean;

  cor_primaria?: string;

  cor_secundaria?: string;

  timezone?: string;

  ativo?: boolean;

}


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


// ============================================================
// GOOGLE CALENDAR
// ============================================================

export interface GoogleCalendarStatus {

  conectado: boolean;

  email_google?:
    string | null;

  calendar_id?:
    string | null;

}


export async function buscarStatusGoogleCalendar(): Promise<GoogleCalendarStatus> {

  const response =
    await api.get<GoogleCalendarStatus>(

      "/api/google/calendar/status"

    );

  return response.data;

}


export function conectarGoogleCalendar(): void {

  window.location.href =
    "http://127.0.0.1:8000/api/google/calendar/connect";

}


// ============================================================
// EXPORT DEFAULT
// ============================================================

export default api;
