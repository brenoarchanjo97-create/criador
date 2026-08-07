import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { PropertyCard } from "@/components/PropertyCard";
import { TestimonialForm } from "@/components/TestimonialForm";
import { siteConfig } from "@/lib/site-config";
import { primaryButtonClass, secondaryButtonClass, cardClass } from "@/components/ui/styles";

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: settings }, { data: launches }, { data: testimonials }] = await Promise.all([
    supabase.from("site_settings").select("*").eq("id", 1).single(),
    supabase
      .from("properties")
      .select("*, property_photos(url, sort_order)")
      .eq("type", "lancamento")
      .eq("visible", true)
      .order("created_at", { ascending: false })
      .limit(3),
    supabase.from("testimonials").select("*").eq("approved", true).order("created_at", { ascending: false }),
  ]);

  return (
    <div>
      <section className="relative flex min-h-[85vh] items-center overflow-hidden">
        <div className="absolute inset-0">
          {settings?.hero_fallback_image_url ? (
            <Image
              src={settings.hero_fallback_image_url}
              alt=""
              fill
              priority
              className="object-cover opacity-40"
            />
          ) : (
            <div className="h-full w-full bg-[radial-gradient(circle_at_top,var(--color-neon-soft),transparent_60%),radial-gradient(circle_at_bottom,var(--color-gold-soft),transparent_60%)]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/60 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="animate-fade-in-up text-sm uppercase tracking-[0.3em] gold-text">
            CRECI {siteConfig.creci} · {siteConfig.region}
          </p>
          <h1 className="animate-fade-in-up mt-4 font-serif text-4xl leading-tight sm:text-6xl">
            Imóveis com a assinatura de <span className="neon-text">{siteConfig.brokerName}</span>
          </h1>
          <p className="animate-fade-in-up mt-5 text-lg text-[var(--color-fg-muted)]">
            {siteConfig.yearsActive} anos de experiência conectando pessoas ao imóvel certo em {siteConfig.region}.
          </p>
          <div className="animate-fade-in-up mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/imoveis" className={primaryButtonClass}>Ver imóveis</Link>
            <Link href="/cadastro" className={secondaryButtonClass}>Sou corretor</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2">
          <div>
            <AnimatedCounter target={siteConfig.stats.propertiesSold} suffix="+" />
            <p className="mt-2 text-sm text-[var(--color-fg-muted)]">imóveis vendidos</p>
          </div>
          <div>
            <AnimatedCounter target={siteConfig.stats.sitesCreated} suffix="+" />
            <p className="mt-2 text-sm text-[var(--color-fg-muted)]">sites criados para corretores</p>
          </div>
        </div>
      </section>

      {launches && launches.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-3xl">Lançamentos</h2>
            <Link href="/imoveis?type=lancamento" className="text-sm gold-text hover:underline">
              Ver todos →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {launches.map((property) => {
              const cover = [...(property.property_photos ?? [])].sort((a, b) => a.sort_order - b.sort_order)[0]?.url;
              return <PropertyCard key={property.id} property={property} coverUrl={cover} />;
            })}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center font-serif text-3xl">O que dizem sobre o trabalho</h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {testimonials?.map((t) => (
            <div key={t.id} className={cardClass}>
              <p className="text-[var(--color-fg)]">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-4 text-sm gold-text">— {t.name}</p>
            </div>
          ))}
        </div>

        <div className={`${cardClass} mx-auto mt-10 max-w-lg`}>
          <h3 className="font-serif text-xl">Deixe seu depoimento</h3>
          <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
            Seu depoimento passa por aprovação antes de aparecer no site.
          </p>
          <div className="mt-5">
            <TestimonialForm />
          </div>
        </div>
      </section>
    </div>
  );
}
