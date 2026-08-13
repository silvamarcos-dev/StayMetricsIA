
import { useState } from "react";

function Configuracoes() {
  const [nomeEmpresa, setNomeEmpresa] = useState("Aurion Imóveis");
  const [email, setEmail] = useState("contato@aurion.com");
  const [telefone, setTelefone] = useState("(44) 99999-9999");

  const [notificacoesEmail, setNotificacoesEmail] = useState(true);
  const [notificacoesWhatsapp, setNotificacoesWhatsapp] = useState(true);
  const [notificacoesAgenda, setNotificacoesAgenda] = useState(true);

  const [automacaoIA, setAutomacaoIA] = useState(true);
  const [respostasAutomaticas, setRespostasAutomaticas] =
    useState(false);

  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [salvando, setSalvando] = useState(false);

  function salvarConfiguracoes() {
    setSalvando(true);

    setTimeout(() => {
      setSalvando(false);
      alert("Configurações salvas com sucesso!");
    }, 800);
  }

  return (
    <div className="space-y-6">

      {/* CABEÇALHO */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Configurações
        </h1>

        <p className="mt-1 text-slate-500">
          Gerencie as configurações do seu CRM.
        </p>
      </div>

      {/* DADOS DA EMPRESA */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 p-6">

          <h2 className="text-lg font-semibold text-slate-900">
            Dados da imobiliária
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Informações utilizadas pelo sistema.
          </p>

        </div>

        <div className="grid gap-5 p-6 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Nome da empresa
            </label>

            <input
              type="text"
              value={nomeEmpresa}
              onChange={(event) =>
                setNomeEmpresa(event.target.value)
              }
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              E-mail
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Telefone
            </label>

            <input
              type="text"
              value={telefone}
              onChange={(event) =>
                setTelefone(event.target.value)
              }
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

        </div>

      </section>

      {/* WHATSAPP */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 p-6">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-lg">
              💬
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                WhatsApp
              </h2>

              <p className="text-sm text-slate-500">
                Configuração da integração com WhatsApp.
              </p>
            </div>

          </div>

        </div>

        <div className="p-6">

          <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">

            <div>

              <p className="font-medium text-slate-900">
                WhatsApp conectado
              </p>

              <p className="mt-1 text-sm text-slate-500">
                A integração está preparada para receber as credenciais da API.
              </p>

            </div>

            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
              Não configurado
            </span>

          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Número do WhatsApp
              </label>

              <input
                type="text"
                placeholder="+55 (44) 99999-9999"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                ID do número
              </label>

              <input
                type="text"
                placeholder="ID do WhatsApp Business"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

          </div>

        </div>

      </section>

      {/* NOTIFICAÇÕES */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 p-6">

          <h2 className="font-semibold text-slate-900">
            Notificações
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Escolha quais eventos devem gerar notificações.
          </p>

        </div>

        <div className="divide-y divide-slate-100">

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

      {/* IA E AUTOMAÇÕES */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 p-6">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100">
              🤖
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                IA e automações
              </h2>

              <p className="text-sm text-slate-500">
                Configure os recursos inteligentes do CRM.
              </p>
            </div>

          </div>

        </div>

        <div className="divide-y divide-slate-100">

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

      {/* SEGURANÇA */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 p-6">

          <h2 className="font-semibold text-slate-900">
            Segurança
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Gerencie o acesso à sua conta.
          </p>

        </div>

        <div className="p-6">

          <div className="max-w-md">

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Senha atual
            </label>

            <div className="relative">

              <input
                type={mostrarSenha ? "text" : "password"}
                placeholder="Digite sua senha"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 pr-20 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <button
                type="button"
                onClick={() =>
                  setMostrarSenha(!mostrarSenha)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                {mostrarSenha ? "Ocultar" : "Mostrar"}
              </button>

            </div>

          </div>

          <button
            onClick={() =>
              alert("Fluxo de alteração de senha em breve")
            }
            className="mt-4 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Alterar senha
          </button>

        </div>

      </section>

      {/* SALVAR */}
      <div className="flex justify-end">

        <button
          onClick={salvarConfiguracoes}
          disabled={salvando}
          className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {salvando
            ? "Salvando..."
            : "Salvar configurações"}
        </button>

      </div>

    </div>
  );
}

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
    <div className="flex items-center justify-between gap-6 p-6">

      <div>

        <p className="font-medium text-slate-900">
          {titulo}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {descricao}
        </p>

      </div>

      <button
        type="button"
        onClick={() => onChange(!ativo)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          ativo
            ? "bg-blue-600"
            : "bg-slate-300"
        }`}
        aria-label={titulo}
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

