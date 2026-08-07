import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
        <nav className="mx-auto flex max-w-6xl gap-6 overflow-x-auto px-4 py-3 text-sm text-[var(--color-fg-muted)] sm:px-6">
          <Link href="/admin" className="whitespace-nowrap hover:text-[var(--color-fg)]">Dashboard</Link>
          <Link href="/admin/corretores" className="whitespace-nowrap hover:text-[var(--color-fg)]">Corretores</Link>
          <Link href="/admin/imoveis" className="whitespace-nowrap hover:text-[var(--color-fg)]">Imóveis</Link>
          <Link href="/admin/depoimentos" className="whitespace-nowrap hover:text-[var(--color-fg)]">Depoimentos</Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
