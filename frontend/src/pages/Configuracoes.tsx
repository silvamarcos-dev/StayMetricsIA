import { useEffect, useState } from "react";

import {
  buscarConfiguracoes,
  atualizarConfiguracoes,
  conectarGoogleCalendar,
  buscarStatusGoogleCalendar,
} from "../api/api";


function Configuracoes() {

  // ============================================================
  // CONFIGURAÇÕES DA EMPRESA
  // ============================================================

  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [nomeSistema, setNomeSistema] = useState("");

  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [whatsappIdNumero, setWhatsappIdNumero] = useState("");


  // ============================================================
  // NOTIFICAÇÕES
  // ============================================================

  const [notificacoesEmail, setNotificacoesEmail] =
    useState(true);

  const [notificacoesWhatsapp, setNotificacoesWhatsapp] =
    useState(true);

  const [notificacoesAgenda, setNotificacoesAgenda] =
    useState(true);


  // ============================================================
  // IA
  // ============================================================

  const [automacaoIA, setAutomacaoIA] =
    useState(true);

  const [respostasAutomaticas, setRespostasAutomaticas] =
    useState(false);


  // ============================================================
  // SEGURANÇA / ESTADOS
  // ============================================================

  const [mostrarSenha, setMostrarSenha] =
    useState(false);

  const [salvando, setSalvando] =
    useState(false);

  const [carregando, setCarregando] =
    useState(true);


  // ============================================================
  // GOOGLE CALENDAR
  // ============================================================

  const [googleConectando, setGoogleConectando] =
    useState(false);

  const [googleConectado, setGoogleConectado] =
    useState(false);


  // ============================================================
  // CONECTAR GOOGLE CALENDAR
  // ============================================================

  function conectarGoogleAgenda() {

    if (
      googleConectado ||
      googleConectando
    ) {
      return;
    }

    setGoogleConectando(true);

    conectarGoogleCalendar();
  }


  // ============================================================
  // CARREGAR CONFIGURAÇÕES
  // ============================================================

  useEffect(() => {

    async function carregarDados() {

      try {

        // --------------------------------------------------------
        // CONFIGURAÇÕES
        // --------------------------------------------------------

        const configuracao =
          await buscarConfiguracoes();


        setNomeEmpresa(
          configuracao.nome_empresa ?? ""
        );


        setNomeSistema(
          configuracao.nome_sistema ?? ""
        );


        setEmail(
          configuracao.email ?? ""
        );


        setTelefone(
          configuracao.telefone ?? ""
        );


        setWhatsapp(
          configuracao.whatsapp ?? ""
        );


        setWhatsappIdNumero(
          configuracao.whatsapp_id_numero ?? ""
        );


        setNotificacoesEmail(
          configuracao.notificacoes_email
        );


        setNotificacoesWhatsapp(
          configuracao.notificacoes_whatsapp
        );


        setNotificacoesAgenda(
          configuracao.notificacoes_agenda
        );


        setAutomacaoIA(
          configuracao.automacao_ia
        );


        setRespostasAutomaticas(
          configuracao.respostas_automaticas
        );


        // --------------------------------------------------------
        // GOOGLE CALENDAR
        // --------------------------------------------------------

        await verificarGoogleCalendar();


      } catch (error) {

        console.error(
          "Erro ao carregar configurações:",
          error
        );


        alert(
          "Não foi possível carregar as configurações."
        );


      } finally {

        setCarregando(false);

      }

    }


    async function verificarGoogleCalendar() {

      try {

        const status =
          await buscarStatusGoogleCalendar();


        setGoogleConectado(
          status.conectado
        );


      } catch (error) {

        console.error(
          "Erro ao verificar Google Calendar:",
          error
        );


        setGoogleConectado(false);

      }

    }


    carregarDados();

  }, []);


  // ============================================================
  // TRATAR RETORNO DO GOOGLE OAUTH
  // ============================================================

  useEffect(() => {

    const parametros =
      new URLSearchParams(
        window.location.search
      );


    const google =
      parametros.get("google");


    if (
      google === "conectado" ||
      google === "erro"
    ) {

      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );

    }

  }, []);


  // ============================================================
  // SALVAR CONFIGURAÇÕES
  // ============================================================

  async function salvarConfiguracoes() {

    try {

      setSalvando(true);


      const configuracao =
        await atualizarConfiguracoes({

          nome_empresa:
            nomeEmpresa.trim(),

          nome_sistema:
            nomeSistema.trim(),

          email:
            email.trim() || null,

          telefone:
            telefone.trim() || null,

          whatsapp:
            whatsapp.trim() || null,

          whatsapp_id_numero:
            whatsappIdNumero.trim() || null,

          notificacoes_email:
            notificacoesEmail,

          notificacoes_whatsapp:
            notificacoesWhatsapp,

          notificacoes_agenda:
            notificacoesAgenda,

          automacao_ia:
            automacaoIA,

          respostas_automaticas:
            respostasAutomaticas,

        });


      // ========================================================
      // ATUALIZAR O ESTADO COM O QUE O BACKEND DEVOLVEU
      // ========================================================

      setNomeEmpresa(
        configuracao.nome_empresa ?? ""
      );


      setNomeSistema(
        configuracao.nome_sistema ?? ""
      );


      setEmail(
        configuracao.email ?? ""
      );


      setTelefone(
        configuracao.telefone ?? ""
      );


      setWhatsapp(
        configuracao.whatsapp ?? ""
      );


      setWhatsappIdNumero(
        configuracao.whatsapp_id_numero ?? ""
      );


      setNotificacoesEmail(
        configuracao.notificacoes_email
      );


      setNotificacoesWhatsapp(
        configuracao.notificacoes_whatsapp
      );


      setNotificacoesAgenda(
        configuracao.notificacoes_agenda
      );


      setAutomacaoIA(
        configuracao.automacao_ia
      );


      setRespostasAutomaticas(
        configuracao.respostas_automaticas
      );


      alert(
        "Configurações salvas com sucesso!"
      );


    } catch (error) {

      console.error(
        "Erro ao salvar configurações:",
        error
      );


      alert(
        "Não foi possível salvar as configurações."
      );


    } finally {

      setSalvando(false);

    }

  }


  // ============================================================
  // LOADING
  // ============================================================

  if (carregando) {

    return (

      <div className="flex min-h-[400px] items-center justify-center text-slate-400">

        Carregando configurações...

      </div>

    );

  }


  // ============================================================
  // INTERFACE
  // ============================================================

  return (

    <div className="space-y-6 text-slate-100">


      {/* ========================================================
          CABEÇALHO
      ======================================================== */}

      <div>

        <p className="text-sm font-medium text-blue-400">
          Sistema
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
          Configurações
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Gerencie as configurações do seu CRM.
        </p>

      </div>


      {/* ========================================================
          DADOS DA EMPRESA
      ======================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg">

        <div className="border-b border-slate-800 px-6 py-5">

          <h2 className="text-lg font-semibold text-white">
            Dados da imobiliária
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Informações utilizadas pelo sistema.
          </p>

        </div>


        <div className="grid gap-5 p-6 md:grid-cols-2">

          <Campo
            label="Nome da empresa"
            type="text"
            value={nomeEmpresa}
            onChange={setNomeEmpresa}
          />


          <Campo
            label="Nome do sistema"
            type="text"
            value={nomeSistema}
            onChange={setNomeSistema}
          />


          <Campo
            label="E-mail"
            type="email"
            value={email}
            onChange={setEmail}
          />


          <Campo
            label="Telefone"
            type="text"
            value={telefone}
            onChange={setTelefone}
          />

        </div>

      </section>


      {/* ========================================================
          WHATSAPP
      ======================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg">

        <div className="border-b border-slate-800 px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-lg">
              💬
            </div>


            <div>

              <h2 className="font-semibold text-white">
                WhatsApp
              </h2>

              <p className="text-sm text-slate-400">
                Configuração da integração com WhatsApp.
              </p>

            </div>

          </div>

        </div>


        <div className="p-6">

          <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4">

            <div>

              <p className="font-medium text-white">
                WhatsApp conectado
              </p>

              <p className="mt-1 text-sm text-slate-400">
                A integração está preparada para receber as credenciais da API.
              </p>

            </div>


            <span className="shrink-0 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
              Não configurado
            </span>

          </div>


          <div className="mt-5 grid gap-5 md:grid-cols-2">

            <Campo
              label="Número do WhatsApp"
              type="text"
              value={whatsapp}
              onChange={setWhatsapp}
              placeholder="+55 (44) 99999-9999"
            />


            <Campo
              label="ID do número"
              type="text"
              value={whatsappIdNumero}
              onChange={setWhatsappIdNumero}
              placeholder="ID do WhatsApp Business"
            />

          </div>

        </div>

      </section>


      {/* ========================================================
          GOOGLE AGENDA
      ======================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg">

        <div className="border-b border-slate-800 px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-lg">
              📅
            </div>


            <div>

              <h2 className="font-semibold text-white">
                Google Agenda
              </h2>

              <p className="text-sm text-slate-400">
                Sincronize os compromissos do CRM com o Google Calendar.
              </p>

            </div>

          </div>

        </div>


        <div className="p-6">

          <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4">

            <div>

              <p className="font-medium text-white">

                {googleConectado
                  ? "Google Calendar conectado"
                  : "Integração com Google Calendar"}

              </p>


              <p className="mt-1 text-sm text-slate-400">

                {googleConectado
                  ? "Sua conta Google está conectada e pronta para sincronizar sua agenda."
                  : "Conecte sua conta Google para sincronizar sua agenda."}

              </p>

            </div>


            {googleConectado ? (

              <span className="shrink-0 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">

                ✓ Conectado

              </span>

            ) : (

              <span className="shrink-0 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">

                Não conectado

              </span>

            )}

          </div>


          <button
            type="button"
            onClick={conectarGoogleAgenda}
            disabled={
              googleConectando ||
              googleConectado
            }
            className={`mt-5 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-lg transition ${
              googleConectado
                ? "cursor-default bg-emerald-600/20 text-emerald-400 shadow-none"
                : "bg-blue-600 shadow-blue-600/10 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            }`}
          >

            {googleConectado
              ? "✓ Google Agenda conectada"
              : googleConectando
                ? "Conectando..."
                : "Conectar Google Agenda"}

          </button>

        </div>

      </section>


      {/* ========================================================
          NOTIFICAÇÕES
      ======================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg">

        <div className="border-b border-slate-800 px-6 py-5">

          <h2 className="font-semibold text-white">
            Notificações
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Escolha quais eventos devem gerar notificações.
          </p>

        </div>


        <div className="divide-y divide-slate-800">

          <Toggle
            titulo="Notificações por e-mail"
            descricao="Receba atualizações importantes por e-mail."
            ativo={notificacoesEmail}
            onChange={setNotificacoesEmail}
          />


          <Toggle
            titulo="Notificações do WhatsApp"
            descricao="Receba alertas relacionados às conversas."
            ativo={notificacoesWhatsapp}
            onChange={setNotificacoesWhatsapp}
          />


          <Toggle
            titulo="Lembretes da agenda"
            descricao="Receba lembretes das apresentações agendadas."
            ativo={notificacoesAgenda}
            onChange={setNotificacoesAgenda}
          />

        </div>

      </section>


      {/* ========================================================
          IA
      ======================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg">

        <div className="border-b border-slate-800 px-6 py-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
              🤖
            </div>


            <div>

              <h2 className="font-semibold text-white">
                IA e automações
              </h2>

              <p className="text-sm text-slate-400">
                Configure os recursos inteligentes do CRM.
              </p>

            </div>

          </div>

        </div>


        <div className="divide-y divide-slate-800">

          <Toggle
            titulo="Assistente de IA"
            descricao="Permitir que o CRM utilize IA para auxiliar os corretores."
            ativo={automacaoIA}
            onChange={setAutomacaoIA}
          />


          <Toggle
            titulo="Respostas automáticas"
            descricao="Permitir respostas automáticas para determinados atendimentos."
            ativo={respostasAutomaticas}
            onChange={setRespostasAutomaticas}
          />

        </div>

      </section>


      {/* ========================================================
          SEGURANÇA
      ======================================================== */}

      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg">

        <div className="border-b border-slate-800 px-6 py-5">

          <h2 className="font-semibold text-white">
            Segurança
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Gerencie o acesso à sua conta.
          </p>

        </div>


        <div className="p-6">

          <div className="max-w-md">

            <label className="mb-2 block text-sm font-medium text-slate-300">
              Senha atual
            </label>


            <div className="relative">

              <input
                type={
                  mostrarSenha
                    ? "text"
                    : "password"
                }
                placeholder="Digite sua senha"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-20 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />


              <button
                type="button"
                onClick={() =>
                  setMostrarSenha(!mostrarSenha)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-blue-400 transition hover:text-blue-300"
              >

                {mostrarSenha
                  ? "Ocultar"
                  : "Mostrar"}

              </button>

            </div>

          </div>


          <button
            type="button"
            onClick={() =>
              alert(
                "Fluxo de alteração de senha em breve"
              )
            }
            className="mt-4 rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            Alterar senha
          </button>

        </div>

      </section>


      {/* ========================================================
          SALVAR
      ======================================================== */}

      <div className="flex justify-end">

        <button
          type="button"
          onClick={salvarConfiguracoes}
          disabled={salvando}
          className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >

          {salvando
            ? "Salvando..."
            : "Salvar configurações"}

        </button>

      </div>

    </div>

  );

}


/* ================================================================
   CAMPO
================================================================ */

interface CampoProps {
  label: string;
  type: string;
  value?: string;
  placeholder?: string;
  onChange?: (valor: string) => void;
}


function Campo({
  label,
  type,
  value,
  placeholder,
  onChange,
}: CampoProps) {

  return (

    <div>

      <label className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </label>


      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={
          onChange
            ? (event) =>
                onChange(event.target.value)
            : undefined
        }
        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      />

    </div>

  );

}


/* ================================================================
   TOGGLE
================================================================ */

interface ToggleProps {
  titulo: string;
  descricao: string;
  ativo: boolean;
  onChange: (valor: boolean) => void;
}


function Toggle({
  titulo,
  descricao,
  ativo,
  onChange,
}: ToggleProps) {

  return (

    <div className="flex items-center justify-between gap-6 p-6 transition hover:bg-slate-800/30">

      <div>

        <p className="font-medium text-white">
          {titulo}
        </p>

        <p className="mt-1 text-sm text-slate-400">
          {descricao}
        </p>

      </div>


      <button
        type="button"
        onClick={() =>
          onChange(!ativo)
        }
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          ativo
            ? "bg-blue-600"
            : "bg-slate-700"
        }`}
        aria-label={titulo}
        aria-pressed={ativo}
      >

        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            ativo
              ? "left-6"
              : "left-1"
          }`}
        />

      </button>

    </div>

  );

}


export default Configuracoes;