"use client";

import { useActionState } from "react";
import { requestPasswordResetAction } from "@/app/(auth)/actions";
import { inputClass, labelClass, cardClass } from "@/components/ui/styles";
import { SubmitButton } from "@/components/ui/SubmitButton";

export default function RecuperarSenhaPage() {
  const [state, formAction] = useActionState(requestPasswordResetAction, undefined);

  return (
    <div className="mx-auto flex max-w-6xl justify-center px-4 py-16 sm:px-6">
      <form action={formAction} className={`${cardClass} w-full max-w-md`}>
        <h1 className="font-serif text-2xl">Recuperar senha</h1>
        <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
          Enviaremos um link por e-mail para você redefinir sua senha.
        </p>

        <div className="mt-6">
          <label className={labelClass} htmlFor="email">E-mail</label>
          <input className={inputClass} id="email" name="email" type="email" required />
        </div>

        {state?.error && <p className="mt-4 text-sm text-red-400">{state.error}</p>}

        <SubmitButton className="mt-6 w-full">Enviar link</SubmitButton>
      </form>
    </div>
  );
}
