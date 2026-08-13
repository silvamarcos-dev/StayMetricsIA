


import {
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";

import axios from "axios";

import {
  Building2,
  FileSpreadsheet,
  Download,
  BarChart3,
  Wallet,
  Percent,
  Sparkles,
  Upload,
  FileText,
  TrendingUp,
  ArrowUpRight,
  CircleDollarSign,
  Receipt,
  Landmark,
  Wifi,
  Zap,
  BrushCleaning,
  Wrench,
  Settings2,
  CalendarDays,
  ChevronDown,
  CheckCircle2,
  FileBarChart,
} from "lucide-react";

import {
  gerarRelatorio,
  importarExcel,
  buscarResumoApartamento,
  buscarRelatorioPorApartamentoCompetencia,
  type ApartamentoRelatorio,
  type ResumoApartamento,
} from "../api/api";

function extrairMensagemErro(
  error: unknown,
  fallback: string
): string {
  if (axios.isAxiosError(error)) {
    const detalhe = error.response?.data?.detail;

    if (typeof detalhe === "string") {
      return detalhe;
    }
  }

  return fallback;
}

export default function Relatorios() {
  const [loading, setLoading] =
    useState(false);

  const [loadingResumo, setLoadingResumo] =
    useState(false);

  const [excelFile, setExcelFile] =
    useState<File | null>(null);

  const [relatorios, setRelatorios] =
    useState<ApartamentoRelatorio[]>([]);

  const [
    relatorioSelecionado,
    setRelatorioSelecionado,
  ] =
    useState<ApartamentoRelatorio | null>(
      null
    );

  const [resumo, setResumo] =
    useState<ResumoApartamento | null>(
      null
    );

  // ==========================================================
  // CARREGAR RESUMO
  // ==========================================================

  async function carregarResumo(
    apartamentoId: string
  ) {
    if (!apartamentoId) {
      setResumo(null);
      return;
    }

    try {
      setLoadingResumo(true);

      const response =
        await buscarResumoApartamento(
          apartamentoId
        );

      if (response.sucesso) {
        setResumo(response.resumo);
      } else {
        setResumo(null);
      }
    } catch (error) {
      console.error(
        "Erro ao buscar resumo do apartamento:",
        error
      );

      setResumo(null);
    } finally {
      setLoadingResumo(false);
    }
  }

  // ==========================================================
  // IMPORTAR EXCEL
  // ==========================================================

  async function handleImportExcel() {
    if (!excelFile) {
      alert(
        "Selecione uma planilha Excel."
      );

      return;
    }

    try {
      setLoading(true);

      const data =
        await importarExcel(excelFile);

      const listaRelatorios =
        data.apartamentos ?? [];

      setRelatorios(
        listaRelatorios
      );

      if (
        listaRelatorios.length > 0
      ) {
        const primeiro =
          listaRelatorios[0];

        setRelatorioSelecionado(
          primeiro
        );

        await carregarResumo(
          primeiro.apartamento_id
        );
      } else {
        setRelatorioSelecionado(
          null
        );

        setResumo(null);
      }

      alert(
        `Planilha importada com sucesso! ${listaRelatorios.length} apartamento(s) encontrado(s).`
      );
    } catch (error) {
      console.error(
        "Erro ao importar Excel:",
        error
      );

      alert(
        extrairMensagemErro(
          error,
          "Erro ao importar planilha."
        )
      );
    } finally {
      setLoading(false);
    }
  }

  // ==========================================================
  // GERAR PDF
  // ==========================================================

  async function handleGeneratePdf() {
    if (
      !relatorioSelecionado
    ) {
      alert(
        "Selecione um relatório."
      );

      return;
    }

    try {
      setLoading(true);

      const relatorioResponse =
        await buscarRelatorioPorApartamentoCompetencia(
          relatorioSelecionado.apartamento_id,
          relatorioSelecionado.mes,
          relatorioSelecionado.ano
        );

      const relatorio =
        relatorioResponse.relatorio;

      const blob =
        await gerarRelatorio(
          relatorio.id
        );

      baixarArquivo(
        blob,
        `relatorio-${relatorioSelecionado.apartamento}.pdf`
      );

      alert(
        "PDF gerado com sucesso!"
      );
    } catch (error) {
      console.error(
        "Erro ao gerar PDF:",
        error
      );

      alert(
        extrairMensagemErro(
          error,
          "Erro ao gerar PDF."
        )
      );
    } finally {
      setLoading(false);
    }
  }

  // ==========================================================
  // ARQUIVO
  // ==========================================================

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0] ??
      null;

    setExcelFile(file);
  }

  // ==========================================================
  // SELECIONAR APARTAMENTO
  // ==========================================================

  async function handleSelecionarRelatorio(
    event: ChangeEvent<HTMLSelectElement>
  ) {
    const apartamentoId =
      event.target.value;

    const relatorio =
      relatorios.find(
        (item) =>
          item.apartamento_id ===
          apartamentoId
      );

    setRelatorioSelecionado(
      relatorio ?? null
    );

    if (relatorio) {
      await carregarResumo(
        relatorio.apartamento_id
      );
    } else {
      setResumo(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#0b1120] text-slate-100">

      <div className="mx-auto max-w-[1440px] px-5 py-6 sm:px-6 lg:px-8 lg:py-8">

        <div className="space-y-7">

          {/* ==================================================
              HEADER
          ================================================== */}

          <header className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[#111827] px-6 py-7 shadow-2xl shadow-black/10 lg:px-8">

            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />

            <div className="absolute -bottom-32 right-40 h-56 w-56 rounded-full bg-indigo-600/10 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">

              <div>

                <div className="mb-4 flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20">
                    <BarChart3 className="h-5 w-5" />
                  </div>

                  <div>

                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-400">
                      Aurion CRM
                    </p>

                    <p className="text-xs text-slate-500">
                      Inteligência operacional
                    </p>

                  </div>

                </div>

                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Relatórios financeiros
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Transforme os fechamentos dos apartamentos
                  em informações financeiras claras para
                  acompanhar desempenho, custos e rentabilidade.
                </p>

              </div>

              <div className="flex flex-wrap gap-3">

                <div className="flex min-w-[130px] items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 shadow-sm">
                    <FileBarChart className="h-4 w-4 text-blue-400" />
                  </div>

                  <div>

                    <p className="text-[11px] font-medium text-slate-500">
                      Relatórios
                    </p>

                    <p className="text-lg font-bold text-white">
                      {relatorios.length}
                    </p>

                  </div>

                </div>

                <div className="flex min-w-[150px] items-center gap-3 rounded-2xl border border-emerald-900/40 bg-emerald-950/30 px-4 py-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 shadow-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  </div>

                  <div>

                    <p className="text-[11px] font-medium text-slate-500">
                      Plataforma
                    </p>

                    <p className="text-sm font-bold text-emerald-400">
                      Sistema online
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </header>


          {/* ==================================================
              IMPORTAÇÃO + SELEÇÃO
          ================================================== */}

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.45fr_0.8fr]">

            {/* IMPORTAÇÃO */}

            <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#111827] shadow-xl shadow-black/10">

              <div className="border-b border-slate-800 px-6 py-5 lg:px-7">

                <div className="flex items-center justify-between gap-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                      <FileSpreadsheet className="h-5 w-5" />
                    </div>

                    <div>

                      <h2 className="font-bold text-white">
                        Importar fechamento
                      </h2>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Processe os dados financeiros da operação.
                      </p>

                    </div>

                  </div>

                  <span className="hidden rounded-full bg-slate-800 px-3 py-1.5 text-[11px] font-semibold text-slate-400 sm:block">
                    XLSX / XLSM
                  </span>

                </div>

              </div>


              <div className="p-6 lg:p-7">

                <label className="group relative flex min-h-[260px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-slate-700 bg-slate-900/50 px-6 py-10 text-center transition duration-300 hover:border-blue-500/60 hover:bg-blue-950/20">

                  <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100">

                    <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-blue-600/10 blur-3xl" />

                    <div className="absolute -bottom-20 -right-10 h-40 w-40 rounded-full bg-indigo-600/10 blur-3xl" />

                  </div>

                  <div className="relative">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/20 transition duration-300 group-hover:scale-105 group-hover:shadow-blue-600/30">

                      <Upload className="h-7 w-7" />

                    </div>

                    <h3 className="mt-5 text-base font-bold text-white">
                      Envie sua planilha de fechamento
                    </h3>

                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-400">
                      Selecione o arquivo Excel utilizado
                      pela operação para importar os dados
                      financeiros dos apartamentos.
                    </p>

                    <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white shadow-sm transition group-hover:bg-blue-600">

                      <FileSpreadsheet className="h-4 w-4" />

                      Escolher arquivo

                    </div>

                    <p className="mt-3 text-[11px] font-medium text-slate-600">
                      Arquivos Excel até o limite permitido pelo sistema
                    </p>

                  </div>

                  <input
                    type="file"
                    accept=".xlsx,.xlsm"
                    onChange={
                      handleFileChange
                    }
                    className="hidden"
                  />

                </label>


                {excelFile && (

                  <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-blue-900/50 bg-blue-950/30 p-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-blue-400 shadow-sm">

                        <FileText className="h-5 w-5" />

                      </div>

                      <div className="min-w-0">

                        <p className="truncate text-sm font-bold text-blue-200">
                          {excelFile.name}
                        </p>

                        <p className="mt-0.5 text-xs text-blue-400">
                          {(excelFile.size / 1024).toFixed(1)} KB
                        </p>

                      </div>

                    </div>

                    <CheckCircle2 className="hidden h-5 w-5 shrink-0 text-emerald-400 sm:block" />

                  </div>

                )}


                <button
                  type="button"
                  onClick={
                    handleImportExcel
                  }
                  disabled={
                    loading ||
                    !excelFile
                  }
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/15 transition duration-200 hover:bg-blue-500 hover:shadow-blue-600/25 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                >

                  <Upload className="h-4 w-4" />

                  {loading
                    ? "Processando planilha..."
                    : "Importar fechamento"}

                </button>

              </div>

            </div>


            {/* SELEÇÃO */}

            <div className="flex flex-col rounded-3xl border border-slate-800 bg-[#111827] p-6 shadow-xl shadow-black/10 lg:p-7">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">

                  <Building2 className="h-5 w-5" />

                </div>

                <div>

                  <h2 className="font-bold text-white">
                    Fechamento selecionado
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Escolha o apartamento para visualizar.
                  </p>

                </div>

              </div>


              <div className="mt-7">

                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Apartamento / competência
                </label>

                <div className="relative">

                  <select
                    value={
                      relatorioSelecionado?.apartamento_id ??
                      ""
                    }
                    onChange={
                      handleSelecionarRelatorio
                    }
                    disabled={
                      relatorios.length ===
                      0
                    }
                    className="w-full appearance-none rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3.5 pr-11 text-sm font-medium text-slate-200 outline-none transition focus:border-blue-500 focus:bg-slate-950 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >

                    <option value="">
                      {relatorios.length === 0
                        ? "Nenhum relatório importado"
                        : "Selecione um apartamento"}
                    </option>

                    {relatorios.map(
                      (relatorio) => (
                        <option
                          key={
                            relatorio.apartamento_id
                          }
                          value={
                            relatorio.apartamento_id
                          }
                        >
                          {relatorio.apartamento} —{" "}
                          {relatorio.mes}/
                          {relatorio.ano}
                        </option>
                      )
                    )}

                  </select>

                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                </div>

              </div>


              {/* DESTAQUE */}

              <div className="relative mt-6 flex-1 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-xl shadow-black/20">

                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/20 blur-2xl" />

                <div className="absolute -bottom-16 -left-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl" />

                <div className="relative">

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10">

                        <Sparkles className="h-4 w-4 text-yellow-300" />

                      </div>

                      <span className="text-xs font-semibold text-slate-400">
                        Receita líquida
                      </span>

                    </div>

                    <ArrowUpRight className="h-4 w-4 text-emerald-400" />

                  </div>

                  <p className="mt-5 text-3xl font-bold tracking-tight">

                    {loadingResumo
                      ? "..."
                      : formatarMoeda(
                          resumo?.receita_liquida
                        )}

                  </p>

                  <div className="mt-4 flex items-center gap-2">

                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">

                      <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-blue-400 to-emerald-400" />

                    </div>

                  </div>

                  <p className="mt-3 text-xs text-slate-500">

                    {resumo
                      ? relatorioSelecionado?.apartamento ??
                        `AP ${resumo.apartamento_id}`
                      : "Nenhum apartamento selecionado"}

                  </p>

                </div>

              </div>

            </div>

          </section>


          {/* ==================================================
              RESUMO FINANCEIRO
          ================================================== */}

          <section>

            <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">

              <div>

                <div className="flex items-center gap-2">

                  <CircleDollarSign className="h-5 w-5 text-blue-500" />

                  <h2 className="text-xl font-bold text-white">
                    Resumo financeiro
                  </h2>

                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Indicadores principais do fechamento selecionado.
                </p>

              </div>

              {resumo && (

                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">

                  <CalendarDays className="h-4 w-4" />

                  Competência {resumo.mes}/{resumo.ano}

                </div>

              )}

            </div>


            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <MetricCard
                icon={
                  <Wallet className="h-5 w-5" />
                }
                label="Receita bruta"
                value={formatarMoeda(
                  resumo?.receita_bruta
                )}
                iconClass="bg-emerald-500/10 text-emerald-400"
                description="Receita total"
              />

              <MetricCard
                icon={
                  <Receipt className="h-5 w-5" />
                }
                label="Custos"
                value={formatarMoeda(
                  resumo?.custos
                )}
                iconClass="bg-red-500/10 text-red-400"
                description="Custos operacionais"
              />

              <MetricCard
                icon={
                  <TrendingUp className="h-5 w-5" />
                }
                label="Receita líquida"
                value={formatarMoeda(
                  resumo?.receita_liquida
                )}
                iconClass="bg-blue-500/10 text-blue-400"
                description="Resultado final"
                highlight
              />

              <MetricCard
                icon={
                  <Percent className="h-5 w-5" />
                }
                label="Ocupação"
                value={
                  resumo?.ocupacao != null
                    ? `${resumo.ocupacao}%`
                    : "0%"
                }
                iconClass="bg-violet-500/10 text-violet-400"
                description="Taxa de ocupação"
              />

            </div>

          </section>


          {/* ==================================================
              DETALHES
          ================================================== */}

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">

            {/* CUSTOS */}

            <DetailPanel
              title="Custos operacionais"
              subtitle="Composição dos gastos do apartamento."
              icon={
                <Receipt className="h-5 w-5" />
              }
              iconClass="bg-red-500/10 text-red-400"
            >

              <DetailItem
                label="Internet"
                value={formatarMoeda(
                  resumo?.internet
                )}
                icon={
                  <Wifi className="h-4 w-4" />
                }
              />

              <DetailItem
                label="Copel"
                value={formatarMoeda(
                  resumo?.copel
                )}
                icon={
                  <Zap className="h-4 w-4" />
                }
              />

              <DetailItem
                label="Condomínio"
                value={formatarMoeda(
                  resumo?.condominio
                )}
                icon={
                  <Landmark className="h-4 w-4" />
                }
              />

              <DetailItem
                label="Limpeza"
                value={formatarMoeda(
                  resumo?.limpeza
                )}
                icon={
                  <BrushCleaning className="h-4 w-4" />
                }
              />

              <DetailItem
                label="Reparos"
                value={formatarMoeda(
                  resumo?.reparos
                )}
                icon={
                  <Wrench className="h-4 w-4" />
                }
              />

              <DetailItem
                label="Administração"
                value={formatarMoeda(
                  resumo?.administracao
                )}
                icon={
                  <Settings2 className="h-4 w-4" />
                }
              />

            </DetailPanel>


            {/* FECHAMENTO */}

            <DetailPanel
              title="Informações do fechamento"
              subtitle="Dados e indicadores da competência."
              icon={
                <FileText className="h-5 w-5" />
              }
              iconClass="bg-blue-500/10 text-blue-400"
            >

              <DetailItem
                label="Apartamento"
                value={
                  relatorioSelecionado?.apartamento ??
                  (resumo
                    ? `AP ${resumo.apartamento_id}`
                    : "-")
                }
                icon={
                  <Building2 className="h-4 w-4" />
                }
              />

              <DetailItem
                label="Competência"
                value={
                  resumo
                    ? `${resumo.mes}/${resumo.ano}`
                    : "-"
                }
                icon={
                  <CalendarDays className="h-4 w-4" />
                }
              />

              <DetailItem
                label="Ocupação"
                value={
                  resumo?.ocupacao != null
                    ? `${resumo.ocupacao}%`
                    : "0%"
                }
                icon={
                  <Percent className="h-4 w-4" />
                }
              />

              <DetailItem
                label="Valor do apartamento"
                value={formatarMoeda(
                  resumo?.valor_ap
                )}
                icon={
                  <Building2 className="h-4 w-4" />
                }
              />

              <DetailItem
                label="Locação normal"
                value={formatarMoeda(
                  resumo?.locacao_normal
                )}
                icon={
                  <Wallet className="h-4 w-4" />
                }
              />

              <DetailItem
                label="Renda passiva"
                value={formatarMoeda(
                  resumo?.renda_passiva
                )}
                icon={
                  <TrendingUp className="h-4 w-4" />
                }
              />

              <DetailItem
                label="Rentabilidade"
                value={
                  resumo?.rentabilidade != null
                    ? `${resumo.rentabilidade}%`
                    : "-"
                }
                icon={
                  <BarChart3 className="h-4 w-4" />
                }
              />

              <DetailItem
                label="Média de mercado"
                value={
                  resumo?.media_mercado != null
                    ? `${resumo.media_mercado}%`
                    : "-"
                }
                icon={
                  <Percent className="h-4 w-4" />
                }
              />

            </DetailPanel>

          </section>


          {/* ==================================================
              EXPORTAÇÃO
          ================================================== */}

          <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-6 shadow-xl shadow-black/20 lg:p-7">

            <div className="absolute -right-20 -top-32 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-blue-300 ring-1 ring-white/10">

                  <FileBarChart className="h-5 w-5" />

                </div>

                <div>

                  <h2 className="font-bold text-white">
                    Relatório pronto para exportação
                  </h2>

                  <p className="mt-1 max-w-xl text-sm leading-6 text-slate-400">
                    Gere um PDF profissional com os dados
                    financeiros do apartamento selecionado.
                  </p>

                </div>

              </div>


              <button
                type="button"
                onClick={
                  handleGeneratePdf
                }
                disabled={
                  loading ||
                  !relatorioSelecionado
                }
                className="flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-bold text-slate-900 shadow-lg transition duration-200 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
              >

                <Download className="h-4 w-4" />

                {loading
                  ? "Gerando PDF..."
                  : "Gerar PDF"}

              </button>

            </div>

          </section>

        </div>

      </div>

    </main>
  );
}


// ============================================================
// COMPONENTE: METRIC CARD
// ============================================================

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  iconClass: string;
  description: string;
  highlight?: boolean;
}

function MetricCard({
  icon,
  label,
  value,
  iconClass,
  description,
  highlight = false,
}: MetricCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border p-5 shadow-xl shadow-black/10 transition duration-200 hover:-translate-y-0.5 hover:shadow-2xl ${
        highlight
          ? "border-blue-900/50 bg-gradient-to-br from-[#111827] to-blue-950/40"
          : "border-slate-800 bg-[#111827]"
      }`}
    >

      {highlight && (
        <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl" />
      )}

      <div className="relative">

        <div className="flex items-center justify-between">

          <div
            className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconClass} transition duration-200 group-hover:scale-105`}
          >
            {icon}
          </div>

          {highlight && (
            <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-400">

              <ArrowUpRight className="h-3 w-3" />

              Resultado

            </div>
          )}

        </div>

        <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </p>

        <p className="mt-1 text-2xl font-bold tracking-tight text-white">
          {value}
        </p>

        <p className="mt-1 text-xs text-slate-600">
          {description}
        </p>

      </div>

    </div>
  );
}


// ============================================================
// COMPONENTE: DETAIL PANEL
// ============================================================

interface DetailPanelProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  iconClass: string;
  children: ReactNode;
}

function DetailPanel({
  title,
  subtitle,
  icon,
  iconClass,
  children,
}: DetailPanelProps) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-[#111827] p-6 shadow-xl shadow-black/10 lg:p-7">

      <div className="mb-6 flex items-center gap-3">

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconClass}`}
        >
          {icon}
        </div>

        <div>

          <h3 className="font-bold text-white">
            {title}
          </h3>

          <p className="mt-0.5 text-xs text-slate-500">
            {subtitle}
          </p>

        </div>

      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {children}
      </div>

    </div>
  );
}


// ============================================================
// COMPONENTE: DETAIL ITEM
// ============================================================

interface DetailItemProps {
  label: string;
  value: string;
  icon: ReactNode;
}

function DetailItem({
  label,
  value,
  icon,
}: DetailItemProps) {
  return (
    <div className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 transition hover:border-slate-700 hover:bg-slate-800/70 hover:shadow-sm">

      <div className="flex items-center gap-2">

        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-slate-500 shadow-sm transition group-hover:text-blue-400">

          {icon}

        </div>

        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
          {label}
        </p>

      </div>

      <p className="mt-3 text-sm font-bold text-slate-200">
        {value}
      </p>

    </div>
  );
}


// ============================================================
// FORMATAÇÃO DE MOEDA
// ============================================================

function formatarMoeda(
  valor?: number | null
): string {
  if (
    valor == null ||
    Number.isNaN(Number(valor))
  ) {
    return "R$ 0,00";
  }

  return Number(valor).toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    }
  );
}


// ============================================================
// DOWNLOAD
// ============================================================

function baixarArquivo(
  blob: Blob,
  nomeArquivo: string
): void {
  const url =
    window.URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;
  link.download = nomeArquivo;

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
}

