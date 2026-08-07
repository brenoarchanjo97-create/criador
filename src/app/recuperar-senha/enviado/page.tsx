import { cardClass } from "@/components/ui/styles";

export default function RecuperarSenhaEnviadoPage() {
  return (
    <div className="mx-auto flex max-w-6xl justify-center px-4 py-16 sm:px-6">
      <div className={`${cardClass} w-full max-w-md text-center`}>
        <h1 className="font-serif text-2xl">Verifique seu e-mail</h1>
        <p className="mt-3 text-sm text-[var(--color-fg-muted)]">
          Se o e-mail informado estiver cadastrado, você receberá um link para redefinir sua senha.
        </p>
      </div>
    </div>
  );
}
