import Link from "next/link";
import Image from "next/image";
import { EmptyPhotoState } from "@/components/EmptyPhotoState";
import { formatAddress, formatCurrency, propertyTypeLabels } from "@/lib/format";
import type { Property } from "@/lib/supabase/types";

export function PropertyCard({
  property,
  coverUrl,
}: {
  property: Pick<Property, "id" | "title" | "type" | "price" | "neighborhood" | "city" | "state" | "bedrooms" | "bathrooms" | "area_m2">;
  coverUrl?: string | null;
}) {
  return (
    <Link
      href={`/imoveis/${property.id}`}
      className="card-elevated group overflow-hidden rounded-2xl transition-transform hover:-translate-y-1"
    >
      <div className="relative h-48 w-full overflow-hidden">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <EmptyPhotoState className="h-48 w-full" />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs uppercase tracking-wide gold-text">
          {propertyTypeLabels[property.type]}
        </span>
      </div>
      <div className="p-5">
        <h3 className="line-clamp-1 font-serif text-lg">{property.title}</h3>
        <p className="mt-1 text-sm text-[var(--color-fg-muted)]">{formatAddress(property) || "Localização a confirmar"}</p>
        <p className="mt-3 text-lg neon-text">{formatCurrency(property.price)}</p>
        <div className="mt-3 flex gap-4 text-xs text-[var(--color-fg-muted)]">
          {property.bedrooms != null && <span>{property.bedrooms} qts</span>}
          {property.bathrooms != null && <span>{property.bathrooms} banh.</span>}
          {property.area_m2 != null && <span>{property.area_m2} m²</span>}
        </div>
      </div>
    </Link>
  );
}
