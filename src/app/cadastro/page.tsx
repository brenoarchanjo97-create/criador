"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUpAction } from "@/app/(auth)/actions";
import { inputClass, labelClass, cardClass } from "@/components/ui/styles";
import { SubmitButton } from "@/components/ui/SubmitButton";

export default function CadastroPage() {
  const [state, formAction] = useActionState(signUpAction, undefined);

  return (
    <div className="mx-auto flex max-w-6xl justify-center px-4 py-16 sm:px-6">
      <form action={formAction} className={`${cardClass} w-full max-w-lg`}>
        <h1 className="font-serif text-2xl">Cadastro de corretor</h1>
        <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
          Depois de enviar, um administrador precisa aprovar seu acesso antes que você
          possa publicar imóveis.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className={labelClass} htmlFor="fullName">Nome completo</label>
            <input className={inputClass} id="fullName" name="fullName" required />
          </div>
          <div>
            <label className={labelClass} htmlFor="email">E-mail</label>
            <input className={inputClass} id="email" name="email" type="email" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass} htmlFor="phone">Telefone</label>
              <input className={inputClass} id="phone" name="phone" required />
            </div>
            <div>
              <label className={labelClass} htmlFor="creci">CRECI</label>
              <input className={inputClass} id="creci" name="creci" required />
            </div>
          </div>
          <div>
            <label className={labelClass} htmlFor="password">Senha</label>
            <input className={inputClass} id="password" name="password" type="password" minLength={8} required />
          </div>
        </div>

        {state?.error && <p className="mt-4 text-sm text-red-400">{state.error}</p>}

        <SubmitButton className="mt-6 w-full">Criar conta</SubmitButton>

        <p className="mt-5 text-sm text-[var(--color-fg-muted)]">
          Já tem conta?{" "}
          <Link href="/login" className="hover:text-[var(--color-fg)]">Entrar</Link>
        </p>
      </form>
    </div>
  );
}
