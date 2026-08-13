import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  Users,
  MessageSquare,
  CalendarDays,
  FileText,
  Settings,
  Building2,
  Kanban,
} from "lucide-react";

import type { Pagina } from "../types/Pagina";

import {
  buscarUsuarioAtual,
  type UsuarioAtual,
} from "../api/api";


interface SidebarProps {
  paginaAtual: Pagina;
  onNavigate: (pagina: Pagina) => void;
  nomeEmpresa: string;
}


export default function Sidebar({
  paginaAtual,
  onNavigate,
  nomeEmpresa,
}: SidebarProps) {

  // ============================================================
  // USUÁRIO AUTENTICADO
  // ============================================================

  const [usuario, setUsuario] =
    useState<UsuarioAtual | null>(null);

  const [carregandoUsuario, setCarregandoUsuario] =
    useState(true);


  // ============================================================
  // CARREGAR USUÁRIO AUTENTICADO
  // ============================================================

  useEffect(() => {

    let montado = true;


    async function carregarUsuario() {

      try {

        const dados =
          await buscarUsuarioAtual();


        if (!montado) {
          return;
        }


        setUsuario(dados);

      } catch (error) {

        console.error(
          "Erro ao carregar usuário autenticado:",
          error
        );


        if (!montado) {
          return;
        }


        setUsuario(null);

      } finally {

        if (montado) {

          setCarregandoUsuario(false);

        }

      }

    }


    carregarUsuario();


    return () => {

      montado = false;

    };

  }, []);


  // ============================================================
  // MENU
  // ============================================================

  const menu = [
    {
      id: "dashboard" as Pagina,
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "contatos" as Pagina,
      label: "Contatos",
      icon: Users,
    },
    {
      id: "chat" as Pagina,
      label: "Chat",
      icon: MessageSquare,
    },
    {
      id: "agenda" as Pagina,
      label: "Agenda",
      icon: CalendarDays,
    },
    {
      id: "relatorios" as Pagina,
      label: "Relatórios",
      icon: FileText,
    },
    {
      id: "funil" as Pagina,
      label: "Funil",
      icon: Kanban,
    },
    {
      id: "imoveis" as Pagina,
      label: "Imóveis",
      icon: Building2,
    },
  ];


  // ============================================================
  // DADOS DO USUÁRIO
  // ============================================================

  const nomeCompleto =
    usuario?.nome?.trim() || "Usuário";


  const primeiroNome =
    nomeCompleto
      .split(/\s+/)[0] || "Usuário";


  const inicial =
    primeiroNome
      .charAt(0)
      .toUpperCase();


  // ============================================================
  // TIPO DO USUÁRIO
  // ============================================================

  function formatarTipoUsuario(
    tipo?: UsuarioAtual["tipo"] | null
  ): string {

    switch (tipo) {

      case "ADMINISTRADOR":
        return "Administrador";

      case "CORRETOR":
        return "Corretor";

      default:
        return "Usuário";

    }

  }


  const tipoUsuario =
    formatarTipoUsuario(
      usuario?.tipo
    );


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <aside className="fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/5 bg-[#09090b] text-white">

      {/* ========================================================
          MARCA
      ======================================================== */}

      <div className="flex h-24 items-center border-b border-white/5 px-6">

        <div className="flex min-w-0 items-center gap-3">

          {/* ÍCONE */}

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">

            <Building2
              className="h-5 w-5 text-white"
            />

          </div>


          {/* NOME */}

          <div className="min-w-0">

            <h1 className="truncate text-[15px] font-semibold tracking-tight text-white">

              {nomeEmpresa ||
                "Carregando..."}

            </h1>


            <p className="mt-0.5 truncate text-[11px] font-medium text-zinc-500">

              By Imobiliária Meta

            </p>

          </div>

        </div>

      </div>


      {/* ========================================================
          NAVEGAÇÃO
      ======================================================== */}

      <nav className="flex-1 overflow-y-auto px-4 py-7">

        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">

          Principal

        </p>


        <div className="space-y-1">

          {menu.map((item) => {

            const Icon =
              item.icon;


            const ativo =
              paginaAtual === item.id;


            return (

              <button
                key={item.id}
                type="button"
                onClick={() =>
                  onNavigate(item.id)
                }
                className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                  ativo
                    ? "bg-blue-500/10 text-white"
                    : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200"
                }`}
              >

                {/* INDICADOR ATIVO */}

                {ativo && (

                  <span className="absolute left-0 h-6 w-0.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />

                )}


                {/* ÍCONE */}

                <Icon
                  className={`h-[18px] w-[18px] shrink-0 transition-colors ${
                    ativo
                      ? "text-blue-400"
                      : "text-zinc-600 group-hover:text-zinc-400"
                  }`}
                  strokeWidth={1.8}
                />


                {/* TEXTO */}

                <span>
                  {item.label}
                </span>

              </button>

            );

          })}

        </div>

      </nav>


      {/* ========================================================
          RODAPÉ
      ======================================================== */}

      <div className="border-t border-white/5 p-4">

        {/* ======================================================
            CONFIGURAÇÕES
        ====================================================== */}

        <button
          type="button"
          onClick={() =>
            onNavigate("configuracoes")
          }
          className={`group relative mb-3 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
            paginaAtual === "configuracoes"
              ? "bg-blue-500/10 text-white"
              : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200"
          }`}
        >

          {/* INDICADOR */}

          {paginaAtual ===
            "configuracoes" && (

            <span className="absolute left-0 h-6 w-0.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />

          )}


          {/* ÍCONE */}

          <Settings
            className={`h-[18px] w-[18px] shrink-0 ${
              paginaAtual ===
              "configuracoes"
                ? "text-blue-400"
                : "text-zinc-600 group-hover:text-zinc-400"
            }`}
            strokeWidth={1.8}
          />


          {/* TEXTO */}

          <span>
            Configurações
          </span>

        </button>


        {/* ======================================================
            PERFIL DO USUÁRIO
        ====================================================== */}

        <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-3">

          <div className="flex items-center gap-3">

            {/* ==================================================
                AVATAR
            ================================================== */}

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-sm font-semibold text-blue-400 ring-1 ring-blue-500/20">

              {carregandoUsuario
                ? "..."
                : usuario
                  ? inicial
                  : "?"}

            </div>


            {/* ==================================================
                USUÁRIO
            ================================================== */}

            <div className="min-w-0 flex-1">

              <p className="truncate text-sm font-semibold text-zinc-200">

                {carregandoUsuario
                  ? "Carregando..."
                  : usuario
                    ? primeiroNome
                    : "Usuário"}

              </p>


              <p className="mt-0.5 truncate text-[11px] text-zinc-600">

                {carregandoUsuario
                  ? "..."
                  : tipoUsuario}

              </p>

            </div>


            {/* ==================================================
                STATUS
            ================================================== */}

            <span
              className={`h-2 w-2 shrink-0 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.7)] ${
                usuario
                  ? "bg-emerald-500"
                  : "bg-zinc-600"
              }`}
            />

          </div>

        </div>


        {/* ======================================================
            VERSÃO
        ====================================================== */}

        <p className="mt-4 text-center text-[9px] font-medium uppercase tracking-[0.15em] text-zinc-700">

          {nomeEmpresa ||
            "Sistema"}{" "}
          · Imobiliária Meta · v1.0.0

        </p>

      </div>

    </aside>

  );

}