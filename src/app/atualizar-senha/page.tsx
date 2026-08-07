"use client";

import { useActionState } from "react";
import { updatePasswordAction } from "@/app/(auth)/actions";
import { inputClass, labelClass, cardClass } from "@/components/ui/styles";
import { SubmitButton } from "@/components/ui/SubmitButton";

export default function AtualizarSenhaPage() {
  const [state, formAction] = useActionState(updatePasswordAction, undefined);

  return (
    <div className="mx-auto flex max-w-6xl justify-center px-4 py-16 sm:px-6">
      <form action={formAction} className={`${cardClass} w-full max-w-md`}>
        <h1 className="font-serif text-2xl">Definir nova senha</h1>

        <div className="mt-6">
          <label className={labelClass} htmlFor="password">Nova senha</label>
          <input className={inputClass} id="password" name="password" type="password" minLength={8} required />
        </div>

        {state?.error && <p className="mt-4 text-sm text-red-400">{state.error}</p>}

        <SubmitButton className="mt-6 w-full">Salvar senha</SubmitButton>
      </form>
    </div>
  );
}
