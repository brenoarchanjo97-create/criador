import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/site-config";
import { LogoutButton } from "@/components/LogoutButton";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    role = profile?.role ?? null;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="font-serif text-xl tracking-wide">
          {siteConfig.siteName.split(" ")[0]} <span className="gold-text">Archanjo</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-[var(--color-fg-muted)] sm:flex">
          <Link href="/" className="hover:text-[var(--color-fg)]">Início</Link>
          <Link href="/imoveis" className="hover:text-[var(--color-fg)]">Imóveis</Link>
          <Link href="/imoveis?type=lancamento" className="hover:text-[var(--color-fg)]">Lançamentos</Link>
        </nav>

        <div className="flex items-center gap-3 text-sm">
          {!user && (
            <>
              <Link href="/login" className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]">
                Entrar
              </Link>
              <Link href="/cadastro" className="rounded-full btn-neon px-4 py-2 font-medium">
                Sou corretor
              </Link>
            </>
          )}
          {user && role === "admin" && (
            <Link href="/admin" className="rounded-full border border-[var(--color-gold)] gold-text px-4 py-2">
              Admin
            </Link>
          )}
          {user && role === "broker" && (
            <Link href="/painel" className="rounded-full border border-[var(--color-gold)] gold-text px-4 py-2">
              Meu painel
            </Link>
          )}
          {user && <LogoutButton />}
        </div>
      </div>
    </header>
  );
}
