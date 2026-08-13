
import { useState } from "react";
import { X, UserPlus } from "lucide-react";
import {
  criarContato,
  type NovoContato,
} from "../api/api";

interface NovoContatoModalProps {
  aberto: boolean;
  onFechar: () => void;
  onContatoCriado?: () => void;
}

const estadoInicial: NovoContato = {
  nome: "",
  telefoneWhatsapp: "",
  email: "",
  apartamentoVinculado: "",
  tipo: "cliente",
  observacoes: "",
};

export default function NovoContatoModal({
  aberto,
  onFechar,
  onContatoCriado,
}: NovoContatoModalProps) {
  const [formulario, setFormulario] =
    useState<NovoContato>(estadoInicial);

  const [salvando, setSalvando] = useState(false);

  if (!aberto) {
    return null;
  }

  function atualizarCampo(
    campo: keyof NovoContato,
    valor: string
  ) {
    setFormulario((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  async function handleCriarContato() {
    if (!formulario.nome.trim()) {
      alert("Informe o nome do contato.");
      return;
    }

    if (!formulario.telefoneWhatsapp.trim()) {
      alert("Informe o WhatsApp.");
      return;
    }

    try {
      setSalvando(true);

      await criarContato(formulario);

      setFormulario(estadoInicial);

      onContatoCriado?.();
      onFechar();

      alert("Contato criado com sucesso!");
    } catch (error) {
      console.error(
        "Erro ao criar contato:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Erro ao criar contato."
      );
    } finally {
      setSalvando(false);
    }
  }

  function handleFechar() {
    if (salvando) {
      return;
    }

    setFormulario(estadoInicial);
    onFechar();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-slate-200 p-6">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <UserPlus className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Novo contato
              </h2>

              <p className="text-sm text-slate-500">
                Cadastre um novo cliente no CRM.
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={handleFechar}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        {/* FORMULÁRIO */}

        <div className="space-y-5 p-6">

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Nome *
            </label>

            <input
              type="text"
              value={formulario.nome}
              onChange={(e) =>
                atualizarCampo(
                  "nome",
                  e.target.value
                )
              }
              placeholder="Ex.: João da Silva"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              WhatsApp *
            </label>

            <input
              type="tel"
              value={formulario.telefoneWhatsapp}
              onChange={(e) =>
                atualizarCampo(
                  "telefoneWhatsapp",
                  e.target.value
                )
              }
              placeholder="Ex.: 5544999999999"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <p className="mt-1 text-xs text-slate-400">
              Preferencialmente no formato internacional.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              E-mail
            </label>

            <input
              type="email"
              value={formulario.email}
              onChange={(e) =>
                atualizarCampo(
                  "email",
                  e.target.value
                )
              }
              placeholder="cliente@email.com"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Apartamento
              </label>

              <input
                type="text"
                value={formulario.apartamentoVinculado}
                onChange={(e) =>
                  atualizarCampo(
                    "apartamentoVinculado",
                    e.target.value
                  )
                }
                placeholder="Ex.: 101"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Tipo
              </label>

              <select
                value={formulario.tipo}
                onChange={(e) =>
                  atualizarCampo(
                    "tipo",
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="cliente">
                  Cliente
                </option>

                <option value="proprietario">
                  Proprietário
                </option>

                <option value="lead">
                  Lead
                </option>
              </select>
            </div>

          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Observações
            </label>

            <textarea
              value={formulario.observacoes}
              onChange={(e) =>
                atualizarCampo(
                  "observacoes",
                  e.target.value
                )
              }
              rows={3}
              placeholder="Informações adicionais..."
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

        </div>

        {/* AÇÕES */}

        <div className="flex justify-end gap-3 border-t border-slate-200 p-6">

          <button
            type="button"
            onClick={handleFechar}
            disabled={salvando}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleCriarContato}
            disabled={salvando}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <UserPlus className="h-4 w-4" />

            {salvando
              ? "Salvando..."
              : "Criar contato"}
          </button>

        </div>

      </div>
    </div>
  );
}

