import { createClient } from "@/lib/supabase/server";
import { setTestimonialApprovedAction, deleteTestimonialAction } from "@/app/admin/actions";
import { cardClass, primaryButtonClass, secondaryButtonClass, dangerButtonClass } from "@/components/ui/styles";

export default async function DepoimentosAdminPage() {
  const supabase = await createClient();
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-3xl">Depoimentos</h1>
      <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
        Aprove os depoimentos enviados por visitantes antes que apareçam no site.
      </p>

      <div className="mt-8 space-y-4">
        {(!testimonials || testimonials.length === 0) && (
          <p className="text-sm text-[var(--color-fg-muted)]">Nenhum depoimento enviado ainda.</p>
        )}
        {testimonials?.map((t) => (
          <div key={t.id} className={cardClass}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">{t.name}</p>
                <p className="mt-1 text-sm text-[var(--color-fg-muted)]">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-2 text-xs text-[var(--color-fg-muted)]">
                  {t.approved ? "Aprovado e visível no site" : "Aguardando aprovação"}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                {!t.approved ? (
                  <form action={setTestimonialApprovedAction.bind(null, t.id, true)}>
                    <button className={primaryButtonClass} type="submit">Aprovar</button>
                  </form>
                ) : (
                  <form action={setTestimonialApprovedAction.bind(null, t.id, false)}>
                    <button className={secondaryButtonClass} type="submit">Ocultar</button>
                  </form>
                )}
                <form action={deleteTestimonialAction.bind(null, t.id)}>
                  <button className={dangerButtonClass} type="submit">Excluir</button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
