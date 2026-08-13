import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import {
  listarConversas,
  listarMensagens,
  enviarMensagem as enviarMensagemApi,
  enviarArquivo,
  enviarAudio,
  conectarWhatsApp as conectarWhatsAppRequest,
  statusWhatsApp,
  type Conversa,
  type Mensagem,
} from "../api/api";

type FiltroConversa =
  | "todas"
  | "naoLidas"
  | "favoritas";

function Chat() {
  // ============================================================
  // DADOS
  // ============================================================

  const [conversas, setConversas] =
    useState<Conversa[]>([]);

  const [
    conversaSelecionada,
    setConversaSelecionada,
  ] = useState<Conversa | null>(null);

  const [mensagens, setMensagens] =
    useState<Mensagem[]>([]);

  const [mensagem, setMensagem] =
    useState("");

  const [arquivo, setArquivo] =
    useState<File | null>(null);

  const [gravandoAudio, setGravandoAudio] =
    useState(false);

  const [
    carregandoConversas,
    setCarregandoConversas,
  ] = useState(true);

  const [
    carregandoMensagens,
    setCarregandoMensagens,
  ] = useState(false);

  const [enviando, setEnviando] =
    useState(false);

  // ============================================================
  // UI
  // ============================================================

  const [busca, setBusca] =
    useState("");

  const [filtro, setFiltro] =
    useState<FiltroConversa>("todas");

  const [mostrarDetalhes, setMostrarDetalhes] =
    useState(true);

  const [favoritas, setFavoritas] =
    useState<number[]>([]);

  const [darkMode, setDarkMode] =
    useState(() => {
      return (
        localStorage.getItem("theme") ===
        "dark"
      );
    });

  // ============================================================
  // WHATSAPP
  // ============================================================

  const [
    whatsappConectado,
    setWhatsappConectado,
  ] = useState(false);

  const [
    conectandoWhatsApp,
    setConectandoWhatsApp,
  ] = useState(false);

  const [qrCode, setQrCode] =
    useState<string | null>(null);

  const [erroWhatsApp, setErroWhatsApp] =
    useState<string | null>(null);

  // ============================================================
  // REFS
  // ============================================================

  const mediaRecorderRef =
    useRef<MediaRecorder | null>(null);

  const audioChunksRef =
    useRef<Blob[]>([]);

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const mensagensContainerRef =
    useRef<HTMLDivElement | null>(null);

  // ============================================================
  // DARK MODE
  // ============================================================

  useEffect(() => {
    const root =
      document.documentElement;

    if (darkMode) {
      root.classList.add("dark");

      localStorage.setItem(
        "theme",
        "dark"
      );
    } else {
      root.classList.remove("dark");

      localStorage.setItem(
        "theme",
        "light"
      );
    }
  }, [darkMode]);

  // ============================================================
  // CONECTAR WHATSAPP
  // ============================================================

  async function conectarWhatsApp() {
    if (conectandoWhatsApp) {
      return;
    }

    try {
      setConectandoWhatsApp(true);
      setErroWhatsApp(null);

      const dados =
        await conectarWhatsAppRequest();

      if (dados.base64) {
        setQrCode(dados.base64);
      } else {
        setErroWhatsApp(
          "A Evolution API não retornou um QR Code. Tente novamente."
        );
      }
    } catch (error) {
      console.error(
        "Erro ao conectar WhatsApp:",
        error
      );

      setErroWhatsApp(
        "Não foi possível iniciar a conexão com o WhatsApp."
      );
    } finally {
      setConectandoWhatsApp(false);
    }
  }

  // ============================================================
  // STATUS WHATSAPP
  // ============================================================

  useEffect(() => {
    let ativo = true;

    async function verificar() {
      try {
        const dados =
          await statusWhatsApp();

        if (!ativo) {
          return;
        }

        const estado =
          dados.instance?.state;

        const conectado =
          estado === "open";

        setWhatsappConectado(
          conectado
        );

        if (conectado) {
          setQrCode(null);
          setErroWhatsApp(null);
        }
      } catch (error) {
        if (!ativo) {
          return;
        }

        console.error(
          "Erro ao verificar status do WhatsApp:",
          error
        );

        setWhatsappConectado(false);
      }
    }

    verificar();

    const intervalo =
      window.setInterval(
        verificar,
        5000
      );

    return () => {
      ativo = false;

      window.clearInterval(
        intervalo
      );
    };
  }, []);

  // ============================================================
  // CONVERSAS
  // ============================================================

  useEffect(() => {
    let ativo = true;

    async function carregarConversas() {
      try {
        const dados =
          await listarConversas();

        if (!ativo) {
          return;
        }

        setConversas(dados);

        setConversaSelecionada(
          (atual) => {
            if (atual) {
              const atualizada =
                dados.find(
                  (conversa) =>
                    conversa.id ===
                    atual.id
                );

              return (
                atualizada ??
                atual
              );
            }

            return dados.length > 0
              ? dados[0]
              : null;
          }
        );
      } catch (error) {
        if (!ativo) {
          return;
        }

        console.error(
          "Erro ao carregar conversas:",
          error
        );
      } finally {
        if (ativo) {
          setCarregandoConversas(
            false
          );
        }
      }
    }

    carregarConversas();

    const intervalo =
      window.setInterval(
        carregarConversas,
        5000
      );

    return () => {
      ativo = false;

      window.clearInterval(
        intervalo
      );
    };
  }, []);

  // ============================================================
  // MENSAGENS
  // ============================================================

  const conversaSelecionadaId =
    conversaSelecionada?.id ?? null;

  useEffect(() => {
    let ativo = true;

    async function carregarMensagens() {
      if (
        conversaSelecionadaId ===
        null
      ) {
        setMensagens([]);
        return;
      }

      try {
        if (ativo) {
          setCarregandoMensagens(
            true
          );
        }

        const dados =
          await listarMensagens(
            conversaSelecionadaId
          );

        if (!ativo) {
          return;
        }

        setMensagens(dados);
      } catch (error) {
        if (!ativo) {
          return;
        }

        console.error(
          "Erro ao carregar mensagens:",
          error
        );
      } finally {
        if (ativo) {
          setCarregandoMensagens(
            false
          );
        }
      }
    }

    carregarMensagens();

    const intervalo =
      window.setInterval(
        carregarMensagens,
        3000
      );

    return () => {
      ativo = false;

      window.clearInterval(
        intervalo
      );
    };
  }, [conversaSelecionadaId]);

  // ============================================================
  // SCROLL
  // ============================================================

  useEffect(() => {
    const container =
      mensagensContainerRef.current;

    if (!container) {
      return;
    }

    container.scrollTop =
      container.scrollHeight;
  }, [
    mensagens,
    conversaSelecionadaId,
  ]);

  // ============================================================
  // BUSCA / FILTROS
  // ============================================================

  const conversasFiltradas =
    conversas.filter((conversa) => {
      const termo =
        busca.trim().toLowerCase();

      const correspondeBusca =
        !termo ||
        conversa.nome
          .toLowerCase()
          .includes(termo) ||
        conversa.ultimaMensagem
          .toLowerCase()
          .includes(termo);

      if (!correspondeBusca) {
        return false;
      }

      if (
        filtro === "naoLidas"
      ) {
        return conversa.naoLidas > 0;
      }

      if (
        filtro === "favoritas"
      ) {
        return favoritas.includes(
          conversa.id
        );
      }

      return true;
    });

  const totalNaoLidas =
    conversas.reduce(
      (total, conversa) =>
        total + conversa.naoLidas,
      0
    );

  // ============================================================
  // FAVORITAR
  // ============================================================

  function alternarFavorita(
    conversaId: number
  ) {
    setFavoritas((atuais) =>
      atuais.includes(conversaId)
        ? atuais.filter(
            (id) =>
              id !== conversaId
          )
        : [
            ...atuais,
            conversaId,
          ]
    );
  }

  // ============================================================
  // ENVIAR MENSAGEM
  // ============================================================

  async function handleEnviarMensagem() {
    const texto =
      mensagem.trim();

    if (
      !texto ||
      !conversaSelecionada ||
      enviando
    ) {
      return;
    }

    const conversaAtual =
      conversaSelecionada;

    try {
      setEnviando(true);

      const novaMensagem =
        await enviarMensagemApi(
          conversaAtual.id,
          texto
        );

      setMensagens((atuais) => [
        ...atuais,
        novaMensagem,
      ]);

      setConversas((atuais) =>
        atuais.map(
          (conversa) =>
            conversa.id ===
            conversaAtual.id
              ? {
                  ...conversa,
                  ultimaMensagem:
                    texto,
                  horario:
                    novaMensagem.horario,
                }
              : conversa
        )
      );

      setConversaSelecionada(
        (atual) => {
          if (!atual) {
            return atual;
          }

          return {
            ...atual,
            ultimaMensagem:
              texto,
            horario:
              novaMensagem.horario,
          };
        }
      );

      setMensagem("");
    } catch (error) {
      console.error(
        "Erro ao enviar mensagem:",
        error
      );

      alert(
        "Não foi possível enviar a mensagem."
      );
    } finally {
      setEnviando(false);
    }
  }

  // ============================================================
  // ARQUIVO
  // ============================================================

  function abrirSeletorArquivo() {
    fileInputRef.current?.click();
  }

  function selecionarArquivo(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setArquivo(file);

    event.target.value = "";
  }

  async function handleEnviarArquivo() {
    if (
      !arquivo ||
      !conversaSelecionada ||
      enviando
    ) {
      return;
    }

    const conversaAtual =
      conversaSelecionada;

    const arquivoAtual =
      arquivo;

    try {
      setEnviando(true);

      const novaMensagem =
        await enviarArquivo(
          conversaAtual.id,
          arquivoAtual
        );

      setMensagens((atuais) => [
        ...atuais,
        novaMensagem,
      ]);

      setConversas((atuais) =>
        atuais.map(
          (conversa) =>
            conversa.id ===
            conversaAtual.id
              ? {
                  ...conversa,
                  ultimaMensagem:
                    `📎 ${arquivoAtual.name}`,
                  horario:
                    novaMensagem.horario,
                }
              : conversa
        )
      );

      setConversaSelecionada(
        (atual) => {
          if (!atual) {
            return atual;
          }

          return {
            ...atual,
            ultimaMensagem:
              `📎 ${arquivoAtual.name}`,
            horario:
              novaMensagem.horario,
          };
        }
      );

      setArquivo(null);
    } catch (error) {
      console.error(
        "Erro ao enviar arquivo:",
        error
      );

      alert(
        "Não foi possível enviar o arquivo."
      );
    } finally {
      setEnviando(false);
    }
  }

  // ============================================================
  // ÁUDIO
  // ============================================================

  async function iniciarGravacao() {
    if (
      !conversaSelecionada ||
      enviando
    ) {
      return;
    }

    const conversaAtual =
      conversaSelecionada;

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            audio: true,
          }
        );

      const mediaRecorder =
        new MediaRecorder(
          stream
        );

      mediaRecorderRef.current =
        mediaRecorder;

      audioChunksRef.current =
        [];

      mediaRecorder.ondataavailable =
        (event: BlobEvent) => {
          if (
            event.data.size > 0
          ) {
            audioChunksRef.current.push(
              event.data
            );
          }
        };

      mediaRecorder.onstop =
        async () => {
          const audioBlob =
            new Blob(
              audioChunksRef.current,
              {
                type: "audio/webm",
              }
            );

          try {
            setEnviando(true);

            const novaMensagem =
              await enviarAudio(
                conversaAtual.id,
                audioBlob
              );

            setMensagens(
              (atuais) => [
                ...atuais,
                novaMensagem,
              ]
            );

            setConversas(
              (atuais) =>
                atuais.map(
                  (conversa) =>
                    conversa.id ===
                    conversaAtual.id
                      ? {
                          ...conversa,
                          ultimaMensagem:
                            "🎤 Áudio",
                          horario:
                            novaMensagem.horario,
                        }
                      : conversa
                )
            );

            setConversaSelecionada(
              (atual) => {
                if (!atual) {
                  return atual;
                }

                return {
                  ...atual,
                  ultimaMensagem:
                    "🎤 Áudio",
                  horario:
                    novaMensagem.horario,
                };
              }
            );
          } catch (error) {
            console.error(
              "Erro ao enviar áudio:",
              error
            );

            alert(
              "Não foi possível enviar o áudio."
            );
          } finally {
            setEnviando(false);

            stream
              .getTracks()
              .forEach(
                (track) =>
                  track.stop()
              );

            mediaRecorderRef.current =
              null;

            audioChunksRef.current =
              [];
          }
        };

      mediaRecorder.start();

      setGravandoAudio(true);
    } catch (error) {
      console.error(
        "Erro ao acessar microfone:",
        error
      );

      alert(
        "Não foi possível acessar o microfone."
      );
    }
  }

  function pararGravacao() {
    const recorder =
      mediaRecorderRef.current;

    if (
      recorder &&
      recorder.state !==
        "inactive"
    ) {
      recorder.stop();
    }

    setGravandoAudio(false);
  }

  function alternarGravacao() {
    if (gravandoAudio) {
      pararGravacao();
    } else {
      iniciarGravacao();
    }
  }

  // ============================================================
  // LOADING
  // ============================================================

  if (carregandoConversas) {
    return (
      <div className="flex h-[calc(100vh-120px)] items-center justify-center rounded-2xl border border-slate-200 bg-white transition-colors dark:border-slate-800 dark:bg-slate-950">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600 dark:border-slate-800 dark:border-t-blue-500" />

          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Carregando atendimento
          </p>

          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            Conectando ao CRM...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // INTERFACE
  // ============================================================

  return (
    <div className="flex h-[calc(100vh-120px)] min-h-650px overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-950">

      {/* ========================================================
          SIDEBAR
      ======================================================== */}

      <aside className="flex w-340px shrink-0 flex-col border-r border-slate-200 bg-white transition-colors dark:border-slate-800 dark:bg-slate-950">

        {/* HEADER */}

        <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">

          <div className="flex items-center justify-between">

            <div>
              <div className="flex items-center gap-2">

                <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                  Conversas
                </h1>

                {totalNaoLidas > 0 && (
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                    {totalNaoLidas}
                  </span>
                )}

              </div>

              <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                Central de atendimento
              </p>
            </div>

            {/* STATUS */}

            <div className="flex items-center gap-2 rounded-full border border-slate-200 px-2.5 py-1.5 dark:border-slate-800">

              <span
                className={`h-2 w-2 rounded-full ${
                  whatsappConectado
                    ? "bg-emerald-500"
                    : "bg-red-500"
                }`}
              />

              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                {whatsappConectado
                  ? "WhatsApp"
                  : "Offline"}
              </span>

            </div>

          </div>

          {/* BUSCA */}

          <div className="relative mt-4">

            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 dark:text-slate-600">
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
              placeholder="Buscar conversa..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-600 dark:focus:border-blue-500 dark:focus:bg-slate-900 dark:focus:ring-blue-950"
            />

          </div>

          {/* FILTROS */}

          <div className="mt-3 flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-900">

            <FiltroButton
              ativo={filtro === "todas"}
              onClick={() =>
                setFiltro("todas")
              }
            >
              Todas
            </FiltroButton>

            <FiltroButton
              ativo={
                filtro === "naoLidas"
              }
              onClick={() =>
                setFiltro("naoLidas")
              }
            >
              Não lidas
            </FiltroButton>

            <FiltroButton
              ativo={
                filtro === "favoritas"
              }
              onClick={() =>
                setFiltro("favoritas")
              }
            >
              Favoritas
            </FiltroButton>

          </div>

        </div>

        {/* WHATSAPP NÃO CONECTADO */}

        {!whatsappConectado && (
          <div className="border-b border-slate-200 bg-amber-50/60 p-3 dark:border-slate-800 dark:bg-amber-950/20">

            <button
              type="button"
              onClick={
                conectarWhatsApp
              }
              disabled={
                conectandoWhatsApp
              }
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span>●</span>

              {conectandoWhatsApp
                ? "Conectando..."
                : "Conectar WhatsApp"}
            </button>

            {erroWhatsApp && (
              <p className="mt-2 text-center text-[11px] text-red-600 dark:text-red-400">
                {erroWhatsApp}
              </p>
            )}

            {qrCode && (
              <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-900">

                <p className="mb-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Escaneie com o WhatsApp
                </p>

                <img
                  src={
                    qrCode.startsWith(
                      "data:"
                    )
                      ? qrCode
                      : `data:image/png;base64,${qrCode}`
                  }
                  alt="QR Code do WhatsApp"
                  className="mx-auto h-48 w-48 rounded-lg"
                />

              </div>
            )}

          </div>
        )}

        {/* LISTA */}

        <div className="flex-1 overflow-y-auto">

          {conversasFiltradas.length ===
          0 ? (

            <div className="flex h-full items-center justify-center p-6 text-center">

              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl dark:bg-slate-900">
                  {busca
                    ? "⌕"
                    : "💬"}
                </div>

                <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {busca
                    ? "Nenhuma conversa encontrada"
                    : "Nenhuma conversa"}
                </p>

                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  {busca
                    ? "Tente buscar por outro nome."
                    : "As novas conversas aparecerão aqui."}
                </p>
              </div>

            </div>

          ) : (

            conversasFiltradas.map(
              (conversa) => {
                const selecionada =
                  conversaSelecionada?.id ===
                  conversa.id;

                const favorita =
                  favoritas.includes(
                    conversa.id
                  );

                return (
                  <div
                    key={conversa.id}
                    onClick={() =>
                      setConversaSelecionada(
                        conversa
                      )
                    }
                    className={`group flex w-full cursor-pointer gap-3 border-b border-slate-100 px-4 py-3.5 text-left transition dark:border-slate-900 ${
                      selecionada
                        ? "bg-blue-50/70 dark:bg-blue-950/40"
                        : "hover:bg-slate-50 dark:hover:bg-slate-900"
                    }`}
                  >

                    {/* AVATAR */}

                    <div className="relative shrink-0">

                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold ${
                          selecionada
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {conversa.nome
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      {conversa.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-950" />
                      )}

                    </div>

                    {/* INFORMAÇÕES */}

                    <div className="min-w-0 flex-1">

                      <div className="flex items-center justify-between gap-2">

                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {conversa.nome}
                        </p>

                        <span className="shrink-0 text-[11px] text-slate-400 dark:text-slate-500">
                          {conversa.horario}
                        </span>

                      </div>

                      <div className="mt-1 flex items-center gap-2">

                        <p className="min-w-0 flex-1 truncate text-xs text-slate-500 dark:text-slate-500">
                          {conversa.ultimaMensagem}
                        </p>

                        {conversa.naoLidas >
                          0 && (
                          <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-bold text-white">
                            {conversa.naoLidas}
                          </span>
                        )}

                      </div>

                    </div>

                    {/* FAVORITO */}

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();

                        alternarFavorita(
                          conversa.id
                        );
                      }}
                      className={`self-start text-sm transition ${
                        favorita
                          ? "text-amber-400"
                          : "text-slate-300 opacity-0 group-hover:opacity-100 dark:text-slate-700"
                      }`}
                      aria-label="Favoritar conversa"
                    >
                      ★
                    </button>

                  </div>
                );
              }
            )
          )}

        </div>

      </aside>

      {/* ========================================================
          ÁREA PRINCIPAL
      ======================================================== */}

      <section className="flex min-w-0 flex-1 flex-col">

        {!conversaSelecionada ? (

          <div className="flex flex-1 items-center justify-center bg-slate-50 dark:bg-slate-950">

            <div className="text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                💬
              </div>

              <h2 className="mt-4 text-base font-semibold text-slate-800 dark:text-slate-200">
                Selecione uma conversa
              </h2>

              <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                Escolha um atendimento para começar.
              </p>

            </div>

          </div>

        ) : (

          <>

            {/* ==================================================
                HEADER DO CLIENTE
            ================================================== */}

            <header className="flex h-72px shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 dark:border-slate-800 dark:bg-slate-950">

              <div className="flex items-center gap-3">

                <div className="relative">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                    {conversaSelecionada.nome
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  {conversaSelecionada.online && (
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-950" />
                  )}

                </div>

                <div>

                  <div className="flex items-center gap-2">

                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                      {conversaSelecionada.nome}
                    </h2>

                    {favoritas.includes(
                      conversaSelecionada.id
                    ) && (
                      <span className="text-xs text-amber-400">
                        ★
                      </span>
                    )}

                  </div>

                  <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                    {conversaSelecionada.online
                      ? "Online agora"
                      : "Offline"}
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-2">

                {/* TEMA */}

                <button
                  type="button"
                  onClick={() =>
                    setDarkMode(
                      (atual) =>
                        !atual
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-sm text-slate-500 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
                  title={
                    darkMode
                      ? "Ativar modo claro"
                      : "Ativar modo escuro"
                  }
                >
                  {darkMode
                    ? "☀"
                    : "☾"}
                </button>

                {/* CLIENTE */}

                <button
                  type="button"
                  className="hidden rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 lg:block"
                >
                  Ver cliente
                </button>

                {/* DETALHES */}

                <button
                  type="button"
                  onClick={() =>
                    setMostrarDetalhes(
                      (atual) => !atual
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-sm text-slate-500 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
                  title="Detalhes do cliente"
                >
                  ⋮
                </button>

              </div>

            </header>

            {/* ==================================================
                CORPO
            ================================================== */}

            <div className="flex min-h-0 flex-1">

              {/* MENSAGENS */}

              <div
                ref={
                  mensagensContainerRef
                }
                className="flex-1 overflow-y-auto bg-[#f8fafc] dark:bg-slate-950"
              >

                <div className="mx-auto max-w-4xl space-y-4 p-6">

                  {/* DATA */}

                  {mensagens.length >
                    0 && (
                    <div className="flex items-center gap-3 py-2">

                      <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />

                      <span className="rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:text-slate-500 dark:ring-slate-800">
                        Hoje
                      </span>

                      <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />

                    </div>
                  )}

                  {carregandoMensagens ? (

                    <div className="flex min-h-300px items-center justify-center">

                      <div className="text-center">

                        <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600 dark:border-slate-800 dark:border-t-blue-500" />

                        <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
                          Carregando mensagens...
                        </p>

                      </div>

                    </div>

                  ) : mensagens.length ===
                    0 ? (

                    <div className="flex min-h-400px items-center justify-center">

                      <div className="text-center">

                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                          👋
                        </div>

                        <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                          Início da conversa
                        </p>

                        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                          Envie uma mensagem para começar o atendimento.
                        </p>

                      </div>

                    </div>

                  ) : (

                    mensagens.map(
                      (msg) => {

                        const enviada =
                          msg.direcao ===
                          "enviada";

                        return (
                          <div
                            key={msg.id}
                            className={`flex ${
                              enviada
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >

                            <div
                              className={`max-w-[70%] ${
                                enviada
                                  ? "items-end"
                                  : "items-start"
                              }`}
                            >

                              <div
                                className={`rounded-2xl px-4 py-3 shadow-sm ${
                                  enviada
                                    ? "rounded-br-md bg-blue-600 text-white"
                                    : "rounded-bl-md border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                }`}
                              >

                                {msg.tipo ===
                                  "audio" &&
                                msg.audioUrl ? (

                                  <audio
                                    controls
                                    src={
                                      msg.audioUrl
                                    }
                                    className="max-w-260px"
                                  />

                                ) : msg.tipo ===
                                    "arquivo" &&
                                  msg.arquivoUrl ? (

                                  <a
                                    href={
                                      msg.arquivoUrl
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`flex items-center gap-2 text-sm font-medium underline ${
                                      enviada
                                        ? "text-white"
                                        : "text-blue-600 dark:text-blue-400"
                                    }`}
                                  >
                                    <span>
                                      📎
                                    </span>

                                    <span>
                                      {msg.texto ??
                                        "Abrir arquivo"}
                                    </span>
                                  </a>

                                ) : (

                                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                                    {
                                      msg.texto
                                    }
                                  </p>

                                )}

                                <div
                                  className={`mt-1.5 flex items-center justify-end gap-1 text-[10px] ${
                                    enviada
                                      ? "text-blue-100"
                                      : "text-slate-400 dark:text-slate-500"
                                  }`}
                                >
                                  <span>
                                    {
                                      msg.horario
                                    }
                                  </span>

                                  {enviada && (
                                    <span>
                                      ✓✓
                                    </span>
                                  )}

                                </div>

                              </div>

                            </div>

                          </div>
                        );
                      }
                    )
                  )}

                </div>

              </div>

              {/* ==================================================
                  PAINEL CRM
              ================================================== */}

              {mostrarDetalhes && (
                <aside className="hidden w-280px shrink-0 overflow-y-auto border-l border-slate-200 bg-white transition-colors dark:border-slate-800 dark:bg-slate-950 xl:block">

                  {/* CLIENTE */}

                  <div className="border-b border-slate-200 p-5 dark:border-slate-800">

                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Cliente
                    </p>

                    <div className="mt-4 flex flex-col items-center text-center">

                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                        {conversaSelecionada.nome
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                        {conversaSelecionada.nome}
                      </h3>

                      <span className="mt-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                        Lead ativo
                      </span>

                    </div>

                  </div>

                  {/* INFORMAÇÕES */}

                  <div className="border-b border-slate-200 p-5 dark:border-slate-800">

                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Informações
                    </p>

                    <div className="mt-4 space-y-4">

                      <InfoItem
                        label="Status"
                        value={
                          conversaSelecionada.online
                            ? "Online"
                            : "Offline"
                        }
                      />

                      <InfoItem
                        label="Canal"
                        value="WhatsApp"
                      />

                      <InfoItem
                        label="Atendimento"
                        value="Em andamento"
                      />

                      <InfoItem
                        label="Última mensagem"
                        value={
                          conversaSelecionada.horario
                        }
                      />

                    </div>

                  </div>

                  {/* TAGS */}

                  <div className="border-b border-slate-200 p-5 dark:border-slate-800">

                    <div className="flex items-center justify-between">

                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Tags
                      </p>

                      <button
                        type="button"
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        +
                      </button>

                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">

                      <span className="rounded-md bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                        WhatsApp
                      </span>

                      <span className="rounded-md bg-violet-50 px-2 py-1 text-[10px] font-semibold text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
                        Lead
                      </span>

                    </div>

                  </div>

                  {/* AÇÕES */}

                  <div className="p-5">

                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Ações
                    </p>

                    <div className="mt-3 space-y-2">

                      <button
                        type="button"
                        className="flex w-full items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 text-left text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
                      >
                        <span>👤</span>
                        Ver cadastro
                      </button>

                      <button
                        type="button"
                        className="flex w-full items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 text-left text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
                      >
                        <span>📋</span>
                        Criar atividade
                      </button>

                      <button
                        type="button"
                        className="flex w-full items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 text-left text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
                      >
                        <span>🏠</span>
                        Imóveis de interesse
                      </button>

                    </div>

                  </div>

                </aside>
              )}

            </div>

            {/* ==================================================
                COMPOSER
            ================================================== */}

            <div className="border-t border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">

              <div className="mx-auto max-w-4xl">

                {/* ARQUIVO SELECIONADO */}

                {arquivo && (
                  <div className="mb-3 flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50 px-3 py-2.5 dark:border-blue-900 dark:bg-blue-950/30">

                    <div className="flex min-w-0 items-center gap-2">

                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white text-sm dark:bg-slate-900">
                        📎
                      </span>

                      <span className="truncate text-xs font-semibold text-blue-700 dark:text-blue-400">
                        {arquivo.name}
                      </span>

                    </div>

                    <div className="flex items-center gap-3">

                      <button
                        type="button"
                        onClick={
                          handleEnviarArquivo
                        }
                        disabled={
                          enviando
                        }
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 disabled:opacity-50 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Enviar
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setArquivo(
                            null
                          )
                        }
                        disabled={
                          enviando
                        }
                        className="text-lg leading-none text-slate-400 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-300"
                      >
                        ×
                      </button>

                    </div>

                  </div>
                )}

                <input
                  ref={
                    fileInputRef
                  }
                  type="file"
                  accept=".pdf,.xlsx,.png,.jpg,.jpeg"
                  onChange={
                    selecionarArquivo
                  }
                  className="hidden"
                />

                {/* INPUT */}

                <div
                  className={`flex items-end gap-2 rounded-xl border bg-white p-2 transition dark:bg-slate-900 ${
                    gravandoAudio
                      ? "border-red-200 ring-2 ring-red-50 dark:border-red-900 dark:ring-red-950"
                      : "border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50 dark:border-slate-800 dark:focus-within:border-blue-500 dark:focus-within:ring-blue-950"
                  }`}
                >

                  {/* ARQUIVO */}

                  <button
                    type="button"
                    onClick={
                      abrirSeletorArquivo
                    }
                    disabled={
                      enviando ||
                      gravandoAudio
                    }
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-40 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                    title="Anexar arquivo"
                  >
                    +
                  </button>

                  {/* ÁUDIO */}

                  <button
                    type="button"
                    onClick={
                      alternarGravacao
                    }
                    disabled={
                      enviando
                    }
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm transition ${
                      gravandoAudio
                        ? "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                        : "text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                    }`}
                    title={
                      gravandoAudio
                        ? "Parar gravação"
                        : "Gravar áudio"
                    }
                  >
                    {gravandoAudio
                      ? "⏹"
                      : "🎤"}
                  </button>

                  {/* TEXTO */}

                  <input
                    type="text"
                    value={mensagem}
                    onChange={(
                      event
                    ) =>
                      setMensagem(
                        event.target
                          .value
                      )
                    }
                    onKeyDown={(
                      event
                    ) => {
                      if (
                        event.key ===
                          "Enter" &&
                        !event.shiftKey
                      ) {
                        event.preventDefault();

                        handleEnviarMensagem();
                      }
                    }}
                    placeholder={
                      gravandoAudio
                        ? "Gravando áudio..."
                        : "Escreva uma mensagem..."
                    }
                    disabled={
                      gravandoAudio ||
                      enviando
                    }
                    className="h-9 min-w-0 flex-1 bg-transparent px-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed dark:text-slate-100 dark:placeholder:text-slate-600"
                  />

                  {/* ENVIAR */}

                  <button
                    type="button"
                    onClick={
                      handleEnviarMensagem
                    }
                    disabled={
                      !mensagem.trim() ||
                      gravandoAudio ||
                      enviando
                    }
                    className="flex h-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 px-4 text-xs font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {enviando
                      ? "Enviando..."
                      : "Enviar"}
                  </button>

                </div>

                <div className="mt-2 flex items-center justify-between px-1">

                  <p className="text-[10px] text-slate-400 dark:text-slate-600">
                    Enter para enviar · Shift + Enter para nova linha
                  </p>

                  <p className="text-[10px] font-medium text-slate-400 dark:text-slate-600">
                    WhatsApp
                  </p>

                </div>

              </div>

            </div>

          </>

        )}

      </section>

    </div>
  );
}

// ============================================================
// COMPONENTES AUXILIARES
// ============================================================

interface FiltroButtonProps {
  ativo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function FiltroButton({
  ativo,
  onClick,
  children,
}: FiltroButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-md px-2 py-1.5 text-[10px] font-bold transition ${
        ativo
          ? "bg-white text-slate-800 shadow-sm dark:bg-slate-800 dark:text-white"
          : "text-slate-500 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300"
      }`}
    >
      {children}
    </button>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
}

function InfoItem({
  label,
  value,
}: InfoItemProps) {
  return (
    <div>
      <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-xs font-semibold text-slate-700 dark:text-slate-200">
        {value}
      </p>
    </div>
  );
}

export default Chat;