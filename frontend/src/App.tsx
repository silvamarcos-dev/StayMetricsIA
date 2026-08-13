
import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Contatos from "./pages/Contatos";
import Chat from "./pages/Chat";
import Agenda from "./pages/Agenda";
import Relatorios from "./pages/Relatorios";
import Funil from "./pages/Funil";
import Imoveis from "./pages/Imoveis";
import Configuracoes from "./pages/Configuracoes";
import Login from "./pages/Login";

import {
  estaAutenticado,
  removerToken,
  buscarConfiguracoes,
} from "./api/api";

import type { Pagina } from "./types/Pagina";


// ================================================================
// APP
// ================================================================

function App() {

  // ============================================================
  // AUTENTICAÇÃO
  // ============================================================

  const [autenticado, setAutenticado] =
    useState<boolean>(() =>
      estaAutenticado()
    );


  // ============================================================
  // PÁGINA ATUAL
  // ============================================================

  const [paginaAtual, setPaginaAtual] =
    useState<Pagina>("dashboard");


  // ============================================================
  // NOME DA EMPRESA
  // ============================================================

  const [nomeEmpresa, setNomeEmpresa] =
    useState<string>("Carregando...");


  // ============================================================
  // CARREGAR CONFIGURAÇÕES DA EMPRESA
  // ============================================================

  useEffect(() => {

    if (!autenticado) {
      return;
    }


    let ativo = true;


    async function carregarConfiguracoes() {

      try {

        const configuracao =
          await buscarConfiguracoes();


        if (!ativo) {
          return;
        }


        setNomeEmpresa(
          configuracao.nome_empresa
        );

      } catch (error) {

        console.error(
          "Erro ao carregar configurações:",
          error
        );


        if (!ativo) {
          return;
        }


        setNomeEmpresa(
          "Sistema"
        );

      }

    }


    carregarConfiguracoes();


    return () => {

      ativo = false;

    };

  }, [autenticado]);


  // ============================================================
  // LOGIN
  // ============================================================

  function handleLogin() {

    setAutenticado(true);

  }


  // ============================================================
  // LOGOUT
  // ============================================================

  function handleLogout() {

    removerToken();

    setAutenticado(false);

    setNomeEmpresa(
      "Carregando..."
    );

    setPaginaAtual(
      "dashboard"
    );

  }


  // ============================================================
  // RENDERIZAR PÁGINA
  // ============================================================

  function renderizarPagina() {

    switch (paginaAtual) {

      case "dashboard":
        return <Dashboard />;


      case "contatos":
        return <Contatos />;


      case "chat":
        return <Chat />;


      case "agenda":
        return <Agenda />;


      case "imoveis":
        return <Imoveis />;


      case "relatorios":
        return <Relatorios />;


      case "funil":
        return <Funil />;


      case "configuracoes":
        return <Configuracoes />;


      default:
        return <Dashboard />;

    }

  }


  // ============================================================
  // TELA DE LOGIN
  // ============================================================

  if (!autenticado) {

    return (
      <Login
        onLogin={handleLogin}
      />
    );

  }


  // ============================================================
  // SISTEMA
  // ============================================================

  return (

    <div className="min-h-screen bg-[#09090b] text-zinc-100">

      {/* ========================================================
          SIDEBAR
      ======================================================== */}

      <Sidebar
        paginaAtual={paginaAtual}
        onNavigate={setPaginaAtual}
        nomeEmpresa={nomeEmpresa}
      />


      {/* ========================================================
          CONTEÚDO PRINCIPAL
      ======================================================== */}

      <main className="ml-72 min-h-screen bg-[#09090b]">


        {/* ======================================================
            HEADER
        ====================================================== */}

        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/5 bg-[#09090b]/95 px-8 backdrop-blur-xl">


          {/* ====================================================
              TÍTULO
          ==================================================== */}

          <div>

            <h2 className="text-lg font-semibold tracking-tight text-white">

              {getTituloPagina(
                paginaAtual
              )}

            </h2>


            <p className="mt-0.5 text-sm text-zinc-500">

              {getDescricaoPagina(
                paginaAtual
              )}

            </p>

          </div>


          {/* ====================================================
              AÇÕES
          ==================================================== */}

          <div className="flex items-center gap-3">


            {/* --------------------------------------------------
                NOTIFICAÇÕES
            -------------------------------------------------- */}

            <button
              type="button"
              aria-label="Notificações"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/5 bg-white/[0.025] text-zinc-500 transition-all duration-200 hover:border-white/10 hover:bg-white/[0.05] hover:text-zinc-200"
            >

              <span className="text-sm">
                🔔
              </span>

            </button>


            {/* --------------------------------------------------
                DIVISOR
            -------------------------------------------------- */}

            <div className="mx-1 h-6 w-px bg-white/5" />


            {/* --------------------------------------------------
                LOGOUT
            -------------------------------------------------- */}

            <button
              type="button"
              onClick={handleLogout}
              className="ml-1 rounded-lg px-2 py-2 text-xs font-medium text-zinc-600 transition-colors hover:text-red-400"
            >

              Sair

            </button>

          </div>

        </header>


        {/* ======================================================
            PÁGINA
        ====================================================== */}

        <div className="p-8">

          {renderizarPagina()}

        </div>

      </main>

    </div>

  );

}


// ================================================================
// TÍTULO DA PÁGINA
// ================================================================

function getTituloPagina(
  pagina: Pagina
): string {

  switch (pagina) {

    case "dashboard":
      return "Dashboard";


    case "contatos":
      return "Contatos";


    case "chat":
      return "Chat";


    case "agenda":
      return "Agenda";


    case "imoveis":
      return "Imóveis";


    case "relatorios":
      return "Relatórios";


    case "funil":
      return "Funil de vendas";


    case "configuracoes":
      return "Configurações";


    default:
      return "Stay Metrics IA";

  }

}


// ================================================================
// DESCRIÇÃO DA PÁGINA
// ================================================================

function getDescricaoPagina(
  pagina: Pagina
): string {

  switch (pagina) {

    case "dashboard":
      return "Visão geral do seu CRM";


    case "contatos":
      return "Gerencie seus clientes e proprietários";


    case "chat":
      return "Central de conversas e atendimento";


    case "agenda":
      return "Gerencie seus compromissos";


    case "imoveis":
      return "Gerencie os apartamentos e imóveis";


    case "relatorios":
      return "Relatórios financeiros dos apartamentos";


    case "funil":
      return "Acompanhe seus leads até a reserva";


    case "configuracoes":
      return "Configure seu CRM e suas integrações";


    default:
      return "Sistema de gestão Stay Metrics IA";

  }

}


export default App;

