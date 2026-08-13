import { useEffect, useState } from "react";

import {
  criarContato,
  listarContatos,
  type Contato,
  type NovoContato,
} from "../api/api";

const estadoInicial: NovoContato = {
  nome: "",
  telefoneWhatsapp: "",
  email: "",
  apartamentoVinculado: "",
  tipo: "CLIENTE",
  observacoes: "",
  whatsappOptIn: false,
};

function Contatos() {
  const [contatos, setContatos] =
    useState<Contato[]>([]);

  const [carregando, setCarregando] =
    useState<boolean>(true);

  const [erro, setErro] =
    useState<string>("");

  const [modalAberto, setModalAberto] =
    useState<boolean>(false);

  const [salvando, setSalvando] =
    useState<boolean>(false);

  const [novoContato, setNovoContato] =
    useState<NovoContato>(
      estadoInicial
    );

  const [busca, setBusca] =
    useState<string>("");

  // ============================================================
  // CARREGAR CONTATOS
  // ============================================================

  async function carregarContatos() {
    try {
      setCarregando(true);
      setErro("");

      const dados: Contato[] =
        await listarContatos();

      setContatos(dados);
    } catch (error: unknown) {
      console.error(
        "Erro ao carregar contatos:",
        error
      );

      setErro(
        "Não foi possível carregar os contatos."
      );
    } finally {
      setCarregando(false);
    }
  }

  // ============================================================
  // CARREGAMENTO INICIAL
  // ============================================================

  useEffect(() => {
    let ativo = true;

    async function carregarInicial() {
      try {
        const dados: Contato[] =
          await listarContatos();

        if (!ativo) {
          return;
        }

        setContatos(dados);
        setErro("");
      } catch (error: unknown) {
        console.error(
          "Erro ao carregar contatos:",
          error
        );

        if (!ativo) {
          return;
        }

        setErro(
          "Não foi possível carregar os contatos."
        );
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarInicial();

    return () => {
      ativo = false;
    };
  }, []);

  // ============================================================
  // ATUALIZAR CAMPO
  // ============================================================

  function atualizarCampo(
    campo: keyof NovoContato,
    valor: string | boolean
  ) {
    setNovoContato(
      (anterior: NovoContato) => ({
        ...anterior,
        [campo]: valor,
      })
    );
  }

  // ============================================================
  // ABRIR MODAL
  // ============================================================

  function abrirModal() {
    setNovoContato({
      ...estadoInicial,
    });

    setModalAberto(true);
  }

  // ============================================================
  // FECHAR MODAL
  // ============================================================

  function fecharModal() {
    if (salvando) {
      return;
    }

    setModalAberto(false);

    setNovoContato({
      ...estadoInicial,
    });
  }

  // ============================================================
  // CRIAR CONTATO
  // ============================================================

  async function handleCriarContato() {
    if (!novoContato.nome.trim()) {
      alert(
        "Informe o nome do contato."
      );

      return;
    }

    if (
      !novoContato.telefoneWhatsapp.trim()
    ) {
      alert(
        "Informe o número do WhatsApp."
      );

      return;
    }

    try {
      setSalvando(true);

      await criarContato(
        novoContato
      );

      setNovoContato({
        ...estadoInicial,
      });

      setModalAberto(false);

      await carregarContatos();

      alert(
        "Contato criado com sucesso!"
      );
    } catch (error: unknown) {
      console.error(
        "Erro ao criar contato:",
        error
      );

      if (
        error instanceof Error
      ) {
        alert(error.message);
      } else {
        alert(
          "Erro ao criar contato."
        );
      }
    } finally {
      setSalvando(false);
    }
  }

  // ============================================================
  // FILTRO
  // ============================================================

  const contatosFiltrados =
    contatos.filter(
      (contato) => {
        const termo =
          busca
            .toLowerCase()
            .trim();

        if (!termo) {
          return true;
        }

        return (
          contato.nome
            .toLowerCase()
            .includes(termo) ||

          contato.telefoneWhatsapp
            .toLowerCase()
            .includes(termo) ||

          (
            contato.email ?? ""
          )
            .toLowerCase()
            .includes(termo)
        );
      }
    );

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-full bg-[#0b1120] text-slate-100">

      <div className="space-y-6">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-lg text-blue-400">
                👥
              </div>

              <div>

                <h1 className="text-2xl font-bold tracking-tight text-white">
                  Contatos
                </h1>

                <p className="mt-0.5 text-sm text-slate-400">
                  Gerencie sua base de clientes e contatos.
                </p>

              </div>

            </div>

          </div>

          <button
            type="button"
            onClick={abrirModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-500 active:scale-[0.98]"
          >
            <span className="text-lg leading-none">
              +
            </span>

            Novo contato
          </button>

        </div>

        {/* ======================================================
            RESUMO
        ====================================================== */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          <ResumoCard
            titulo="Total de contatos"
            valor={contatos.length}
            icone="👥"
          />

          <ResumoCard
            titulo="Clientes"
            valor={
              contatos.filter(
                (contato) =>
                  contato.tipo ===
                  "CLIENTE"
              ).length
            }
            icone="◉"
          />

          <ResumoCard
            titulo="WhatsApp autorizado"
            valor={
              contatos.filter(
                (contato) =>
                  contato.whatsappOptIn
              ).length
            }
            icone="◉"
          />

        </div>

        {/* ======================================================
            PESQUISA
        ====================================================== */}

        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-4 shadow-xl shadow-black/10">

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

            <div className="relative w-full lg:max-w-md">

              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                ⌕
              </span>

              <input
                type="text"
                value={busca}
                onChange={(event) =>
                  setBusca(
                    event.target.value
                  )
                }
                placeholder="Buscar por nome, telefone ou e-mail..."
                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-900 pl-10 pr-4 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />

            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">

              <span className="h-2 w-2 rounded-full bg-emerald-500" />

              {contatosFiltrados.length} contato
              {contatosFiltrados.length !== 1
                ? "s"
                : ""}

            </div>

          </div>

        </div>

        {/* ======================================================
            LOADING
        ====================================================== */}

        {carregando && (

          <div className="flex min-h-400px items-center justify-center rounded-2xl border border-slate-800 bg-[#111827]">

            <div className="text-center">

              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />

              <p className="mt-4 text-sm font-medium text-slate-300">
                Carregando contatos...
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Sincronizando com o CRM
              </p>

            </div>

          </div>

        )}

        {/* ======================================================
            ERRO
        ====================================================== */}

        {!carregando && erro && (

          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-sm font-semibold text-red-400">
                  Não foi possível carregar os contatos.
                </p>

                <p className="mt-1 text-xs text-red-400/70">
                  {erro}
                </p>

              </div>

              <button
                type="button"
                onClick={
                  carregarContatos
                }
                className="rounded-lg bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
              >
                Tentar novamente
              </button>

            </div>

          </div>

        )}

        {/* ======================================================
            TABELA
        ====================================================== */}

        {!carregando &&
          !erro && (

            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#111827] shadow-xl shadow-black/10">

              <div className="overflow-x-auto">

                <table className="w-full min-w-900px text-left text-sm">

                  <thead className="border-b border-slate-800 bg-slate-900/60">

                    <tr>

                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Contato
                      </th>

                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Número
                      </th>

                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Apartamento
                      </th>

                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Tipo
                      </th>

                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        WhatsApp
                      </th>

                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Cadastro
                      </th>

                      <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Ações
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-slate-800/70">

                    {contatosFiltrados.map(
                      (contato) => (

                        <tr
                          key={
                            contato.id
                          }
                          className="group transition hover:bg-slate-800/30"
                        >

                          {/* CONTATO */}

                          <td className="px-6 py-4">

                            <div className="flex items-center gap-3">

                              <div className="relative">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 font-semibold text-blue-400">

                                  {contato.nome
                                    .charAt(
                                      0
                                    )
                                    .toUpperCase()}

                                </div>

                                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#111827] bg-emerald-500" />

                              </div>

                              <div className="min-w-0">

                                <p className="truncate font-semibold text-slate-100">
                                  {
                                    contato.nome
                                  }
                                </p>

                                <p className="mt-0.5 max-w-220px truncate text-xs text-slate-500">
                                  {
                                    contato.email ||
                                    "Sem e-mail"
                                  }
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* TELEFONE */}

                          <td className="px-6 py-4">

                            <span className="text-slate-300">
                              {
                                contato.telefoneWhatsapp ||
                                "-"
                              }
                            </span>

                          </td>

                          {/* APARTAMENTO */}

                          <td className="px-6 py-4">

                            <span className="text-slate-400">
                              {
                                contato.apartamentoVinculado ||
                                "Não vinculado"
                              }
                            </span>

                          </td>

                          {/* TIPO */}

                          <td className="px-6 py-4">

                            <TipoBadge
                              tipo={
                                contato.tipo
                              }
                            />

                          </td>

                          {/* WHATSAPP */}

                          <td className="px-6 py-4">

                            {contato.whatsappStatus ===
                            "ATIVO" ? (

                              <StatusBadge
                                tipo="ativo"
                                texto="Conectado"
                              />

                            ) : contato.whatsappOptIn ? (

                              <StatusBadge
                                tipo="autorizado"
                                texto="Autorizado"
                              />

                            ) : (

                              <StatusBadge
                                tipo="neutro"
                                texto="Não conectado"
                              />

                            )}

                          </td>

                          {/* DATA */}

                          <td className="px-6 py-4">

                            <span className="text-slate-500">

                              {contato.criadoEm
                                ? new Date(
                                    contato.criadoEm
                                  ).toLocaleDateString(
                                    "pt-BR"
                                  )
                                : "-"}

                            </span>

                          </td>

                          {/* AÇÕES */}

                          <td className="px-6 py-4 text-right">

                            <button
                              type="button"
                              onClick={() =>
                                console.log(
                                  "Contato:",
                                  contato
                                )
                              }
                              className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-400 opacity-80 transition hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-400 group-hover:opacity-100"
                            >
                              Visualizar
                            </button>

                          </td>

                        </tr>

                      )
                    )}

                    {contatosFiltrados.length ===
                      0 && (

                      <tr>

                        <td
                          colSpan={7}
                          className="px-6 py-20 text-center"
                        >

                          <div className="mx-auto max-w-sm">

                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-xl text-slate-500">
                              ⌕
                            </div>

                            <p className="mt-4 text-sm font-semibold text-slate-300">
                              Nenhum contato encontrado
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              Tente alterar os termos da pesquisa.
                            </p>

                          </div>

                        </td>

                      </tr>

                    )}

                  </tbody>

                </table>

              </div>

            </div>

          )}

      </div>

      {/* ========================================================
          MODAL
      ======================================================== */}

      {modalAberto && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {

            if (
              event.target ===
                event.currentTarget &&
              !salvando
            ) {
              fecharModal();
            }

          }}
        >

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-800 bg-[#111827] shadow-2xl shadow-black/50">

            {/* HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-[#111827]/95 px-6 py-5 backdrop-blur">

              <div>

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                    +
                  </div>

                  <h2 className="text-lg font-bold text-white">
                    Novo contato
                  </h2>

                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Cadastre um novo contato no CRM.
                </p>

              </div>

              <button
                type="button"
                onClick={
                  fecharModal
                }
                disabled={salvando}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-500 transition hover:bg-slate-800 hover:text-slate-200 disabled:opacity-50"
              >
                ×
              </button>

            </div>

            {/* FORM */}

            <div className="space-y-5 px-6 py-6">

              {/* NOME */}

              <Campo
                label="Nome"
                obrigatorio
              >

                <input
                  type="text"
                  value={
                    novoContato.nome
                  }
                  onChange={(event) =>
                    atualizarCampo(
                      "nome",
                      event.target.value
                    )
                  }
                  placeholder="Ex.: João da Silva"
                  disabled={salvando}
                  className={inputClass}
                />

              </Campo>

              {/* WHATSAPP / EMAIL */}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <Campo
                  label="WhatsApp"
                  obrigatorio
                >

                  <input
                    type="tel"
                    value={
                      novoContato.telefoneWhatsapp
                    }
                    onChange={(event) =>
                      atualizarCampo(
                        "telefoneWhatsapp",
                        event.target.value
                      )
                    }
                    placeholder="+55 44 99999-9999"
                    disabled={salvando}
                    className={inputClass}
                  />

                </Campo>

                <Campo label="E-mail">

                  <input
                    type="email"
                    value={
                      novoContato.email
                    }
                    onChange={(event) =>
                      atualizarCampo(
                        "email",
                        event.target.value
                      )
                    }
                    placeholder="joao@email.com"
                    disabled={salvando}
                    className={inputClass}
                  />

                </Campo>

              </div>

              {/* APARTAMENTO / TIPO */}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <Campo label="Apartamento vinculado">

                  <input
                    type="text"
                    value={
                      novoContato.apartamentoVinculado
                    }
                    onChange={(event) =>
                      atualizarCampo(
                        "apartamentoVinculado",
                        event.target.value
                      )
                    }
                    placeholder="Ex.: Apartamento 101"
                    disabled={salvando}
                    className={inputClass}
                  />

                </Campo>

                <Campo label="Tipo">

                  <select
                    value={
                      novoContato.tipo
                    }
                    onChange={(event) =>
                      atualizarCampo(
                        "tipo",
                        event.target.value
                      )
                    }
                    disabled={salvando}
                    className={`${inputClass} bg-slate-900`}
                  >

                    <option value="CLIENTE">
                      Cliente
                    </option>

                    <option value="PROPRIETARIO">
                      Proprietário
                    </option>

                    <option value="HOSPEDE">
                      Hóspede
                    </option>

                    <option value="CORRETOR">
                      Corretor
                    </option>

                  </select>

                </Campo>

              </div>

              {/* OPT-IN */}

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition hover:border-slate-700">

                <input
                  type="checkbox"
                  checked={
                    novoContato.whatsappOptIn ??
                    false
                  }
                  onChange={(event) =>
                    atualizarCampo(
                      "whatsappOptIn",
                      event.target.checked
                    )
                  }
                  disabled={salvando}
                  className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
                />

                <span>

                  <span className="block text-sm font-semibold text-slate-200">
                    Autorizar comunicação via WhatsApp
                  </span>

                  <span className="mt-1 block text-xs leading-relaxed text-slate-500">
                    O contato poderá receber comunicações através da integração WhatsApp.
                  </span>

                </span>

              </label>

              {/* OBSERVAÇÕES */}

              <Campo label="Observações">

                <textarea
                  value={
                    novoContato.observacoes
                  }
                  onChange={(event) =>
                    atualizarCampo(
                      "observacoes",
                      event.target.value
                    )
                  }
                  rows={4}
                  placeholder="Informações adicionais sobre o contato..."
                  disabled={salvando}
                  className={`${inputClass} resize-none`}
                />

              </Campo>

            </div>

            {/* FOOTER */}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-800 bg-slate-900/30 px-6 py-4 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={
                  fecharModal
                }
                disabled={salvando}
                className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-400 transition hover:bg-slate-800 hover:text-slate-200 disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={
                  handleCriarContato
                }
                disabled={salvando}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {salvando
                  ? "Salvando..."
                  : "Criar contato"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

// ============================================================
// COMPONENTES AUXILIARES
// ============================================================

interface ResumoCardProps {
  titulo: string;
  valor: number;
  icone: string;
}

function ResumoCard({
  titulo,
  valor,
  icone,
}: ResumoCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5 shadow-lg shadow-black/5">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs font-medium text-slate-500">
            {titulo}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-white">
            {valor}
          </p>

        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-sm text-slate-400">
          {icone}
        </div>

      </div>

    </div>
  );
}

interface CampoProps {
  label: string;
  obrigatorio?: boolean;
  children: React.ReactNode;
}

function Campo({
  label,
  obrigatorio,
  children,
}: CampoProps) {
  return (
    <div>

      <label className="mb-2 block text-xs font-semibold text-slate-300">

        {label}

        {obrigatorio && (
          <span className="ml-1 text-blue-400">
            *
          </span>
        )}

      </label>

      {children}

    </div>
  );
}

interface TipoBadgeProps {
  tipo?: string | null;
}

function TipoBadge({
  tipo,
}: TipoBadgeProps) {
  const estilos: Record<
    string,
    string
  > = {
    CLIENTE:
      "bg-blue-500/10 text-blue-400 border-blue-500/20",
    PROPRIETARIO:
      "bg-violet-500/10 text-violet-400 border-violet-500/20",
    HOSPEDE:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    CORRETOR:
      "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };

  const nomes: Record<
    string,
    string
  > = {
    CLIENTE: "Cliente",
    PROPRIETARIO: "Proprietário",
    HOSPEDE: "Hóspede",
    CORRETOR: "Corretor",
  };

  const chave =
    tipo ?? "";

  return (
    <span
      className={`inline-flex rounded-lg border px-2.5 py-1 text-[10px] font-bold ${
        estilos[chave] ??
        "border-slate-700 bg-slate-800 text-slate-400"
      }`}
    >
      {nomes[chave] ??
        tipo ??
        "-"}
    </span>
  );
}

interface StatusBadgeProps {
  tipo:
    | "ativo"
    | "autorizado"
    | "neutro";
  texto: string;
}

function StatusBadge({
  tipo,
  texto,
}: StatusBadgeProps) {
  const estilos = {
    ativo:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    autorizado:
      "bg-amber-500/10 text-amber-400 border-amber-500/20",
    neutro:
      "bg-slate-800 text-slate-500 border-slate-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-bold ${estilos[tipo]}`}
    >

      <span
        className={`h-1.5 w-1.5 rounded-full ${
          tipo === "ativo"
            ? "bg-emerald-400"
            : tipo === "autorizado"
              ? "bg-amber-400"
              : "bg-slate-600"
        }`}
      />

      {texto}

    </span>
  );
}

// ============================================================
// ESTILOS
// ============================================================

const inputClass =
  "w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50";

export default Contatos;