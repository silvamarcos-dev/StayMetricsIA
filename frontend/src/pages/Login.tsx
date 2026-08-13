
import { useState } from "react";
import type { FormEvent } from "react";

import {
  login,
  salvarToken,
} from "../api/api";

interface LoginProps {
  onLogin: () => void;
}

function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [carregando, setCarregando] =
    useState(false);

  const [erro, setErro] = useState("");

  async function handleLogin(
    evento: FormEvent<HTMLFormElement>
  ) {
    evento.preventDefault();

    setErro("");

    if (!email.trim()) {
      setErro("Informe seu e-mail.");
      return;
    }

    if (!senha) {
      setErro("Informe sua senha.");
      return;
    }

    try {
      setCarregando(true);

      const resposta = await login(
        email,
        senha
      );

      salvarToken(
        resposta.access_token
      );

      onLogin();

    } catch (error) {
      console.error(error);

      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível realizar o login."
      );

    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">

      {/* =====================================================
          PAINEL INSTITUCIONAL
      ===================================================== */}

      <section className="relative hidden min-h-screen overflow-hidden bg-slate-950 lg:flex lg:w-[52%]">

        {/* ELEMENTOS DECORATIVOS */}

        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="absolute -bottom-40 -right-20 h-500px w-500px rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />

        <div className="absolute left-1/2 top-1/2 h-500px w-500px -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5" />


        <div className="relative z-10 flex w-full flex-col justify-between p-14">

          {/* MARCA */}

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-lg font-black text-slate-950 shadow-xl">
              A
            </div>

            <div>

              <p className="text-xl font-bold tracking-tight text-white">
                Stay Metrics IA
              </p>

              <p className="text-xs font-medium text-slate-400">
                By Aurion System 
              </p>

            </div>

          </div>


          {/* CONTEÚDO */}

          <div className="max-w-xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">

              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              <span className="text-xs font-medium text-slate-300">
                Gestão inteligente
              </span>

            </div>


            <h1 className="text-5xl font-bold leading-[1.08] tracking-tight text-white xl:text-6xl">

              Tudo o que sua
              empresa precisa,
              <span className="text-blue-400">
                {" "}em um só lugar.
              </span>

            </h1>


            <p className="mt-7 max-w-lg text-base leading-7 text-slate-400">

              Centralize clientes, atendimento,
              vendas, agenda e relatórios em uma
              plataforma criada para simplificar
              a gestão do seu negócio.

            </p>


            {/* INDICADORES */}

            <div className="mt-10 flex gap-10">

              <div>

                <p className="text-2xl font-bold text-white">
                  CRM
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Gestão de clientes
                </p>

              </div>


              <div>

                <p className="text-2xl font-bold text-white">
                  IA
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Inteligência integrada
                </p>

              </div>


              <div>

                <p className="text-2xl font-bold text-white">
                  24/7
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Acesso ao sistema
                </p>

              </div>

            </div>

          </div>


          {/* RODAPÉ */}

          <div className="flex items-center justify-between border-t border-white/10 pt-6">

            <p className="text-xs text-slate-500">
              Aurion System
            </p>

            <p className="text-xs text-slate-600">
              Gestão inteligente
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          ÁREA DE LOGIN
      ===================================================== */}

      <main className="flex min-h-screen flex-1 items-center justify-center px-6 py-12">

        <div className="w-full max-w-420px">

          {/* LOGO MOBILE */}

          <div className="mb-10 flex items-center gap-3 lg:hidden">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-lg font-black text-white">
              A
            </div>

            <div>

              <p className="text-xl font-bold tracking-tight text-slate-950">
                Aurion
              </p>

              <p className="text-xs font-medium text-slate-400">
                CRM
              </p>

            </div>

          </div>


          {/* CABEÇALHO */}

          <div className="mb-8">

            <p className="mb-3 text-sm font-semibold text-blue-600">
              Acesso ao sistema
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-slate-950">
              Bem-vindo de volta.
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Entre com suas credenciais para
              acessar o Stay Metrics IA.
            </p>

          </div>


          {/* CARD */}

          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.18)] sm:p-8">

            {/* ERRO */}

            {erro && (

              <div className="mb-6 flex gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3.5">

                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
                  !
                </div>

                <p className="text-sm leading-5 text-red-700">
                  {erro}
                </p>

              </div>

            )}


            {/* FORMULÁRIO */}

            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

              {/* E-MAIL */}

              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  E-mail
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(evento) =>
                    setEmail(
                      evento.target.value
                    )
                  }
                  placeholder="seu@email.com"
                  autoComplete="email"
                  disabled={carregando}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                />

              </div>


              {/* SENHA */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="senha"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Senha
                  </label>

                </div>

                <input
                  id="senha"
                  type="password"
                  value={senha}
                  onChange={(evento) =>
                    setSenha(
                      evento.target.value
                    )
                  }
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  disabled={carregando}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                />

              </div>


              {/* BOTÃO */}

              <button
                type="submit"
                disabled={carregando}
                className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-blue-600/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >

                {carregando ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                    Entrando...
                  </>
                ) : (
                  <>
                    Entrar

                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </>
                )}

              </button>

            </form>

          </div>


          {/* RODAPÉ */}

          <div className="mt-7 text-center">

            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} Aurion System. Todos os direitos reservados.
            </p>

            <p className="mt-1 text-[11px] text-slate-300">
              Plataforma de gestão Airbnb
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Login;

