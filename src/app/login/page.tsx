"use client";

import { useActionState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signInAction } from "@/app/(auth)/actions";
import { inputClass, labelClass, cardClass } from "@/components/ui/styles";
import { SubmitButton } from "@/components/ui/SubmitButton";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "";
  const [state, formAction] = useActionState(signInAction, undefined);

  return (
    <form action={formAction} className={`${cardClass} w-full max-w-md`}>
      <h1 className="font-serif text-2xl">Entrar</h1>
      <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
        Acesse seu painel de corretor ou de administrador.
      </p>

      <input type="hidden" name="redirectTo" value={redirectTo} />

      <div className="mt-6 space-y-4">
        <div>
          <label className={labelClass} htmlFor="email">E-mail</label>
          <input className={inputClass} id="email" name="email" type="email" required />
        </div>
        <div>
          <label className={labelClass} htmlFor="password">Senha</label>
          <input className={inputClass} id="password" name="password" type="password" required />
        </div>
      </div>

      {state?.error && <p className="mt-4 text-sm text-red-400">{state.error}</p>}

      <SubmitButton className="mt-6 w-full">Entrar</SubmitButton>

      <div className="mt-5 flex justify-between text-sm text-[var(--color-fg-muted)]">
        <Link href="/recuperar-senha" className="hover:text-[var(--color-fg)]">Esqueci minha senha</Link>
        <Link href="/cadastro" className="hover:text-[var(--color-fg)]">Criar conta de corretor</Link>
      </div>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-6xl justify-center px-4 py-16 sm:px-6">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
