import { signOutAction } from "@/app/(auth)/actions";

export function LogoutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
      >
        Sair
      </button>
    </form>
  );
}
