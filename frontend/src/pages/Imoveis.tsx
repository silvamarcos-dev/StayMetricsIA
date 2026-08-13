import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import {
  Building2,
  Plus,
  X,
  Home,
  Search,
  CheckCircle2,
  Clock3,
  Wrench,
  CircleDot,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  criarApartamento,
  listarApartamentos,
} from "../services/apartamentoService";

import type {
  Apartamento,
  ApartamentoCreate,
  StatusApartamento,
} from "../types/apartamento";

const statusLabels: Record<StatusApartamento, string> = {
  DISPONIVEL: "Disponível",
  RESERVADO: "Reservado",
  OCUPADO: "Ocupado",
  MANUTENCAO: "Manutenção",
};

const statusClasses: Record<StatusApartamento, string> = {
  DISPONIVEL:
    "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20",

  RESERVADO:
    "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20",

  OCUPADO:
    "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20",

  MANUTENCAO:
    "bg-red-500/10 text-red-400 ring-1 ring-red-500/20",
};

const statusIcons: Record<
  StatusApartamento,
  typeof CheckCircle2
> = {
  DISPONIVEL: CheckCircle2,
  RESERVADO: Clock3,
  OCUPADO: CircleDot,
  MANUTENCAO: Wrench,
};

function Imoveis() {
  const [apartamentos, setApartamentos] =
    useState<Apartamento[]>([]);

  const [numero, setNumero] = useState("");
  const [bloco, setBloco] = useState("");

  const [status, setStatus] =
    useState<StatusApartamento>("DISPONIVEL");

  const [carregando, setCarregando] =
    useState(true);

  const [salvando, setSalvando] =
    useState(false);

  const [erro, setErro] =
    useState<string | null>(null);

  const [modalAberto, setModalAberto] =
    useState(false);

  const [busca, setBusca] =
    useState("");

  // ============================================================
  // PAGINAÇÃO
  // ============================================================

  const [paginaAtual, setPaginaAtual] =
    useState(1);

  const itensPorPagina = 10;

  // ============================================================
  // CARREGAR APARTAMENTOS
  // ============================================================

  useEffect(() => {
    let ativo = true;

    async function buscarApartamentos() {
      try {
        const dados =
          await listarApartamentos();

        if (ativo) {
          setApartamentos(dados);
        }
      } catch (error) {
        console.error(error);

        if (ativo) {
          setErro(
            "Não foi possível carregar os apartamentos."
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    void buscarApartamentos();

    return () => {
      ativo = false;
    };
  }, []);

  // ============================================================
  // CRIAR APARTAMENTO
  // ============================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!numero.trim()) {
      setErro(
        "Informe o número do apartamento."
      );

      return;
    }

    const dados: ApartamentoCreate = {
      numero: numero.trim(),
      bloco: bloco.trim() || null,
      status,
    };

    try {
      setSalvando(true);
      setErro(null);

      const novoApartamento =
        await criarApartamento(dados);

      setApartamentos((atual) => [
        ...atual,
        novoApartamento,
      ]);

      setNumero("");
      setBloco("");
      setStatus("DISPONIVEL");

      setModalAberto(false);

      // Vai para a última página para mostrar
      // imediatamente o apartamento recém-criado.
      const novaQuantidade =
        apartamentos.length + 1;

      setPaginaAtual(
        Math.ceil(
          novaQuantidade / itensPorPagina
        )
      );
    } catch (error) {
      console.error(error);

      setErro(
        "Não foi possível criar o apartamento."
      );
    } finally {
      setSalvando(false);
    }
  }

  // ============================================================
  // FILTRO
  // ============================================================

  const apartamentosFiltrados =
    apartamentos.filter((apartamento) => {
      const termo =
        busca.toLowerCase().trim();

      if (!termo) {
        return true;
      }

      return (
        apartamento.numero
          .toLowerCase()
          .includes(termo) ||
        apartamento.bloco
          ?.toLowerCase()
          .includes(termo)
      );
    });

  // ============================================================
  // PAGINAÇÃO DOS RESULTADOS
  // ============================================================

  const totalPaginas = Math.max(
    1,
    Math.ceil(
      apartamentosFiltrados.length /
        itensPorPagina
    )
  );

  // Garante que a página atual nunca fique
  // maior que o número de páginas existentes.
  const paginaSegura = Math.min(
    paginaAtual,
    totalPaginas
  );

  const indiceInicial =
    (paginaSegura - 1) *
    itensPorPagina;

  const indiceFinal =
    indiceInicial + itensPorPagina;

  const apartamentosPaginados =
    apartamentosFiltrados.slice(
      indiceInicial,
      indiceFinal
    );

  // ============================================================
  // MÉTRICAS
  // ============================================================

  const totalDisponiveis =
    apartamentos.filter(
      (apartamento) =>
        apartamento.status ===
        "DISPONIVEL"
    ).length;

  const totalReservados =
    apartamentos.filter(
      (apartamento) =>
        apartamento.status ===
        "RESERVADO"
    ).length;

  const totalOcupados =
    apartamentos.filter(
      (apartamento) =>
        apartamento.status ===
        "OCUPADO"
    ).length;

  const totalManutencao =
    apartamentos.filter(
      (apartamento) =>
        apartamento.status ===
        "MANUTENCAO"
    ).length;

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-full space-y-6 text-slate-100">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
            <Building2 className="h-5 w-5" />
          </div>

          <div>

            <h1 className="text-xl font-bold tracking-tight text-white">
              Apartamentos
            </h1>

            <p className="mt-0.5 text-sm text-slate-400">
              Gerencie os apartamentos do empreendimento.
            </p>

          </div>

        </div>

        <button
          type="button"
          onClick={() => {
            setErro(null);
            setModalAberto(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500"
        >
          <Plus className="h-4 w-4" />

          Novo apartamento
        </button>

      </div>

      {/* ======================================================
          MÉTRICAS
      ====================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <MetricCard
          label="Total"
          value={apartamentos.length}
          icon={
            <Home className="h-5 w-5" />
          }
          iconClass="bg-slate-800 text-slate-300"
        />

        <MetricCard
          label="Disponíveis"
          value={totalDisponiveis}
          icon={
            <CheckCircle2 className="h-5 w-5" />
          }
          iconClass="bg-emerald-500/10 text-emerald-400"
          valueClass="text-emerald-400"
        />

        <MetricCard
          label="Reservados"
          value={totalReservados}
          icon={
            <Clock3 className="h-5 w-5" />
          }
          iconClass="bg-amber-500/10 text-amber-400"
          valueClass="text-amber-400"
        />

        <MetricCard
          label="Ocupados"
          value={totalOcupados}
          icon={
            <CircleDot className="h-5 w-5" />
          }
          iconClass="bg-blue-500/10 text-blue-400"
          valueClass="text-blue-400"
        />

      </div>

      {/* ======================================================
          ALERTA DE ERRO
      ====================================================== */}

      {erro && !modalAberto && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">

          <p className="text-sm text-red-400">
            {erro}
          </p>

          <button
            type="button"
            onClick={() => {
              setErro(null);
              window.location.reload();
            }}
            className="rounded-lg border border-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/10"
          >
            Tentar novamente
          </button>

        </div>
      )}

      {/* ======================================================
          LISTAGEM
      ====================================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 shadow-2xl shadow-black/10">

        {/* HEADER DA TABELA */}

        <div className="flex flex-col gap-4 border-b border-slate-800 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <h2 className="text-sm font-semibold text-white">
              Lista de apartamentos
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {apartamentos.length} apartamento(s)
              cadastrado(s)
            </p>

          </div>

          {/* BUSCA */}

          <div className="relative w-full lg:w-72">

            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

            <input
              type="text"
              value={busca}
              onChange={(event) => {
                setBusca(event.target.value);
                setPaginaAtual(1);
              }}
              placeholder="Buscar apartamento..."
              className="h-10 w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
            />

          </div>

        </div>

        {/* ====================================================
            LOADING
        ==================================================== */}

        {carregando ? (

          <div className="flex min-h-[360px] flex-col items-center justify-center">

            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />

            <p className="mt-4 text-sm text-slate-500">
              Carregando apartamentos...
            </p>

          </div>

        ) : apartamentosFiltrados.length ===
          0 ? (

          /* ==================================================
             EMPTY STATE
          ================================================== */

          <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950">

              <Building2 className="h-6 w-6 text-slate-600" />

            </div>

            <h3 className="mt-4 text-sm font-semibold text-white">
              Nenhum apartamento encontrado
            </h3>

            <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-500">
              {busca
                ? "Nenhum apartamento corresponde à sua busca."
                : "Cadastre um novo apartamento para começar a gerenciar o empreendimento."}
            </p>

            {!busca && (
              <button
                type="button"
                onClick={() => {
                  setErro(null);
                  setModalAberto(true);
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-blue-500"
              >
                <Plus className="h-3.5 w-3.5" />
                Novo apartamento
              </button>
            )}

          </div>

        ) : (

          /* ==================================================
             TABELA
          ================================================== */

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="border-b border-slate-800 bg-slate-950/50">

                <tr>

                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Apartamento
                  </th>

                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Bloco
                  </th>

                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    ID
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-800/70">

                {apartamentosPaginados.map(
                  (apartamento) => {

                    const StatusIcon =
                      statusIcons[
                        apartamento.status
                      ];

                    return (
                      <tr
                        key={
                          apartamento.id
                        }
                        className="group transition hover:bg-slate-800/40"
                      >

                        {/* APARTAMENTO */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-950 text-blue-400">

                              <Building2 className="h-4 w-4" />

                            </div>

                            <div>

                              <p className="text-sm font-semibold text-slate-200">
                                {apartamento.numero}
                              </p>

                              <p className="mt-0.5 text-[11px] text-slate-600">
                                Unidade residencial
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* BLOCO */}

                        <td className="px-5 py-4">

                          <span className="text-sm text-slate-400">
                            {apartamento.bloco ??
                              "-"}
                          </span>

                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClasses[apartamento.status]}`}
                          >

                            <StatusIcon className="h-3 w-3" />

                            {
                              statusLabels[
                                apartamento
                                  .status
                              ]
                            }

                          </span>

                        </td>

                        {/* ID */}

                        <td className="px-5 py-4">

                          <span className="font-mono text-[11px] text-slate-600">
                            #{apartamento.id}
                          </span>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

            {/* ==================================================
                PAGINAÇÃO
            ================================================== */}

            {apartamentosFiltrados.length >
              itensPorPagina && (

              <div className="flex flex-col gap-4 border-t border-slate-800 bg-slate-950/30 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                {/* CONTADOR */}

                <p className="text-xs text-slate-500">

                  Mostrando{" "}

                  <span className="font-semibold text-slate-300">
                    {indiceInicial + 1}
                  </span>

                  {"–"}

                  <span className="font-semibold text-slate-300">
                    {Math.min(
                      indiceFinal,
                      apartamentosFiltrados.length
                    )}
                  </span>

                  {" de "}

                  <span className="font-semibold text-slate-300">
                    {apartamentosFiltrados.length}
                  </span>

                  {" apartamentos"}

                </p>

                {/* CONTROLES */}

                <div className="flex items-center gap-2">

                  {/* ANTERIOR */}

                  <button
                    type="button"
                    disabled={
                      paginaSegura === 1
                    }
                    onClick={() =>
                      setPaginaAtual(
                        (pagina) =>
                          Math.max(
                            1,
                            pagina - 1
                          )
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-400 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >

                    <ChevronLeft className="h-3.5 w-3.5" />

                    Anterior

                  </button>

                  {/* NÚMEROS DAS PÁGINAS */}

                  <div className="flex items-center gap-1">

                    {Array.from(
                      {
                        length:
                          totalPaginas,
                      },
                      (_, index) =>
                        index + 1
                    ).map(
                      (pagina) => (

                        <button
                          key={pagina}
                          type="button"
                          onClick={() =>
                            setPaginaAtual(
                              pagina
                            )
                          }
                          className={`h-9 min-w-9 rounded-lg px-3 text-xs font-semibold transition ${
                            paginaSegura ===
                            pagina
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30"
                              : "border border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:bg-slate-800 hover:text-white"
                          }`}
                        >
                          {pagina}
                        </button>

                      )
                    )}

                  </div>

                  {/* PRÓXIMA */}

                  <button
                    type="button"
                    disabled={
                      paginaSegura ===
                      totalPaginas
                    }
                    onClick={() =>
                      setPaginaAtual(
                        (pagina) =>
                          Math.min(
                            totalPaginas,
                            pagina + 1
                          )
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-400 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >

                    Próxima

                    <ChevronRight className="h-3.5 w-3.5" />

                  </button>

                </div>

              </div>

            )}

          </div>
        )}

      </div>

      {/* ======================================================
          RESUMO INFERIOR
      ====================================================== */}

      {!carregando &&
        apartamentos.length > 0 && (
          <div className="flex flex-col gap-2 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">

            <span>

              Mostrando{" "}

              <strong className="font-semibold text-slate-400">
                {apartamentosFiltrados.length ===
                0
                  ? 0
                  : indiceInicial + 1}
              </strong>

              {"–"}

              <strong className="font-semibold text-slate-400">
                {Math.min(
                  indiceFinal,
                  apartamentosFiltrados.length
                )}
              </strong>

              {" de "}

              <strong className="font-semibold text-slate-400">
                {apartamentosFiltrados.length}
              </strong>

              {" apartamentos"}

            </span>

            <span>
              {totalManutencao} em manutenção
            </span>

          </div>
        )}

      {/* ======================================================
          MODAL
      ====================================================== */}

      {modalAberto && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {

            if (
              event.target ===
                event.currentTarget &&
              !salvando
            ) {
              setModalAberto(false);
            }

          }}
        >

          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/40">

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">

              <div>

                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">

                    <Building2 className="h-4 w-4" />

                  </div>

                  <h2 className="text-base font-bold text-white">
                    Novo apartamento
                  </h2>

                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Cadastre uma nova unidade no empreendimento.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setModalAberto(false)
                }
                disabled={salvando}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-slate-300 disabled:opacity-50"
              >

                <X className="h-5 w-5" />

              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >

              {erro && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                  {erro}
                </div>
              )}

              {/* NÚMERO */}

              <div>

                <label
                  htmlFor="numero"
                  className="mb-2 block text-xs font-semibold text-slate-300"
                >
                  Número
                </label>

                <input
                  id="numero"
                  type="text"
                  value={numero}
                  onChange={(event) =>
                    setNumero(
                      event.target.value
                    )
                  }
                  placeholder="Ex.: 101"
                  autoFocus
                  disabled={salvando}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                />

              </div>

              {/* BLOCO */}

              <div>

                <label
                  htmlFor="bloco"
                  className="mb-2 block text-xs font-semibold text-slate-300"
                >
                  Bloco
                </label>

                <input
                  id="bloco"
                  type="text"
                  value={bloco}
                  onChange={(event) =>
                    setBloco(
                      event.target.value
                    )
                  }
                  placeholder="Ex.: A"
                  disabled={salvando}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                />

              </div>

              {/* STATUS */}

              <div>

                <label
                  htmlFor="status"
                  className="mb-2 block text-xs font-semibold text-slate-300"
                >
                  Status inicial
                </label>

                <select
                  id="status"
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target
                        .value as StatusApartamento
                    )
                  }
                  disabled={salvando}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  <option value="DISPONIVEL">
                    Disponível
                  </option>

                  <option value="RESERVADO">
                    Reservado
                  </option>

                  <option value="OCUPADO">
                    Ocupado
                  </option>

                  <option value="MANUTENCAO">
                    Manutenção
                  </option>

                </select>

              </div>

              {/* FOOTER */}

              <div className="flex justify-end gap-3 border-t border-slate-800 pt-5">

                <button
                  type="button"
                  onClick={() =>
                    setModalAberto(false)
                  }
                  disabled={salvando}
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-400 transition hover:bg-slate-800 hover:text-slate-200 disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={salvando}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  <Plus className="h-4 w-4" />

                  {salvando
                    ? "Salvando..."
                    : "Cadastrar apartamento"}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

// ============================================================
// COMPONENTE DE MÉTRICA
// ============================================================

interface MetricCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconClass: string;
  valueClass?: string;
}

function MetricCard({
  label,
  value,
  icon,
  iconClass,
  valueClass = "text-white",
}: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/5 transition hover:border-slate-700">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs font-medium text-slate-500">
            {label}
          </p>

          <p
            className={`mt-2 text-3xl font-bold tracking-tight ${valueClass}`}
          >
            {value}
          </p>

        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

export default Imoveis;