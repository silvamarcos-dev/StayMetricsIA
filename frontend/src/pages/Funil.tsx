
import { Construction, Sparkles } from "lucide-react";

function Funil() {
  return (
    <div className="flex min-h-[calc(100vh-184px)] items-center justify-center">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

        {/* ÍCONE */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50">
          <Construction className="h-10 w-10 text-blue-600" />
        </div>

        {/* TÍTULO */}
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />

            <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Em desenvolvimento
            </span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900">
            Estamos construindo esta página
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-slate-500">
            O Kanban de vendas do Aurion CRM ainda está sendo desenvolvido.
            Em breve você poderá acompanhar seus leads, negociações e reservas
            de forma visual e organizada.
          </p>
        </div>

        {/* PROGRESSO VISUAL */}
        <div className="mx-auto mt-8 max-w-md">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Desenvolvimento</span>
            <span>Em andamento</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-2/3 rounded-full bg-blue-600" />
          </div>
        </div>

        {/* ASSINATURA */}
        <div className="mt-10 border-t border-slate-100 pt-6">
          <p className="text-sm text-slate-400">
            Atenciosamente,
          </p>

          <p className="mt-1 font-semibold text-slate-700">
            Marcos Silva
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Desenvolvedor Full-Stack
          </p>
        </div>

      </div>
    </div>
  );
}

export default Funil;

