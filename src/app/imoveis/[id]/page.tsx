import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EmptyPhotoState } from "@/components/EmptyPhotoState";
import { ViewTracker } from "@/components/ViewTracker";
import {
  formatAddress,
  formatCurrency,
  propertyStatusLabels,
  propertyTypeLabels,
} from "@/lib/format";
import { cardClass, primaryButtonClass, secondaryButtonClass } from "@/components/ui/styles";
import type { PropertyType, PropertyStatus } from "@/lib/supabase/types";

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: property } = await supabase
    .from("properties")
    .select("*, property_photos(*), profiles(full_name, phone, whatsapp, creci, avatar_url)")
    .eq("id", id)
    .single();

  if (!property) notFound();

  const photos = [...(property.property_photos ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  const broker = property.profiles;
  const fullAddress = [property.street, formatAddress(property), property.zip].filter(Boolean).join(", ");
  const mapQuery = fullAddress || property.city;
  const contactNumber = broker?.whatsapp || broker?.phone;

  const specs: { label: string; value: string | number | null | undefined }[] = [
    { label: "Quartos", value: property.bedrooms },
    { label: "Banheiros", value: property.bathrooms },
    { label: "Vagas", value: property.parking_spots },
    { label: "Área", value: property.area_m2 ? `${property.area_m2} m²` : null },
    { label: "Condomínio", value: property.condo_fee ? formatCurrency(property.condo_fee) : null },
    { label: "IPTU", value: property.iptu ? formatCurrency(property.iptu) : null },
    { label: "Mobiliado", value: property.furnished ? "Sim" : "Não" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <ViewTracker propertyId={property.id} />

      <p className="text-xs uppercase tracking-wide gold-text">
        {propertyTypeLabels[property.type as PropertyType]} · {propertyStatusLabels[property.status as PropertyStatus]}
      </p>
      <h1 className="mt-2 font-serif text-3xl sm:text-4xl">{property.title}</h1>
      <p className="mt-1 text-[var(--color-fg-muted)]">{fullAddress || "Localização a confirmar"}</p>

      {photos.length > 0 ? (
        <div className="mt-6 grid gap-2 sm:grid-cols-4">
          <div className="relative aspect-video overflow-hidden rounded-2xl sm:col-span-3 sm:aspect-auto sm:row-span-2">
            {photos[0].is_video ? (
              <video src={photos[0].url} controls className="h-full w-full object-cover" />
            ) : (
              <Image src={photos[0].url} alt={property.title} fill className="object-cover" priority />
            )}
          </div>
          {photos.slice(1, 5).map((photo) => (
            <div key={photo.id} className="relative hidden aspect-square overflow-hidden rounded-xl sm:block">
              {photo.is_video ? (
                <video src={photo.url} className="h-full w-full object-cover" muted />
              ) : (
                <Image src={photo.url} alt="" fill className="object-cover" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyPhotoState className="mt-6 aspect-video w-full rounded-2xl" />
      )}

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="font-serif text-3xl neon-text">{formatCurrency(property.price)}</p>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {specs
              .filter((s) => s.value !== null && s.value !== undefined && s.value !== "")
              .map((s) => (
                <div key={s.label} className={cardClass}>
                  <p className="text-xs text-[var(--color-fg-muted)]">{s.label}</p>
                  <p className="mt-1 font-medium">{s.value}</p>
                </div>
              ))}
          </div>

          {property.description && (
            <div className="mt-8">
              <h2 className="font-serif text-xl">Sobre o imóvel</h2>
              <p className="mt-2 whitespace-pre-line text-[var(--color-fg-muted)]">{property.description}</p>
            </div>
          )}

          {mapQuery && (
            <div className="mt-8">
              <h2 className="font-serif text-xl">Localização</h2>
              <div className="mt-3 overflow-hidden rounded-2xl border border-[var(--color-border)]">
                <iframe
                  title="Mapa do imóvel"
                  width="100%"
                  height="320"
                  loading="lazy"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
                />
              </div>
            </div>
          )}
        </div>

        <div className={`${cardClass} h-fit`}>
          <div className="flex items-center gap-3">
            {broker?.avatar_url ? (
              <Image src={broker.avatar_url} alt={broker.full_name} width={48} height={48} className="rounded-full object-cover" />
            ) : (
              <div className="h-12 w-12 rounded-full bg-[var(--color-bg-elevated-2)]" />
            )}
            <div>
              <p className="font-medium">{broker?.full_name ?? "Corretor"}</p>
              {broker?.creci && <p className="text-xs text-[var(--color-fg-muted)]">CRECI {broker.creci}</p>}
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3">
            {contactNumber && (
              <a
                href={`https://wa.me/${contactNumber}?text=${encodeURIComponent(
                  `Olá! Tenho interesse no imóvel "${property.title}".`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className={primaryButtonClass}
              >
                Falar no WhatsApp
              </a>
            )}
            {broker?.phone && (
              <a href={`tel:${broker.phone}`} className={secondaryButtonClass}>
                Ligar para o corretor
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
