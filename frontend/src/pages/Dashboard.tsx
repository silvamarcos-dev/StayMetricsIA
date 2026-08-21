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
      <div className="min-h-full bg-[#F5F6FA] p-6 lg:p-8">

        <div className="mx-auto max-w-[1600px] space-y-8">

          <div className="space-y-3">
            <div className="h-4 w-24 animate-pulse rounded bg-zinc-200" />

            <div className="h-9 w-52 animate-pulse rounded-lg bg-zinc-200" />

            <div className="h-4 w-80 animate-pulse rounded bg-zinc-200/70" />
          </div>


          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-full bg-zinc-200"
              />
            ))}

          </div>


          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

            <div className="h-80 animate-pulse rounded-3xl bg-white shadow-sm xl:col-span-2" />

            <div className="h-80 animate-pulse rounded-3xl bg-white shadow-sm" />

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
      <div className="min-h-full bg-[#F5F6FA] p-6 lg:p-8">

        <div className="mx-auto max-w-[1600px]">

          <div className="mb-8">

            <p className="text-sm font-semibold text-violet-500">
              Visão geral
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#1F2233]">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Visão geral do Aurion CRM
            </p>

          </div>


          <div className="rounded-3xl border border-red-100 bg-red-50 p-6 shadow-sm">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-500">
                !
              </div>

              <div>

                <p className="font-semibold text-red-500">
                  Não foi possível carregar o dashboard
                </p>

                <p className="mt-1 text-sm text-red-400">
                  {erro}
                </p>

                <p className="mt-3 text-xs text-zinc-400">
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

  const maiorBarraFinanceira =
    Math.max(faturamento, custos, receitaLiquida, 1);


  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div className="min-h-full bg-[#F5F6FA] p-6 lg:p-8">

      <div className="mx-auto max-w-[1600px] space-y-8">


        {/* ======================================================
            CABEÇALHO
        ====================================================== */}

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>

            <div className="flex items-center gap-2">

              <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-500">
                Visão geral
              </p>

            </div>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#1F2233]">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Acompanhe o desempenho dos seus apartamentos.
            </p>

          </div>


          <div className="flex w-fit items-center gap-2 rounded-full border border-zinc-200 bg-white px-3.5 py-2 shadow-sm">

            <span className="relative flex h-2 w-2">

              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />

              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />

            </span>

            <span className="text-xs font-medium text-zinc-500">
              API conectada
            </span>

          </div>

        </div>


        {/* ======================================================
            PÍLULAS DE INDICADORES
        ====================================================== */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <PilulaIndicador
            titulo="Apartamentos"
            valor={String(totalApartamentos)}
            descricao={`${totalDisponiveis} disponíveis`}
            icone="⌂"
            cor="violet"
          />

          <PilulaIndicador
            titulo="Reservas"
            valor={String(totalReservas)}
            descricao={`${totalOcupados} ocupados`}
            icone="✓"
            cor="orange"
          />

          <PilulaIndicador
            titulo="Ocupação"
            valor={formatarPercentual(ocupacao)}
            descricao="Média dos imóveis"
            icone="%"
            cor="blue"
          />

          <PilulaIndicador
            titulo="Faturamento"
            valor={formatarMoeda(faturamento)}
            descricao="Receita bruta"
            icone="R$"
            cor="emerald"
          />

        </div>


        {/* ======================================================
            FINANCEIRO + DISTRIBUIÇÃO
        ====================================================== */}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">


          {/* ====================================================
              FINANCEIRO
          ==================================================== */}

          <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm xl:col-span-2">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="font-semibold text-[#1F2233]">
                  Desempenho financeiro
                </h2>

                <p className="mt-1 text-sm text-zinc-400">
                  Resumo financeiro dos apartamentos
                </p>

              </div>

              <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-500">
                Este período
              </span>

            </div>


            {/* Barras comparativas */}
            <div className="mt-7 grid grid-cols-3 gap-5">

              <BarraFinanceira
                titulo="Receita bruta"
                valor={faturamento}
                maximo={maiorBarraFinanceira}
                cor="bg-violet-500"
                textoValor={formatarMoeda(faturamento)}
              />

              <BarraFinanceira
                titulo="Custos"
                valor={custos}
                maximo={maiorBarraFinanceira}
                cor="bg-orange-400"
                textoValor={formatarMoeda(custos)}
              />

              <BarraFinanceira
                titulo="Receita líquida"
                valor={receitaLiquida}
                maximo={maiorBarraFinanceira}
                cor="bg-emerald-500"
                textoValor={formatarMoeda(receitaLiquida)}
              />

            </div>


            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">

              <MiniIndicador
                titulo="Rentabilidade média"
                valor={rentabilidade}
                cor="#8B5CF6"
                descricao="Retorno médio dos imóveis"
              />

              <MiniIndicador
                titulo="Ocupação média"
                valor={ocupacao}
                cor="#3B82F6"
                descricao="Taxa média de ocupação"
              />

            </div>

          </div>


          {/* ====================================================
              DISTRIBUIÇÃO DE STATUS (donut)
          ==================================================== */}

          <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm">

            <h2 className="font-semibold text-[#1F2233]">
              Status dos imóveis
            </h2>

            <p className="mt-1 text-sm text-zinc-400">
              Distribuição atual
            </p>


            <div className="mt-6 flex justify-center">

              <Donut
                tamanho={168}
                espessura={18}
                total={totalApartamentos}
                segmentos={[
                  { valor: totalDisponiveis, cor: "#3B82F6" },
                  { valor: totalReservas, cor: "#8B5CF6" },
                  { valor: totalOcupados, cor: "#10B981" },
                  { valor: totalManutencao, cor: "#F59E0B" },
                ]}
                centro={
                  <>
                    <span className="text-2xl font-bold text-[#1F2233]">
                      {totalApartamentos}
                    </span>
                    <span className="text-xs text-zinc-400">
                      imóveis
                    </span>
                  </>
                }
              />

            </div>


            <div className="mt-6 space-y-3">

              <LegendaStatus
                cor="#3B82F6"
                titulo="Disponíveis"
                valor={totalDisponiveis}
                total={totalApartamentos}
              />

              <LegendaStatus
                cor="#8B5CF6"
                titulo="Reservados"
                valor={totalReservas}
                total={totalApartamentos}
              />

              <LegendaStatus
                cor="#10B981"
                titulo="Ocupados"
                valor={totalOcupados}
                total={totalApartamentos}
              />

              <LegendaStatus
                cor="#F59E0B"
                titulo="Manutenção"
                valor={totalManutencao}
                total={totalApartamentos}
              />

            </div>

          </div>

        </div>


        {/* ======================================================
            CARTÕES DE PROGRESSO POR STATUS
        ====================================================== */}

        <div>

          <div className="mb-4 flex items-center justify-between">

            <div>
              <h2 className="font-semibold text-[#1F2233]">
                Status dos apartamentos
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                Distribuição atual dos imóveis cadastrados
              </p>
            </div>

          </div>


          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <CartaoProgresso
              titulo="Disponíveis"
              valor={totalDisponiveis}
              total={totalApartamentos}
              cor="blue"
            />

            <CartaoProgresso
              titulo="Reservados"
              valor={totalReservas}
              total={totalApartamentos}
              cor="violet"
            />

            <CartaoProgresso
              titulo="Ocupados"
              valor={totalOcupados}
              total={totalApartamentos}
              cor="emerald"
            />

            <CartaoProgresso
              titulo="Manutenção"
              valor={totalManutencao}
              total={totalApartamentos}
              cor="amber"
            />

          </div>

        </div>


        {/* ======================================================
            RODAPÉ
        ====================================================== */}

        <div className="flex flex-col justify-between gap-2 border-t border-zinc-200 pt-5 text-xs text-zinc-400 sm:flex-row">

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
   PÍLULA DE INDICADOR
================================================================= */

interface PilulaIndicadorProps {
  titulo: string;
  valor: string;
  descricao: string;
  icone: string;
  cor: "violet" | "orange" | "blue" | "emerald";
}

function PilulaIndicador({
  titulo,
  valor,
  descricao,
  icone,
  cor,
}: PilulaIndicadorProps) {

  const estilos = {

    violet: {
      fundo: "bg-violet-500",
      icone: "bg-white/20 text-white",
    },

    orange: {
      fundo: "bg-orange-400",
      icone: "bg-white/20 text-white",
    },

    blue: {
      fundo: "bg-blue-500",
      icone: "bg-white/20 text-white",
    },

    emerald: {
      fundo: "bg-emerald-500",
      icone: "bg-white/20 text-white",
    },

  };

  const estilo = estilos[cor];

  return (
    <div
      className={`
        flex
        items-center
        gap-4
        rounded-3xl
        ${estilo.fundo}
        p-5
        text-white
        shadow-sm
        transition-transform
        duration-200
        hover:-translate-y-0.5
      `}
    >

      <div
        className={`
          flex
          h-12
          w-12
          shrink-0
          items-center
          justify-center
          rounded-2xl
          text-sm
          font-bold
          ${estilo.icone}
        `}
      >
        {icone}
      </div>

      <div className="min-w-0">

        <p className="truncate text-xs font-medium uppercase tracking-wide text-white/70">
          {titulo}
        </p>

        <p className="mt-0.5 text-2xl font-bold tracking-tight">
          {valor}
        </p>

        <p className="truncate text-xs text-white/70">
          {descricao}
        </p>

      </div>

    </div>
  );
}


/* =================================================================
   BARRA FINANCEIRA (comparativo vertical)
================================================================= */

interface BarraFinanceiraProps {
  titulo: string;
  valor: number;
  maximo: number;
  cor: string;
  textoValor: string;
}

function BarraFinanceira({
  titulo,
  valor,
  maximo,
  cor,
  textoValor,
}: BarraFinanceiraProps) {

  const altura = Math.max(
    6,
    Math.min((valor / maximo) * 100, 100)
  );

  return (
    <div className="flex flex-col items-center">

      <div className="flex h-32 w-full items-end justify-center rounded-2xl bg-zinc-50 p-2">

        <div
          className={`w-8 rounded-full ${cor} transition-all duration-700`}
          style={{ height: `${altura}%` }}
        />

      </div>

      <p className="mt-3 text-sm font-bold text-[#1F2233]">
        {textoValor}
      </p>

      <p className="text-xs text-zinc-400">
        {titulo}
      </p>

    </div>
  );
}


/* =================================================================
   MINI INDICADOR (com gauge circular)
================================================================= */

interface MiniIndicadorProps {
  titulo: string;
  valor: number;
  cor: string;
  descricao: string;
}

function MiniIndicador({
  titulo,
  valor,
  cor,
  descricao,
}: MiniIndicadorProps) {

  const percentual = Math.max(0, Math.min(Number(valor) || 0, 100));

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-zinc-50 p-4">

      <Donut
        tamanho={56}
        espessura={7}
        total={100}
        segmentos={[{ valor: percentual, cor }]}
        corFundo="#E4E4E7"
        centro={
          <span className="text-[11px] font-bold text-[#1F2233]">
            {percentual.toFixed(0)}%
          </span>
        }
      />

      <div className="min-w-0">

        <p className="text-sm font-semibold text-[#1F2233]">
          {titulo}
        </p>

        <p className="truncate text-xs text-zinc-400">
          {descricao}
        </p>

      </div>

    </div>
  );
}


/* =================================================================
   LEGENDA DE STATUS
================================================================= */

interface LegendaStatusProps {
  cor: string;
  titulo: string;
  valor: number;
  total: number;
}

function LegendaStatus({
  cor,
  titulo,
  valor,
  total,
}: LegendaStatusProps) {

  const percentual = total > 0 ? (valor / total) * 100 : 0;

  return (
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-2.5">

        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: cor }}
        />

        <span className="text-sm text-zinc-500">
          {titulo}
        </span>

      </div>

      <div className="flex items-center gap-2">

        <span className="text-sm font-semibold text-[#1F2233]">
          {valor}
        </span>

        <span className="text-xs text-zinc-400">
          ({percentual.toFixed(0)}%)
        </span>

      </div>

    </div>
  );
}


/* =================================================================
   CARTÃO DE PROGRESSO
================================================================= */

interface CartaoProgressoProps {
  titulo: string;
  valor: number;
  total: number;
  cor: "blue" | "violet" | "emerald" | "amber";
}

function CartaoProgresso({
  titulo,
  valor,
  total,
  cor,
}: CartaoProgressoProps) {

  const percentual = total > 0 ? (valor / total) * 100 : 0;

  const estilos = {
    blue: { texto: "text-blue-500", barra: "bg-blue-500", chip: "bg-blue-50" },
    violet: { texto: "text-violet-500", barra: "bg-violet-500", chip: "bg-violet-50" },
    emerald: { texto: "text-emerald-500", barra: "bg-emerald-500", chip: "bg-emerald-50" },
    amber: { texto: "text-amber-500", barra: "bg-amber-500", chip: "bg-amber-50" },
  };

  const estilo = estilos[cor];

  return (
    <div className="rounded-3xl border border-zinc-100 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${estilo.chip} ${estilo.texto}`}
        >
          {titulo}
        </span>

        <span className={`text-sm font-bold ${estilo.texto}`}>
          {percentual.toFixed(0)}%
        </span>

      </div>

      <p className="mt-4 text-2xl font-bold tracking-tight text-[#1F2233]">
        {valor}
      </p>

      <p className="text-xs text-zinc-400">
        de {total} apartamentos
      </p>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-zinc-100">

        <div
          className={`h-full rounded-full ${estilo.barra} transition-all duration-700`}
          style={{ width: `${percentual}%` }}
        />

      </div>

    </div>
  );
}


/* =================================================================
   DONUT (SVG genérico, aceita 1+ segmentos)
================================================================= */

interface DonutSegmento {
  valor: number;
  cor: string;
}

interface DonutProps {
  tamanho: number;
  espessura: number;
  total: number;
  segmentos: DonutSegmento[];
  corFundo?: string;
  centro?: React.ReactNode;
}

function Donut({
  tamanho,
  espessura,
  total,
  segmentos,
  corFundo = "#F1F1F5",
  centro,
}: DonutProps) {

  const raio = (tamanho - espessura) / 2;
  const circunferencia = 2 * Math.PI * raio;
  const somaTotal = total > 0 ? total : 1;

  let acumulado = 0;

  return (
    <div
      className="relative"
      style={{ width: tamanho, height: tamanho }}
    >

      <svg
        width={tamanho}
        height={tamanho}
        viewBox={`0 0 ${tamanho} ${tamanho}`}
        className="-rotate-90"
      >

        <circle
          cx={tamanho / 2}
          cy={tamanho / 2}
          r={raio}
          fill="none"
          stroke={corFundo}
          strokeWidth={espessura}
        />

        {segmentos.map((segmento, indice) => {

          const fracao = Math.max(segmento.valor, 0) / somaTotal;
          const comprimento = fracao * circunferencia;
          const offset = circunferencia - (acumulado / somaTotal) * circunferencia;

          acumulado += segmento.valor;

          return (
            <circle
              key={indice}
              cx={tamanho / 2}
              cy={tamanho / 2}
              r={raio}
              fill="none"
              stroke={segmento.cor}
              strokeWidth={espessura}
              strokeDasharray={`${comprimento} ${circunferencia}`}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          );

        })}

      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {centro}
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
