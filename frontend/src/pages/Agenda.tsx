import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock3,
  UserRound,
  Building2,
  Eye,
  CalendarCheck2,
  Sparkles,
  X,
  Loader2,
} from "lucide-react";

import api from "../api/api";

import {
  criarVisita,
  listarVisitas,
} from "../services/agendaService";

import type {
  Visita,
  VisitaCreate,
} from "../types/visita";

// ============================================================
// TIPOS LOCAIS
// ============================================================

type StatusApartamento =
  | "DISPONIVEL"
  | "RESERVADO"
  | "OCUPADO"
  | "MANUTENCAO";

type TipoContato =
  | "CLIENTE"
  | "PROPRIETARIO"
  | "HOSPEDE"
  | "CORRETOR";

type TipoUsuario =
  | "ADMINISTRADOR"
  | "CORRETOR"
  | "ATENDENTE";

interface Apartamento {
  id: string;
  numero: string;
  bloco: string | null;
  status: StatusApartamento;
  proprietarioId: string | null;
  observacoes: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

interface Contato {
  id: string;
  nome: string;
  telefoneWhatsapp: string | null;
  email: string | null;
  apartamentoVinculado: string | null;
  tipo: TipoContato;
  observacoes: string | null;
  whatsappOptIn: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

interface Usuario {
  id: string;
  nome: string;
  email: string;
  senhaHash?: string;
  tipo: TipoUsuario;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

// ============================================================
// UTILITÁRIO — DATA LOCAL
// ============================================================

function obterDataLocal(): string {
  const hoje = new Date();

  const ano = hoje.getFullYear();

  const mes = String(
    hoje.getMonth() + 1
  ).padStart(2, "0");

  const dia = String(
    hoje.getDate()
  ).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

// ============================================================
// AGENDA
// ============================================================

function Agenda() {
  // ============================================================
  // DATA ATUAL
  // ============================================================

  const hojeFormatado = obterDataLocal();

  // ============================================================
  // ESTADOS — AGENDA
  // ============================================================

  const [dataSelecionada, setDataSelecionada] =
    useState(hojeFormatado);

  const [visitas, setVisitas] =
    useState<Visita[]>([]);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] =
    useState<string | null>(null);

  // ============================================================
  // ESTADOS — CADASTROS
  // ============================================================

  const [apartamentos, setApartamentos] =
    useState<Apartamento[]>([]);

  const [contatos, setContatos] =
    useState<Contato[]>([]);

  const [usuarios, setUsuarios] =
    useState<Usuario[]>([]);

  const [carregandoCadastros, setCarregandoCadastros] =
    useState(true);

  const [erroCadastros, setErroCadastros] =
    useState<string | null>(null);

  // ============================================================
  // ESTADOS — MODAL
  // ============================================================

  const [modalAberto, setModalAberto] =
    useState(false);

  const [criando, setCriando] =
    useState(false);

  const [erroFormulario, setErroFormulario] =
    useState<string | null>(null);

  // ============================================================
  // FORMULÁRIO
  // ============================================================

  const [formulario, setFormulario] =
    useState<VisitaCreate>({
      apartamento_id: "",
      contato_id: "",
      corretor_id: "",
      data: hojeFormatado,
      hora_inicio: "",
      hora_fim: "",
      observacoes: "",
    });

  // ============================================================
  // CARREGAR VISITAS
  // ============================================================

  useEffect(() => {
    let ativo = true;

    async function carregarVisitas() {
      try {
        setCarregando(true);
        setErro(null);

        const dados =
          await listarVisitas();

        if (!ativo) {
          return;
        }

        setVisitas(dados);
      } catch (error) {
        console.error(
          "Erro ao carregar visitas:",
          error
        );

        if (!ativo) {
          return;
        }

        setErro(
          "Não foi possível carregar os compromissos."
        );
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    void carregarVisitas();

    return () => {
      ativo = false;
    };
  }, []);

  // ============================================================
  // CARREGAR APARTAMENTOS, CONTATOS E USUÁRIOS
  // ============================================================

  useEffect(() => {
    let ativo = true;

    async function carregarCadastros() {
      try {
        setCarregandoCadastros(true);
        setErroCadastros(null);

        const [
          apartamentosResponse,
          contatosResponse,
          usuariosResponse,
        ] = await Promise.all([
          // ======================================================
          // IMPORTANTE:
          // As rotas reais do backend possuem /api/crm
          // ======================================================

          api.get<Apartamento[]>(
            "/api/crm/apartamentos"
          ),

          api.get<Contato[]>(
            "/api/crm/contatos"
          ),

          api.get<Usuario[]>(
            "/api/crm/usuarios"
          ),
        ]);

        if (!ativo) {
          return;
        }

        setApartamentos(
          apartamentosResponse.data
        );

        setContatos(
          contatosResponse.data
        );

        setUsuarios(
          usuariosResponse.data
        );
      } catch (error) {
        console.error(
          "Erro ao carregar dados da agenda:",
          error
        );

        if (!ativo) {
          return;
        }

        setErroCadastros(
          "Não foi possível carregar apartamentos, contatos e corretores."
        );
      } finally {
        if (ativo) {
          setCarregandoCadastros(false);
        }
      }
    }

    void carregarCadastros();

    return () => {
      ativo = false;
    };
  }, []);

  // ============================================================
  // CORRETORES ATIVOS
  // ============================================================

  const corretores = useMemo(() => {
    return usuarios.filter(
      (usuario) =>
        usuario.tipo === "CORRETOR" &&
        usuario.ativo
    );
  }, [usuarios]);

  // ============================================================
  // VISITAS DO DIA
  // ============================================================

  const visitasDoDia = useMemo(() => {
    return visitas
      .filter(
        (visita) =>
          visita.data === dataSelecionada
      )
      .sort((a, b) =>
        a.hora_inicio.localeCompare(
          b.hora_inicio
        )
      );
  }, [
    visitas,
    dataSelecionada,
  ]);

  // ============================================================
  // PRÓXIMA VISITA
  // ============================================================

  const proximaVisita = useMemo(() => {
    if (visitasDoDia.length === 0) {
      return null;
    }

    return visitasDoDia[0];
  }, [visitasDoDia]);

  // ============================================================
  // MAPA DE APARTAMENTOS
  // ============================================================

  const apartamentosMap = useMemo(() => {
    return new Map(
      apartamentos.map(
        (apartamento) => [
          apartamento.id,
          apartamento,
        ]
      )
    );
  }, [apartamentos]);

  // ============================================================
  // MAPA DE CONTATOS
  // ============================================================

  const contatosMap = useMemo(() => {
    return new Map(
      contatos.map(
        (contato) => [
          contato.id,
          contato,
        ]
      )
    );
  }, [contatos]);

  // ============================================================
  // MAPA DE USUÁRIOS
  // ============================================================

  const usuariosMap = useMemo(() => {
    return new Map(
      usuarios.map(
        (usuario) => [
          usuario.id,
          usuario,
        ]
      )
    );
  }, [usuarios]);

  // ============================================================
  // NAVEGAR DATA
  // ============================================================

  function alterarData(
    quantidade: number
  ) {
    const data = new Date(
      `${dataSelecionada}T00:00:00`
    );

    data.setDate(
      data.getDate() + quantidade
    );

    const ano = data.getFullYear();

    const mes = String(
      data.getMonth() + 1
    ).padStart(2, "0");

    const dia = String(
      data.getDate()
    ).padStart(2, "0");

    setDataSelecionada(
      `${ano}-${mes}-${dia}`
    );
  }

  // ============================================================
  // FORMATAR HORÁRIO
  // ============================================================

  function formatarHorario(
    horario: string
  ) {
    return horario.slice(0, 5);
  }

  // ============================================================
  // FORMATAR APARTAMENTO
  // ============================================================

  function formatarApartamento(
    apartamentoId: string
  ) {
    const apartamento =
      apartamentosMap.get(
        apartamentoId
      );

    if (!apartamento) {
      return "Apartamento não encontrado";
    }

    if (apartamento.bloco) {
      return `Apto ${apartamento.numero} • Bloco ${apartamento.bloco}`;
    }

    return `Apto ${apartamento.numero}`;
  }

  // ============================================================
  // FORMATAR CONTATO
  // ============================================================

  function formatarContato(
    contatoId: string
  ) {
    const contato =
      contatosMap.get(contatoId);

    return (
      contato?.nome ??
      "Contato não encontrado"
    );
  }

  // ============================================================
  // FORMATAR CORRETOR
  // ============================================================

  function formatarCorretor(
    corretorId: string
  ) {
    const corretor =
      usuariosMap.get(corretorId);

    return (
      corretor?.nome ??
      "Corretor não encontrado"
    );
  }

  // ============================================================
  // CALENDÁRIO
  // ============================================================

  const anoSelecionado = Number(
    dataSelecionada.slice(0, 4)
  );

  const mesSelecionado = Number(
    dataSelecionada.slice(5, 7)
  );

  const nomeMes = new Date(
    anoSelecionado,
    mesSelecionado - 1,
    1
  ).toLocaleDateString(
    "pt-BR",
    {
      month: "long",
      year: "numeric",
    }
  );

  const primeiroDiaMes =
    new Date(
      anoSelecionado,
      mesSelecionado - 1,
      1
    ).getDay();

  const diasNoMes =
    new Date(
      anoSelecionado,
      mesSelecionado,
      0
    ).getDate();

  const diasCalendario =
    Array.from(
      {
        length:
          primeiroDiaMes +
          diasNoMes,
      },
      (_, index) => {
        if (
          index < primeiroDiaMes
        ) {
          return null;
        }

        return (
          index -
          primeiroDiaMes +
          1
        );
      }
    );

  // ============================================================
  // VERIFICAR EVENTO NO DIA
  // ============================================================

  function temEventoNoDia(
    dia: number
  ) {
    const data =
      `${anoSelecionado}-${String(
        mesSelecionado
      ).padStart(2, "0")}-${String(
        dia
      ).padStart(2, "0")}`;

    return visitas.some(
      (visita) =>
        visita.data === data
    );
  }

  // ============================================================
  // ABRIR MODAL
  // ============================================================

  function abrirModal() {
    setErroFormulario(null);

    setFormulario({
      apartamento_id: "",
      contato_id: "",
      corretor_id: "",
      data: dataSelecionada,
      hora_inicio: "",
      hora_fim: "",
      observacoes: "",
    });

    setModalAberto(true);
  }

  // ============================================================
  // FECHAR MODAL
  // ============================================================

  function fecharModal() {
    if (criando) {
      return;
    }

    setModalAberto(false);
    setErroFormulario(null);
  }

  // ============================================================
  // ALTERAR FORMULÁRIO
  // ============================================================

  function alterarFormulario(
    campo: keyof VisitaCreate,
    valor: string
  ) {
    setFormulario(
      (estadoAtual) => ({
        ...estadoAtual,
        [campo]: valor,
      })
    );
  }

  // ============================================================
  // CRIAR VISITA
  // ============================================================

  async function handleCriarVisita(
    evento: FormEvent<HTMLFormElement>
  ) {
    evento.preventDefault();

    setErroFormulario(null);

    if (
      !formulario.apartamento_id ||
      !formulario.contato_id ||
      !formulario.corretor_id ||
      !formulario.data ||
      !formulario.hora_inicio
    ) {
      setErroFormulario(
        "Preencha todos os campos obrigatórios."
      );

      return;
    }

    if (
      formulario.hora_fim &&
      formulario.hora_fim <=
        formulario.hora_inicio
    ) {
      setErroFormulario(
        "A hora de término deve ser posterior à hora de início."
      );

      return;
    }

    try {
      setCriando(true);

      const payload: VisitaCreate = {
        apartamento_id:
          formulario.apartamento_id,

        contato_id:
          formulario.contato_id,

        corretor_id:
          formulario.corretor_id,

        data:
          formulario.data,

        hora_inicio:
          formulario.hora_inicio,

        hora_fim:
          formulario.hora_fim?.trim()
            ? formulario.hora_fim
            : null,

        observacoes:
          formulario.observacoes?.trim()
            ? formulario.observacoes.trim()
            : null,
      };

      const novaVisita =
        await criarVisita(payload);

      setVisitas(
        (estadoAtual) => [
          ...estadoAtual,
          novaVisita,
        ]
      );

      setDataSelecionada(
        novaVisita.data
      );

      setModalAberto(false);

      setFormulario({
        apartamento_id: "",
        contato_id: "",
        corretor_id: "",
        data: novaVisita.data,
        hora_inicio: "",
        hora_fim: "",
        observacoes: "",
      });
    } catch (error) {
      console.error(
        "Erro ao criar visita:",
        error
      );

      setErroFormulario(
        "Não foi possível criar o compromisso. Verifique os dados e tente novamente."
      );
    } finally {
      setCriando(false);
    }
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-[1440px] px-5 py-6 sm:px-6 lg:px-8 lg:py-8">

        <div className="space-y-7">

          {/* ==================================================
              HEADER
          ================================================== */}

          <header className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 px-6 py-7 shadow-2xl shadow-black/20 lg:px-8">

            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />

            <div className="absolute -bottom-32 right-1/3 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">

              <div>

                <div className="mb-4 flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-600/20">
                    <CalendarDays className="h-5 w-5" />
                  </div>

                  <div>

                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-400">
                      Aurion CRM
                    </p>

                    <p className="text-xs text-slate-500">
                      Gestão operacional
                    </p>

                  </div>

                </div>

                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Agenda
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Organize reservas, visitas,
                  check-ins, check-outs e todos
                  os compromissos da operação.
                </p>

              </div>

              <button
                type="button"
                onClick={abrirModal}
                className="group flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition duration-200 hover:bg-blue-500 hover:shadow-blue-600/30"
              >

                <Plus className="h-4 w-4 transition group-hover:rotate-90" />

                Novo evento

              </button>

            </div>

          </header>

          {/* ==================================================
              CONTROLES
          ================================================== */}

          <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl shadow-black/10">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-center gap-2">

                <button
                  type="button"
                  onClick={() =>
                    alterarData(-1)
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-slate-400 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  className="rounded-xl border border-slate-800 bg-slate-950 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-400"
                  onClick={() =>
                    setDataSelecionada(
                      hojeFormatado
                    )
                  }
                >
                  Hoje
                </button>

                <button
                  type="button"
                  onClick={() =>
                    alterarData(1)
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-slate-400 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

              </div>

              <div className="flex items-center gap-3">

                <div className="hidden items-center gap-2 text-sm text-slate-500 sm:flex">
                  <CalendarDays className="h-4 w-4" />

                  Data selecionada
                </div>

                <input
                  type="date"
                  value={dataSelecionada}
                  onChange={(e) =>
                    setDataSelecionada(
                      e.target.value
                    )
                  }
                  className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm font-medium text-slate-300 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />

              </div>

            </div>

          </section>

          {/* ==================================================
              CONTEÚDO
          ================================================== */}

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_1fr]">

            {/* ==================================================
                CALENDÁRIO
            ================================================== */}

            <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-black/10">

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="font-bold text-white">
                    Calendário
                  </h2>

                  <p className="mt-1 text-xs capitalize text-slate-500">
                    {nomeMes}
                  </p>

                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <CalendarDays className="h-4 w-4" />
                </div>

              </div>

              <div className="mt-6 grid grid-cols-7 gap-1 text-center">

                {[
                  "D",
                  "S",
                  "T",
                  "Q",
                  "Q",
                  "S",
                  "S",
                ].map(
                  (dia, index) => (
                    <div
                      key={`${dia}-${index}`}
                      className="py-2 text-[10px] font-bold uppercase tracking-wide text-slate-600"
                    >
                      {dia}
                    </div>
                  )
                )}

              </div>

              <div className="grid grid-cols-7 gap-1">

                {diasCalendario.map(
                  (dia, index) => {

                    if (dia === null) {
                      return (
                        <div
                          key={`empty-${index}`}
                          className="h-10"
                        />
                      );
                    }

                    const dataDoDia =
                      `${anoSelecionado}-${String(
                        mesSelecionado
                      ).padStart(2, "0")}-${String(
                        dia
                      ).padStart(2, "0")}`;

                    const isHoje =
                      dataDoDia ===
                      hojeFormatado;

                    const selecionado =
                      dataDoDia ===
                      dataSelecionada;

                    const temEvento =
                      temEventoNoDia(dia);

                    return (
                      <button
                        type="button"
                        key={dia}
                        onClick={() =>
                          setDataSelecionada(
                            dataDoDia
                          )
                        }
                        className={`relative flex h-10 items-center justify-center rounded-xl text-sm transition ${
                          selecionado
                            ? "bg-blue-600 font-bold text-white shadow-lg shadow-blue-600/20"
                            : isHoje
                              ? "border border-blue-500/40 font-bold text-blue-400"
                              : "text-slate-400 hover:bg-slate-800 hover:text-white"
                        }`}
                      >

                        {dia}

                        {temEvento &&
                          !selecionado && (
                            <span className="absolute bottom-1 h-1 w-1 rounded-full bg-indigo-400" />
                          )}

                      </button>
                    );
                  }
                )}

              </div>

              <div className="mt-6 border-t border-slate-800 pt-5">

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  Hoje
                </div>

                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-indigo-400" />
                  Eventos programados
                </div>

              </div>

            </section>

            {/* ==================================================
                EVENTOS
            ================================================== */}

            <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-xl shadow-black/10">

              <div className="border-b border-slate-800 p-6">

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                  <div>

                    <div className="flex items-center gap-2">

                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                        <CalendarCheck2 className="h-4 w-4" />
                      </div>

                      <h2 className="font-bold text-white">
                        Compromissos do dia
                      </h2>

                    </div>

                    <p className="mt-2 text-sm text-slate-500">

                      {carregando
                        ? "Carregando..."
                        : `${visitasDoDia.length} eventos programados`}

                    </p>

                  </div>

                  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400">

                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                    {dataSelecionada ===
                    hojeFormatado
                      ? "Hoje"
                      : "Selecionado"}

                  </span>

                </div>

              </div>

              {/* ERRO VISITAS */}

              {erro && (
                <div className="border-b border-red-500/20 bg-red-500/5 px-6 py-4 text-sm text-red-400">
                  {erro}
                </div>
              )}

              {/* ERRO CADASTROS */}

              {erroCadastros && (
                <div className="border-b border-amber-500/20 bg-amber-500/5 px-6 py-4 text-sm text-amber-400">
                  {erroCadastros}
                </div>
              )}

              {/* CARREGANDO */}

              {(carregando ||
                carregandoCadastros) && (
                <div className="p-10 text-center">

                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-blue-500" />

                  <p className="mt-3 text-sm text-slate-500">
                    Carregando dados da agenda...
                  </p>

                </div>
              )}

              {/* SEM EVENTOS */}

              {!carregando &&
                !carregandoCadastros &&
                visitasDoDia.length === 0 && (
                  <div className="p-10 text-center">

                    <CalendarDays className="mx-auto h-10 w-10 text-slate-700" />

                    <p className="mt-4 font-semibold text-slate-400">
                      Nenhum compromisso
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      Não existem visitas agendadas
                      para esta data.
                    </p>

                    <button
                      type="button"
                      onClick={abrirModal}
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-500"
                    >
                      <Plus className="h-4 w-4" />
                      Criar evento
                    </button>

                  </div>
                )}

              {/* LISTA */}

              {!carregando &&
                visitasDoDia.length > 0 && (
                  <div className="divide-y divide-slate-800">

                    {visitasDoDia.map(
                      (visita) => (
                        <div
                          key={visita.id}
                          className="group flex flex-col gap-5 p-6 transition duration-200 hover:bg-slate-800/40 md:flex-row md:items-center"
                        >

                          {/* HORÁRIO */}

                          <div className="flex w-20 shrink-0 items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-slate-400 transition group-hover:bg-blue-500/10 group-hover:text-blue-400">

                              <Clock3 className="h-4 w-4" />

                            </div>

                            <p className="text-lg font-bold text-white">
                              {formatarHorario(
                                visita.hora_inicio
                              )}
                            </p>

                          </div>

                          {/* INDICADOR */}

                          <div className="hidden h-14 w-1 rounded-full bg-violet-500 md:block" />

                          {/* INFORMAÇÕES */}

                          <div className="min-w-0 flex-1">

                            <div className="flex flex-wrap items-center gap-2">

                              <h3 className="font-bold text-white">
                                Visita ao imóvel
                              </h3>

                              <span className="rounded-full bg-violet-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-violet-400">
                                {visita.status}
                              </span>

                            </div>

                            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">

                              <div className="flex items-center gap-2 text-sm text-slate-400">

                                <UserRound className="h-3.5 w-3.5 shrink-0 text-slate-600" />

                                <span className="truncate">
                                  {formatarContato(
                                    visita.contato_id
                                  )}
                                </span>

                              </div>

                              <div className="flex items-center gap-2 text-sm text-slate-400">

                                <Building2 className="h-3.5 w-3.5 shrink-0 text-slate-600" />

                                <span className="truncate">
                                  {formatarApartamento(
                                    visita.apartamento_id
                                  )}
                                </span>

                              </div>

                              <div className="flex items-center gap-2 text-xs text-slate-500 sm:col-span-2">

                                <UserRound className="h-3.5 w-3.5 shrink-0 text-slate-700" />

                                Corretor:
                                {" "}
                                {formatarCorretor(
                                  visita.corretor_id
                                )}

                              </div>

                            </div>

                          </div>

                          {/* AÇÃO */}

                          <button
                            type="button"
                            className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm font-semibold text-slate-400 transition hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400"
                            onClick={() =>
                              console.log(
                                visita
                              )
                            }
                          >

                            <Eye className="h-4 w-4" />

                            <span className="hidden sm:inline">
                              Ver detalhes
                            </span>

                          </button>

                        </div>
                      )
                    )}

                  </div>
                )}

            </section>

          </div>

          {/* ==================================================
              RESUMO
          ================================================== */}

          <section className="grid grid-cols-1 gap-4 md:grid-cols-3">

            <SummaryCard
              icon={
                <CalendarCheck2 className="h-5 w-5" />
              }
              label="Eventos hoje"
              value={visitas
                .filter(
                  (visita) =>
                    visita.data ===
                    hojeFormatado
                )
                .length.toString()}
              description="Compromissos programados"
              iconClass="bg-blue-500/10 text-blue-400"
            />

            <SummaryCard
              icon={
                <Clock3 className="h-5 w-5" />
              }
              label="Próximo evento"
              value={
                proximaVisita
                  ? formatarHorario(
                      proximaVisita.hora_inicio
                    )
                  : "--:--"
              }
              description={
                proximaVisita
                  ? "Visita agendada"
                  : "Nenhum evento"
              }
              iconClass="bg-violet-500/10 text-violet-400"
            />

            <SummaryCard
              icon={
                <Sparkles className="h-5 w-5" />
              }
              label="Operação"
              value="Ativa"
              description={
                carregando ||
                carregandoCadastros
                  ? "Sincronizando..."
                  : erro || erroCadastros
                    ? "Erro na sincronização"
                    : "Agenda sincronizada"
              }
              iconClass="bg-emerald-500/10 text-emerald-400"
            />

          </section>

        </div>
      </div>

      {/* ======================================================
          MODAL — NOVO EVENTO
      ====================================================== */}

      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

          <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <CalendarCheck2 className="h-5 w-5" />
                </div>

                <div>

                  <h2 className="font-bold text-white">
                    Novo evento
                  </h2>

                  <p className="text-xs text-slate-500">
                    Agendar uma nova visita
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={fecharModal}
                disabled={criando}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* FORMULÁRIO */}

            <form
              onSubmit={handleCriarVisita}
              className="space-y-5 p-6"
            >

              {/* ERRO */}

              {erroFormulario && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {erroFormulario}
                </div>
              )}

              {/* CARREGANDO */}

              {carregandoCadastros && (
                <div className="flex items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3 text-xs text-blue-400">

                  <Loader2 className="h-4 w-4 animate-spin" />

                  Carregando apartamentos,
                  contatos e corretores...

                </div>
              )}

              {/* ==================================================
                  APARTAMENTO / CONTATO / CORRETOR
              ================================================== */}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                <SelectField
                  label="Apartamento"
                  required
                  value={
                    formulario.apartamento_id
                  }
                  onChange={(valor) =>
                    alterarFormulario(
                      "apartamento_id",
                      valor
                    )
                  }
                  disabled={
                    carregandoCadastros ||
                    criando
                  }
                >

                  <option value="">
                    Selecione...
                  </option>

                  {apartamentos.map(
                    (apartamento) => (
                      <option
                        key={apartamento.id}
                        value={apartamento.id}
                      >
                        {formatarApartamento(
                          apartamento.id
                        )}
                      </option>
                    )
                  )}

                </SelectField>

                <SelectField
                  label="Contato"
                  required
                  value={
                    formulario.contato_id
                  }
                  onChange={(valor) =>
                    alterarFormulario(
                      "contato_id",
                      valor
                    )
                  }
                  disabled={
                    carregandoCadastros ||
                    criando
                  }
                >

                  <option value="">
                    Selecione...
                  </option>

                  {contatos.map(
                    (contato) => (
                      <option
                        key={contato.id}
                        value={contato.id}
                      >
                        {contato.nome}
                      </option>
                    )
                  )}

                </SelectField>

                <SelectField
                  label="Corretor"
                  required
                  value={
                    formulario.corretor_id
                  }
                  onChange={(valor) =>
                    alterarFormulario(
                      "corretor_id",
                      valor
                    )
                  }
                  disabled={
                    carregandoCadastros ||
                    criando
                  }
                >

                  <option value="">
                    Selecione...
                  </option>

                  {corretores.map(
                    (corretor) => (
                      <option
                        key={corretor.id}
                        value={corretor.id}
                      >
                        {corretor.nome}
                      </option>
                    )
                  )}

                </SelectField>

              </div>

              {/* ==================================================
                  DATA E HORÁRIOS
              ================================================== */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                <FormField
                  label="Data"
                  required
                  type="date"
                  value={
                    formulario.data
                  }
                  onChange={(valor) =>
                    alterarFormulario(
                      "data",
                      valor
                    )
                  }
                />

                <FormField
                  label="Hora de início"
                  required
                  type="time"
                  value={
                    formulario.hora_inicio
                  }
                  onChange={(valor) =>
                    alterarFormulario(
                      "hora_inicio",
                      valor
                    )
                  }
                />

                <FormField
                  label="Hora de término"
                  type="time"
                  value={
                    formulario.hora_fim ?? ""
                  }
                  onChange={(valor) =>
                    alterarFormulario(
                      "hora_fim",
                      valor
                    )
                  }
                />

              </div>

              {/* ==================================================
                  OBSERVAÇÕES
              ================================================== */}

              <div>

                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Observações
                </label>

                <textarea
                  value={
                    formulario.observacoes ?? ""
                  }
                  onChange={(e) =>
                    alterarFormulario(
                      "observacoes",
                      e.target.value
                    )
                  }
                  rows={4}
                  placeholder="Observações sobre a visita..."
                  className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />

              </div>

              {/* ==================================================
                  INFO
              ================================================== */}

              <div className="rounded-xl border border-blue-500/10 bg-blue-500/5 px-4 py-3 text-xs leading-5 text-slate-500">

                O evento será criado com status{" "}

                <span className="font-bold text-blue-400">
                  AGENDADA
                </span>{" "}

                automaticamente pelo backend.

              </div>

              {/* ==================================================
                  AÇÕES
              ================================================== */}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={fecharModal}
                  disabled={criando}
                  className="rounded-xl border border-slate-800 bg-slate-950 px-5 py-3 text-sm font-semibold text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={
                    criando ||
                    carregandoCadastros ||
                    apartamentos.length === 0 ||
                    contatos.length === 0 ||
                    corretores.length === 0
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {criando ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />

                      Criando...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />

                      Criar evento
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </main>
  );
}

// ============================================================
// COMPONENTE — SELECT FIELD
// ============================================================

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  required?: boolean;
  disabled?: boolean;
}

function SelectField({
  label,
  value,
  onChange,
  children,
  required = false,
  disabled = false,
}: SelectFieldProps) {
  return (
    <div>

      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">

        {label}

        {required && (
          <span className="ml-1 text-blue-400">
            *
          </span>
        )}

      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        required={required}
        disabled={disabled}
        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {children}
      </select>

    </div>
  );
}

// ============================================================
// COMPONENTE — FORM FIELD
// ============================================================

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "date" | "time";
  required?: boolean;
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: FormFieldProps) {
  return (
    <div>

      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">

        {label}

        {required && (
          <span className="ml-1 text-blue-400">
            *
          </span>
        )}

      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
      />

    </div>
  );
}

// ============================================================
// COMPONENTE — SUMMARY CARD
// ============================================================

interface SummaryCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  description: string;
  iconClass: string;
}

function SummaryCard({
  icon,
  label,
  value,
  description,
  iconClass,
}: SummaryCardProps) {
  return (
    <div className="group rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-black/10 transition duration-200 hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900">

      <div className="flex items-center justify-between">

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconClass} transition group-hover:scale-105`}
        >
          {icon}
        </div>

      </div>

      <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold tracking-tight text-white">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>

    </div>
  );
}

export default Agenda;