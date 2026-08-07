import { createClient } from "@/lib/supabase/server";
import { setBrokerStatusAction } from "@/app/admin/actions";
import { cardClass, primaryButtonClass, secondaryButtonClass, dangerButtonClass } from "@/components/ui/styles";
import type { BrokerStatus } from "@/lib/supabase/types";

const statusLabels: Record<BrokerStatus, string> = {
  pending: "Pendente",
  approved: "Aprovado",
  rejected: "Reprovado",
  blocked: "Bloqueado",
};

export default async function CorretoresAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filter = (status as BrokerStatus) || undefined;

  const supabase = await createClient();
  let query = supabase.from("profiles").select("*").eq("role", "broker").order("created_at", { ascending: false });
  if (filter) query = query.eq("status", filter);
  const { data: brokers } = await query;

  const tabs: { label: string; value?: BrokerStatus }[] = [
    { label: "Todos" },
    { label: "Pendentes", value: "pending" },
    { label: "Aprovados", value: "approved" },
    { label: "Reprovados", value: "rejected" },
    { label: "Bloqueados", value: "blocked" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-3xl">Corretores</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <a
            key={tab.label}
            href={tab.value ? `/admin/corretores?status=${tab.value}` : "/admin/corretores"}
            className={`rounded-full px-4 py-1.5 text-sm ${
              filter === tab.value ? "btn-neon" : "border border-[var(--color-border)] text-[var(--color-fg-muted)]"
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {(!brokers || brokers.length === 0) && (
          <p className="text-sm text-[var(--color-fg-muted)]">Nenhum corretor encontrado.</p>
        )}
        {brokers?.map((broker) => (
          <div key={broker.id} className={`${cardClass} flex flex-wrap items-center justify-between gap-4`}>
            <div>
              <p className="font-medium">{broker.full_name || broker.email}</p>
              <p className="text-sm text-[var(--color-fg-muted)]">
                {broker.email} · CRECI {broker.creci || "—"} · {statusLabels[broker.status as BrokerStatus]}
              </p>
            </div>
            <div className="flex gap-2">
              {broker.status !== "approved" && (
                <form action={setBrokerStatusAction.bind(null, broker.id, "approved")}>
                  <button className={primaryButtonClass} type="submit">Aprovar</button>
                </form>
              )}
              {broker.status !== "rejected" && (
                <form action={setBrokerStatusAction.bind(null, broker.id, "rejected")}>
                  <button className={secondaryButtonClass} type="submit">Reprovar</button>
                </form>
              )}
              {broker.status !== "blocked" ? (
                <form action={setBrokerStatusAction.bind(null, broker.id, "blocked")}>
                  <button className={dangerButtonClass} type="submit">Bloquear</button>
                </form>
              ) : (
                <form action={setBrokerStatusAction.bind(null, broker.id, "approved")}>
                  <button className={secondaryButtonClass} type="submit">Desbloquear</button>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
