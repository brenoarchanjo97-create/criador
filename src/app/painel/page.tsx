import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deletePropertyAction } from "@/app/painel/actions";
import { formatCurrency, propertyStatusLabels, propertyTypeLabels } from "@/lib/format";
import { EmptyPhotoState } from "@/components/EmptyPhotoState";
import { primaryButtonClass, secondaryButtonClass, dangerButtonClass } from "@/components/ui/styles";
import type { PropertyType, PropertyStatus } from "@/lib/supabase/types";

export default async function PainelPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: properties } = await supabase
    .from("properties")
    .select("*, property_photos(url, sort_order)")
    .eq("broker_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl">Meus imóveis</h1>
          <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
            Gerencie seus anúncios publicados no catálogo.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/painel/perfil" className={secondaryButtonClass}>Meu perfil</Link>
          <Link href="/painel/imoveis/novo" className={primaryButtonClass}>+ Novo imóvel</Link>
        </div>
      </div>

      {(!properties || properties.length === 0) && (
        <div className="mt-10 card-elevated rounded-2xl p-10 text-center text-[var(--color-fg-muted)]">
          Você ainda não cadastrou nenhum imóvel.
        </div>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties?.map((property) => {
          const photos = [...(property.property_photos ?? [])].sort(
            (a, b) => a.sort_order - b.sort_order
          );
          const cover = photos[0]?.url;

          return (
            <div key={property.id} className="card-elevated overflow-hidden rounded-2xl">
              <div className="relative h-40 w-full">
                {cover ? (
                  <Image src={cover} alt={property.title} fill className="object-cover" />
                ) : (
                  <EmptyPhotoState className="h-40 w-full" />
                )}
                {!property.visible && (
                  <span className="absolute left-2 top-2 rounded-full bg-red-500/90 px-2 py-0.5 text-xs text-white">
                    Removido pelo admin
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs uppercase tracking-wide gold-text">
                  {propertyTypeLabels[property.type as PropertyType]} · {propertyStatusLabels[property.status as PropertyStatus]}
                </p>
                <h2 className="mt-1 line-clamp-1 font-serif text-lg">{property.title}</h2>
                <p className="mt-1 text-sm text-[var(--color-fg-muted)]">{formatCurrency(property.price)}</p>
                <p className="mt-1 text-xs text-[var(--color-fg-muted)]">{property.view_count} visualizações</p>

                <div className="mt-4 flex gap-2">
                  <Link href={`/painel/imoveis/${property.id}/editar`} className={`${secondaryButtonClass} flex-1`}>
                    Editar
                  </Link>
                  <form action={deletePropertyAction.bind(null, property.id)}>
                    <button type="submit" className={dangerButtonClass}>Excluir</button>
                  </form>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
