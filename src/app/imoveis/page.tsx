import { createClient } from "@/lib/supabase/server";
import { FilterBar, type CatalogFilters } from "@/components/FilterBar";
import { PropertyCard } from "@/components/PropertyCard";

export default async function ImoveisPage({
  searchParams,
}: {
  searchParams: Promise<CatalogFilters>;
}) {
  const filters = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("properties")
    .select("*, property_photos(url, sort_order)")
    .eq("visible", true);

  if (filters.type) query = query.eq("type", filters.type);
  if (filters.city) query = query.ilike("city", `%${filters.city}%`);
  if (filters.minPrice) query = query.gte("price", Number(filters.minPrice));
  if (filters.maxPrice) query = query.lte("price", Number(filters.maxPrice));
  if (filters.bedrooms) query = query.gte("bedrooms", Number(filters.bedrooms));
  if (filters.q) query = query.or(`title.ilike.%${filters.q}%,neighborhood.ilike.%${filters.q}%`);

  if (filters.sort === "menor-preco") query = query.order("price", { ascending: true, nullsFirst: false });
  else if (filters.sort === "maior-preco") query = query.order("price", { ascending: false });
  else query = query.order("created_at", { ascending: false });

  const { data: properties } = await query;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-3xl">Imóveis</h1>
      <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
        {properties?.length ?? 0} imóveis encontrados
      </p>

      <div className="mt-6">
        <FilterBar filters={filters} />
      </div>

      {(!properties || properties.length === 0) && (
        <div className="mt-10 card-elevated rounded-2xl p-10 text-center text-[var(--color-fg-muted)]">
          Nenhum imóvel encontrado com esses filtros.
        </div>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties?.map((property) => {
          const cover = [...(property.property_photos ?? [])].sort((a, b) => a.sort_order - b.sort_order)[0]?.url;
          return <PropertyCard key={property.id} property={property} coverUrl={cover} />;
        })}
      </div>
    </div>
  );
}
