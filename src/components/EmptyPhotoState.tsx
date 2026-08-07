export function EmptyPhotoState({ className }: { className?: string }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 bg-[var(--color-bg-elevated-2)] text-[var(--color-fg-muted)] ${className ?? ""}`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="h-8 w-8 opacity-60">
        <path d="M4 7a2 2 0 0 1 2-2h2l1.5-2h5L16 5h2a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" strokeLinejoin="round" />
        <circle cx="12" cy="13" r="3.5" />
      </svg>
      <span className="text-xs">Fotos em breve</span>
    </div>
  );
}
