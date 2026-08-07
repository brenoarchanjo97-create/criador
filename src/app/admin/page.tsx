import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, propertyTypeLabels } from "@/lib/format";
import { cardClass } from "@/components/ui/styles";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ count: activeBrokers }, { count: pendingBrokers }, { data: properties }, { data: topViewed }] =
    await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "broker").eq("status", "approved"),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "broker").eq("status", "pending"),
      supabase.from("properties").select("type"),
      supabase.from("properties").select("id, title, view_count, price").order("view_count", { ascending: false }).limit(5),
    ]);

  const byType = { venda: 0, aluguel: 0, lancamento: 0 };
  properties?.forEach((p) => {
    byType[p.type as keyof typeof byType] = (byType[p.type as keyof typeof byType] ?? 0) + 1;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-3xl">Painel do administrador</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className={cardClass}>
          <p className="text-sm text-[var(--color-fg-muted)]">Corretores ativos</p>
          <p className="mt-2 font-serif text-3xl neon-text">{activeBrokers ?? 0}</p>
        </div>
        <div className={cardClass}>
          <p className="text-sm text-[var(--color-fg-muted)]">Aguardando aprovação</p>
          <p className="mt-2 font-serif text-3xl gold-text">{pendingBrokers ?? 0}</p>
          <Link href="/admin/corretores" className="mt-2 inline-block text-xs text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">
            Ver fila →
          </Link>
        </div>
        {(Object.keys(byType) as (keyof typeof byType)[]).map((type) => (
          <div key={type} className={cardClass}>
            <p className="text-sm text-[var(--color-fg-muted)]">{propertyTypeLabels[type]}</p>
            <p className="mt-2 font-serif text-3xl">{byType[type]}</p>
          </div>
        ))}
      </div>

      <div className={`${cardClass} mt-8`}>
        <h2 className="font-serif text-xl">Imóveis mais visualizados</h2>
        <div className="mt-4 space-y-3">
          {(!topViewed || topViewed.length === 0) && (
            <p className="text-sm text-[var(--color-fg-muted)]">Nenhuma visualização registrada ainda.</p>
          )}
          {topViewed?.map((p) => (
            <div key={p.id} className="flex items-center justify-between border-b border-[var(--color-border)] pb-2 text-sm last:border-0">
              <span>{p.title}</span>
              <span className="text-[var(--color-fg-muted)]">{p.view_count} views · {formatCurrency(p.price)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
