"use client";

import { useActionState } from "react";
import { submitTestimonialAction } from "@/app/actions";
import { inputClass, labelClass } from "@/components/ui/styles";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function TestimonialForm() {
  const [state, formAction] = useActionState(submitTestimonialAction, undefined);

  if (state?.success) {
    return <p className="text-sm text-emerald-400">{state.success}</p>;
  }

  return (
    <form action={formAction} className="space-y-3">
      <div>
        <label className={labelClass} htmlFor="name">Seu nome</label>
        <input className={inputClass} id="name" name="name" required />
      </div>
      <div>
        <label className={labelClass} htmlFor="quote">Seu depoimento</label>
        <textarea className={inputClass} id="quote" name="quote" rows={3} required />
      </div>
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      <SubmitButton>Enviar depoimento</SubmitButton>
    </form>
  );
}
