import { siteConfig, whatsappLink } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="font-serif text-lg">
              {siteConfig.siteName.split(" ")[0]} <span className="gold-text">Archanjo</span>
            </p>
            <p className="mt-2 text-sm text-[var(--color-fg-muted)]">{siteConfig.shortBio}</p>
          </div>
          <div className="text-sm text-[var(--color-fg-muted)]">
            <p className="mb-2 font-medium text-[var(--color-fg)]">Contato</p>
            <p>{siteConfig.brokerName} · CRECI {siteConfig.creci}</p>
            <p>
              <a href={whatsappLink()} className="hover:text-[var(--color-fg)]" target="_blank" rel="noopener noreferrer">
                {siteConfig.phoneDisplay}
              </a>
            </p>
            <p>
              <a href={`mailto:${siteConfig.email}`} className="hover:text-[var(--color-fg)]">
                {siteConfig.email}
              </a>
            </p>
          </div>
          <div className="text-sm text-[var(--color-fg-muted)]">
            <p className="mb-2 font-medium text-[var(--color-fg)]">Onde atuamos</p>
            <p>{siteConfig.region}</p>
            <p className="mt-2">
              <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-fg)]">
                {siteConfig.instagram}
              </a>
            </p>
          </div>
        </div>
        <div className="divider-gold mt-10" />
        <p className="mt-6 text-xs text-[var(--color-fg-muted)]">
          © {new Date().getFullYear()} {siteConfig.siteName}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
