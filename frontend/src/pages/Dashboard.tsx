import { useEffect, useState } from "react";

import api from "../api/api";

interface Resumo {
  total_apartamentos: number;
  apartamentos_disponiveis: number;
  apartamentos_reservados: number;
  apartamentos_ocupados: number;
  apartamentos_manutencao: number;
  total_relatorios: number;
  receita_bruta_total: number | string;
  custos_total: number | string;
  receita_liquida_total: number | string;
}

interface Financeiro {
  total_apartamentos: number;
  receita_bruta: number | string;
  custos: number | string;
  receita_liquida: number | string;
}

interface Ocupacao {
  total_apartamentos: number;
  ocupacao_media: number | string | null;
}

interface Rentabilidade {
  total_apartamentos: number;
  rentabilidade_media: number | string | null;
}

interface DashboardData {
  resumo: Resumo;
  financeiro: Financeiro;
  ocupacao: Ocupacao;
  rentabilidade: Rentabilidade;
}

function Dashboard() {
  const [dados, setDados] =
    useState<DashboardData | null>(null);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] =
    useState("");

  useEffect(() => {
    async function carregarDashboard() {
      try {
        setCarregando(true);
        setErro("");

        const [
          resumoResponse,
          financeiroResponse,
          ocupacaoResponse,
          rentabilidadeResponse,
        ] = await Promise.all([
          api.get("/dashboard/resumo"),
          api.get("/dashboard/financeiro"),
          api.get("/dashboard/ocupacao"),
          api.get("/dashboard/rentabilidade"),
        ]);

        setDados({
          resumo:
            resumoResponse.data.dashboard,

          financeiro:
            financeiroResponse.data.financeiro,

          ocupacao:
            ocupacaoResponse.data.ocupacao,

          rentabilidade:
            rentabilidadeResponse.data.rentabilidade,
        });
      } catch (error) {
        console.error(
          "Erro ao carregar dashboard:",
          error
        );

        setErro(
          "Não foi possível carregar os dados do dashboard."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarDashboard();
  }, []);

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (carregando) {
    return (
      <div className="min-h-full bg-[#080a0f] p-6 text-white lg:p-8">

        <div className="mx-auto max-w-[1600px] space-y-8">

          <div className="space-y-3">
            <div className="h-4 w-24 animate-pulse rounded bg-zinc-800" />

            <div className="h-9 w-52 animate-pulse rounded-lg bg-zinc-800" />

            <div className="h-4 w-80 animate-pulse rounded bg-zinc-900" />
          </div>


          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-40 animate-pulse rounded-2xl border border-zinc-800 bg-[#10131a]"
              />
            ))}

          </div>


          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

            <div className="h-80 animate-pulse rounded-2xl border border-zinc-800 bg-[#10131a] xl:col-span-2" />

            <div className="h-80 animate-pulse rounded-2xl border border-zinc-800 bg-[#10131a]" />

          </div>

        </div>

      </div>
    );
  }


  /*
   * ============================================================
   * ERRO
   * ============================================================
   */

  if (erro) {
    return (
      <div className="min-h-full bg-[#080a0f] p-6 text-white lg:p-8">

        <div className="mx-auto max-w-[1600px]">

          <div className="mb-8">

            <p className="text-sm font-medium text-blue-400">
              Visão geral
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Visão geral do Aurion CRM
            </p>

          </div>


          <div className="rounded-2xl border border-red-900/50 bg-red-950/20 p-6">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-900/50 bg-red-950/40 text-red-400">
                !
              </div>

              <div>

                <p className="font-semibold text-red-400">
                  Não foi possível carregar o dashboard
                </p>

                <p className="mt-1 text-sm text-red-300/70">
                  {erro}
                </p>

                <p className="mt-3 text-xs text-zinc-500">
                  Verifique se o backend está executando.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>
    );
  }


  if (!dados) {
    return null;
  }


  /*
   * ============================================================
   * DADOS
   * ============================================================
   */

  const totalApartamentos =
    Number(
      dados.resumo.total_apartamentos
    ) || 0;

  const totalDisponiveis =
    Number(
      dados.resumo.apartamentos_disponiveis
    ) || 0;

  const totalReservas =
    Number(
      dados.resumo.apartamentos_reservados
    ) || 0;

  const totalOcupados =
    Number(
      dados.resumo.apartamentos_ocupados
    ) || 0;

  const totalManutencao =
    Number(
      dados.resumo.apartamentos_manutencao
    ) || 0;

  const faturamento =
    Number(
      dados.financeiro.receita_bruta
    ) || 0;

  const custos =
    Number(
      dados.financeiro.custos
    ) || 0;

  const receitaLiquida =
    Number(
      dados.financeiro.receita_liquida
    ) || 0;

  const ocupacao =
    Number(
      dados.ocupacao.ocupacao_media
    ) || 0;

  const rentabilidade =
    Number(
      dados.rentabilidade.rentabilidade_media
    ) || 0;


  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div className="min-h-full bg-[#080a0f] p-6 text-white lg:p-8">

      <div className="mx-auto max-w-[1600px] space-y-8">


        {/* ======================================================
            CABEÇALHO
        ====================================================== */}

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>

            <div className="flex items-center gap-2">

              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-400">
                Visão geral
              </p>

            </div>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Acompanhe o desempenho dos seus apartamentos.
            </p>

          </div>


          <div className="flex w-fit items-center gap-2 rounded-full border border-zinc-800 bg-[#10131a] px-3.5 py-2">

            <span className="relative flex h-2 w-2">

              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />

              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />

            </span>

            <span className="text-xs font-medium text-zinc-400">
              API conectada
            </span>

          </div>

        </div>


        {/* ======================================================
            CARDS PRINCIPAIS
        ====================================================== */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

          <CardIndicador
            titulo="Apartamentos"
            valor={String(totalApartamentos)}
            descricao={`${totalDisponiveis} disponíveis`}
            icone="⌂"
            destaque="blue"
          />

          <CardIndicador
            titulo="Reservas"
            valor={String(totalReservas)}
            descricao={`${totalOcupados} atualmente ocupados`}
            icone="✓"
            destaque="violet"
          />

          <CardIndicador
            titulo="Ocupação média"
            valor={formatarPercentual(ocupacao)}
            descricao="Desempenho dos imóveis"
            icone="%"
            destaque="amber"
          />

          <CardIndicador
            titulo="Faturamento"
            valor={formatarMoeda(faturamento)}
            descricao="Receita bruta"
            icone="R$"
            destaque="emerald"
          />

        </div>


        {/* ======================================================
            FINANCEIRO + INDICADORES
        ====================================================== */}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">


          {/* ====================================================
              FINANCEIRO
          ==================================================== */}

          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#10131a] xl:col-span-2">

            <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-5">

              <div>

                <h2 className="font-semibold text-white">
                  Desempenho financeiro
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Resumo financeiro dos apartamentos.
                </p>

              </div>


              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-xs font-bold text-zinc-400">
                R$
              </div>

            </div>


            <div className="grid grid-cols-1 gap-px bg-zinc-800 sm:grid-cols-3">

              <MetricFinanceira
                titulo="Receita bruta"
                valor={formatarMoeda(faturamento)}
                destaque
              />

              <MetricFinanceira
                titulo="Custos"
                valor={formatarMoeda(custos)}
              />

              <MetricFinanceira
                titulo="Receita líquida"
                valor={formatarMoeda(receitaLiquida)}
              />

            </div>


            <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">

              <IndicadorFinanceiro
                titulo="Rentabilidade média"
                valor={formatarPercentual(rentabilidade)}
                descricao="Retorno médio dos imóveis"
              />

              <IndicadorFinanceiro
                titulo="Ocupação média"
                valor={formatarPercentual(ocupacao)}
                descricao="Taxa média de ocupação"
              />

            </div>

          </div>


          {/* ====================================================
              INDICADORES
          ==================================================== */}

          <div className="rounded-2xl border border-zinc-800 bg-[#10131a]">

            <div className="border-b border-zinc-800 px-6 py-5">

              <h2 className="font-semibold text-white">
                Indicadores
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Visão operacional
              </p>

            </div>


            <div className="space-y-7 p-6">

              <BarraProgresso
                titulo="Ocupação"
                valor={ocupacao}
                descricao="Apartamentos ocupados"
              />

              <BarraProgresso
                titulo="Rentabilidade"
                valor={rentabilidade}
                descricao="Retorno médio"
              />

              <BarraProgresso
                titulo="Reservas"
                valor={
                  totalApartamentos > 0
                    ? Math.min(
                        (
                          totalReservas /
                          totalApartamentos
                        ) * 100,
                        100
                      )
                    : 0
                }
                descricao="Imóveis reservados"
              />

            </div>

          </div>

        </div>


        {/* ======================================================
            STATUS DOS APARTAMENTOS
        ====================================================== */}

        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#10131a]">

          <div className="border-b border-zinc-800 px-6 py-5">

            <h2 className="font-semibold text-white">
              Status dos apartamentos
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Distribuição atual dos imóveis cadastrados.
            </p>

          </div>


          <div className="grid grid-cols-2 divide-x divide-zinc-800 sm:grid-cols-4">

            <StatusApartamento
              titulo="Disponíveis"
              valor={totalDisponiveis}
              percentual={
                totalApartamentos > 0
                  ? (
                      totalDisponiveis /
                      totalApartamentos
                    ) * 100
                  : 0
              }
              tipo="blue"
            />

            <StatusApartamento
              titulo="Reservados"
              valor={totalReservas}
              percentual={
                totalApartamentos > 0
                  ? (
                      totalReservas /
                      totalApartamentos
                    ) * 100
                  : 0
              }
              tipo="violet"
            />

            <StatusApartamento
              titulo="Ocupados"
              valor={totalOcupados}
              percentual={
                totalApartamentos > 0
                  ? (
                      totalOcupados /
                      totalApartamentos
                    ) * 100
                  : 0
              }
              tipo="emerald"
            />

            <StatusApartamento
              titulo="Manutenção"
              valor={totalManutencao}
              percentual={
                totalApartamentos > 0
                  ? (
                      totalManutencao /
                      totalApartamentos
                    ) * 100
                  : 0
              }
              tipo="amber"
            />

          </div>

        </div>


        {/* ======================================================
            RODAPÉ
        ====================================================== */}

        <div className="flex flex-col justify-between gap-2 border-t border-zinc-900 pt-5 text-xs text-zinc-600 sm:flex-row">

          <span>
            Stay Metrics IA - Sistema de gestão de apartamentos
          </span>

          <span>
            Dados atualizados diretamente pela API
          </span>

        </div>

      </div>

    </div>
  );
}


/* =================================================================
   CARD INDICADOR
================================================================= */

interface CardIndicadorProps {
  titulo: string;
  valor: string;
  descricao: string;
  icone: string;
  destaque: "blue" | "violet" | "amber" | "emerald";
}

function CardIndicador({
  titulo,
  valor,
  descricao,
  icone,
  destaque,
}: CardIndicadorProps) {

  const estilos = {

    blue: {
      fundo:
        "bg-blue-500/10 border-blue-500/10",
      texto:
        "text-blue-400",
      brilho:
        "group-hover:border-blue-500/30",
    },

    violet: {
      fundo:
        "bg-violet-500/10 border-violet-500/10",
      texto:
        "text-violet-400",
      brilho:
        "group-hover:border-violet-500/30",
    },

    amber: {
      fundo:
        "bg-amber-500/10 border-amber-500/10",
      texto:
        "text-amber-400",
      brilho:
        "group-hover:border-amber-500/30",
    },

    emerald: {
      fundo:
        "bg-emerald-500/10 border-emerald-500/10",
      texto:
        "text-emerald-400",
      brilho:
        "group-hover:border-emerald-500/30",
    },

  };

  const estilo =
    estilos[destaque];

  return (
    <div
      className={`
        group
        rounded-2xl
        border
        border-zinc-800
        bg-[#10131a]
        p-6
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:bg-[#12161e]
        ${estilo.brilho}
      `}
    >

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-zinc-500">
            {titulo}
          </p>

          <p className="mt-3 text-3xl font-bold tracking-tight text-white">
            {valor}
          </p>

        </div>


        <div
          className={`
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            border
            text-xs
            font-bold
            ${estilo.fundo}
            ${estilo.texto}
          `}
        >
          {icone}
        </div>

      </div>


      <p className="mt-5 text-xs text-zinc-600">
        {descricao}
      </p>

    </div>
  );
}


/* =================================================================
   MÉTRICA FINANCEIRA
================================================================= */

interface MetricFinanceiraProps {
  titulo: string;
  valor: string;
  destaque?: boolean;
}

function MetricFinanceira({
  titulo,
  valor,
  destaque = false,
}: MetricFinanceiraProps) {

  return (
    <div className="bg-[#10131a] p-5">

      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-600">
        {titulo}
      </p>

      <p
        className={`
          mt-2
          text-xl
          font-bold
          tracking-tight
          ${
            destaque
              ? "text-blue-400"
              : "text-white"
          }
        `}
      >
        {valor}
      </p>

    </div>
  );
}


/* =================================================================
   INDICADOR FINANCEIRO
================================================================= */

interface IndicadorFinanceiroProps {
  titulo: string;
  valor: string;
  descricao: string;
}

function IndicadorFinanceiro({
  titulo,
  valor,
  descricao,
}: IndicadorFinanceiroProps) {

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">

      <p className="text-sm font-medium text-zinc-400">
        {titulo}
      </p>

      <p className="mt-2 text-2xl font-bold tracking-tight text-white">
        {valor}
      </p>

      <p className="mt-1 text-xs text-zinc-600">
        {descricao}
      </p>

    </div>
  );
}


/* =================================================================
   BARRA DE PROGRESSO
================================================================= */

interface BarraProgressoProps {
  titulo: string;
  valor: number;
  descricao: string;
}

function BarraProgresso({
  titulo,
  valor,
  descricao,
}: BarraProgressoProps) {

  const percentual = Math.max(
    0,
    Math.min(
      Number(valor) || 0,
      100
    )
  );

  return (
    <div>

      <div className="flex items-end justify-between gap-4">

        <div>

          <p className="text-sm font-medium text-zinc-300">
            {titulo}
          </p>

          <p className="mt-0.5 text-xs text-zinc-600">
            {descricao}
          </p>

        </div>


        <span className="text-sm font-bold text-white">
          {percentual.toFixed(1)}%
        </span>

      </div>


      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-800">

        <div
          className="h-full rounded-full bg-blue-500 transition-all duration-700"
          style={{
            width: `${percentual}%`,
          }}
        />

      </div>

    </div>
  );
}


/* =================================================================
   STATUS DOS APARTAMENTOS
================================================================= */

interface StatusApartamentoProps {
  titulo: string;
  valor: number;
  percentual: number;
  tipo:
    | "blue"
    | "violet"
    | "emerald"
    | "amber";
}

function StatusApartamento({
  titulo,
  valor,
  percentual,
  tipo,
}: StatusApartamentoProps) {

  const estilos = {

    blue:
      "bg-blue-500/10 text-blue-400 border-blue-500/10",

    violet:
      "bg-violet-500/10 text-violet-400 border-violet-500/10",

    emerald:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/10",

    amber:
      "bg-amber-500/10 text-amber-400 border-amber-500/10",

  };

  return (
    <div className="p-5 transition-colors hover:bg-zinc-900/40 sm:p-6">

      <div className="flex items-center gap-3">

        <div
          className={`
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            border
            text-xs
            font-bold
            ${estilos[tipo]}
          `}
        >
          {valor}
        </div>


        <div>

          <p className="text-sm font-medium text-zinc-300">
            {titulo}
          </p>

          <p className="mt-0.5 text-xs text-zinc-600">
            {percentual.toFixed(1)}% do total
          </p>

        </div>

      </div>

    </div>
  );
}


/* =================================================================
   FORMATADORES
================================================================= */

function formatarMoeda(
  valor: number
): string {

  return Number(
    valor || 0
  ).toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    }
  );
}


function formatarPercentual(
  valor: number
): string {

  return `${Number(
    valor || 0
  ).toFixed(1)}%`;
}


export default Dashboard;