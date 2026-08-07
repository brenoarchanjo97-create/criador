import { cardClass } from "@/components/ui/styles";
import { LogoutButton } from "@/components/LogoutButton";

const messages: Record<string, { title: string; body: string }> = {
  pending: {
    title: "Sua conta está em análise",
    body: "Um administrador ainda precisa aprovar seu cadastro de corretor. Assim que for aprovado, você poderá publicar imóveis.",
  },
  rejected: {
    title: "Cadastro não aprovado",
    body: "Seu cadastro de corretor não foi aprovado. Entre em contato com o administrador para mais informações.",
  },
  blocked: {
    title: "Conta bloqueada",
    body: "Sua conta foi bloqueada pelo administrador. Entre em contato para mais informações.",
  },
};

export default async function ContaPendentePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const info = messages[status ?? "pending"] ?? messages.pending;

  return (
    <div className="mx-auto flex max-w-6xl justify-center px-4 py-16 sm:px-6">
      <div className={`${cardClass} w-full max-w-lg text-center`}>
        <h1 className="font-serif text-2xl">{info.title}</h1>
        <p className="mt-3 text-sm text-[var(--color-fg-muted)]">{info.body}</p>
        <div className="mt-6">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
