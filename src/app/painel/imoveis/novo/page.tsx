import { createPropertyAction } from "@/app/painel/actions";
import { PropertyForm } from "@/components/PropertyForm";

export default function NovoImovelPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-3xl">Novo imóvel</h1>
      <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
        Preencha os dados do imóvel. Você poderá editar depois.
      </p>
      <div className="mt-8">
        <PropertyForm action={createPropertyAction} submitLabel="Publicar imóvel" />
      </div>
    </div>
  );
}
