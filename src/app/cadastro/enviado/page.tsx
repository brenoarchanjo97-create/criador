import Link from "next/link";
import { cardClass } from "@/components/ui/styles";

export default function CadastroEnviadoPage() {
  return (
    <div className="mx-auto flex max-w-6xl justify-center px-4 py-16 sm:px-6">
      <div className={`${cardClass} w-full max-w-lg text-center`}>
        <h1 className="font-serif text-2xl">Cadastro enviado!</h1>
        <p className="mt-3 text-sm text-[var(--color-fg-muted)]">
          Confirme seu e-mail (se solicitado) e aguarde a aprovação de um administrador.
          Você será avisado assim que puder acessar seu painel.
        </p>
        <Link href="/login" className="mt-6 inline-block gold-text hover:underline">
          Ir para o login
        </Link>
      </div>
    </div>
  );
}
