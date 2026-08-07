import { createClient } from "@/lib/supabase/server";
import { setPropertyVisibilityAction, deletePropertyAdminAction } from "@/app/admin/actions";
import { formatCurrency, propertyTypeLabels } from "@/lib/format";
import type { PropertyType } from "@/lib/supabase/types";
import { cardClass, secondaryButtonClass, dangerButtonClass } from "@/components/ui/styles";

export default async function ImoveisAdminPage() {
  const supabase = await createClient();
  const { data: properties } = await supabase
    .from("properties")
    .select("*, profiles(full_name, email)")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-3xl">Moderação de imóveis</h1>
      <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
        Remova imóveis do catálogo público sem precisar excluí-los, ou exclua definitivamente.
      </p>

      <div className="mt-8 space-y-4">
        {(!properties || properties.length === 0) && (
          <p className="text-sm text-[var(--color-fg-muted)]">Nenhum imóvel cadastrado ainda.</p>
        )}
        {properties?.map((property) => (
          <div key={property.id} className={`${cardClass} flex flex-wrap items-center justify-between gap-4`}>
            <div>
              <p className="font-medium">{property.title}</p>
              <p className="text-sm text-[var(--color-fg-muted)]">
                {propertyTypeLabels[property.type as PropertyType]} · {formatCurrency(property.price)} ·{" "}
                {property.profiles?.full_name ?? property.profiles?.email} · {property.view_count} views
              </p>
              {!property.visible && <p className="mt-1 text-xs text-red-400">Oculto do catálogo público</p>}
            </div>
            <div className="flex gap-2">
              {property.visible ? (
                <form action={setPropertyVisibilityAction.bind(null, property.id, false)}>
                  <button className={secondaryButtonClass} type="submit">Remover do catálogo</button>
                </form>
              ) : (
                <form action={setPropertyVisibilityAction.bind(null, property.id, true)}>
                  <button className={secondaryButtonClass} type="submit">Reexibir</button>
                </form>
              )}
              <form action={deletePropertyAdminAction.bind(null, property.id)}>
                <button className={dangerButtonClass} type="submit">Excluir</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
