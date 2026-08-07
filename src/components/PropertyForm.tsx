"use client";

import { useActionState } from "react";
import { inputClass, labelClass, cardClass } from "@/components/ui/styles";
import { SubmitButton } from "@/components/ui/SubmitButton";
import type { Property } from "@/lib/supabase/types";
import type { ActionState } from "@/app/painel/actions";

type Action = (prevState: ActionState, formData: FormData) => Promise<ActionState>;

export function PropertyForm({
  action,
  initial,
  submitLabel,
}: {
  action: Action;
  initial?: Property;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, undefined);

  return (
    <form action={formAction} className={`${cardClass} space-y-6`}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="type">Tipo</label>
          <select id="type" name="type" defaultValue={initial?.type ?? "venda"} className={inputClass}>
            <option value="venda">Venda</option>
            <option value="aluguel">Aluguel</option>
            <option value="lancamento">Lançamento</option>
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue={initial?.status ?? "disponivel"} className={inputClass}>
            <option value="disponivel">Disponível</option>
            <option value="reservado">Reservado</option>
            <option value="vendido">Vendido</option>
            <option value="alugado">Alugado</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="title">Título</label>
        <input className={inputClass} id="title" name="title" defaultValue={initial?.title} required />
      </div>

      <div>
        <label className={labelClass} htmlFor="description">Descrição</label>
        <textarea className={inputClass} id="description" name="description" rows={4} defaultValue={initial?.description ?? ""} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass} htmlFor="price">Valor (R$)</label>
          <input className={inputClass} id="price" name="price" type="number" step="0.01" defaultValue={initial?.price ?? ""} />
        </div>
        <div>
          <label className={labelClass} htmlFor="condoFee">Condomínio (R$)</label>
          <input className={inputClass} id="condoFee" name="condoFee" type="number" step="0.01" defaultValue={initial?.condo_fee ?? ""} />
        </div>
        <div>
          <label className={labelClass} htmlFor="iptu">IPTU (R$)</label>
          <input className={inputClass} id="iptu" name="iptu" type="number" step="0.01" defaultValue={initial?.iptu ?? ""} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="street">Endereço</label>
          <input className={inputClass} id="street" name="street" defaultValue={initial?.street ?? ""} />
        </div>
        <div>
          <label className={labelClass} htmlFor="neighborhood">Bairro</label>
          <input className={inputClass} id="neighborhood" name="neighborhood" defaultValue={initial?.neighborhood ?? ""} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass} htmlFor="city">Cidade</label>
          <input className={inputClass} id="city" name="city" defaultValue={initial?.city ?? ""} required />
        </div>
        <div>
          <label className={labelClass} htmlFor="state">Estado</label>
          <input className={inputClass} id="state" name="state" maxLength={2} defaultValue={initial?.state ?? "SP"} />
        </div>
        <div>
          <label className={labelClass} htmlFor="zip">CEP</label>
          <input className={inputClass} id="zip" name="zip" defaultValue={initial?.zip ?? ""} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div>
          <label className={labelClass} htmlFor="bedrooms">Quartos</label>
          <input className={inputClass} id="bedrooms" name="bedrooms" type="number" min={0} defaultValue={initial?.bedrooms ?? ""} />
        </div>
        <div>
          <label className={labelClass} htmlFor="bathrooms">Banheiros</label>
          <input className={inputClass} id="bathrooms" name="bathrooms" type="number" min={0} defaultValue={initial?.bathrooms ?? ""} />
        </div>
        <div>
          <label className={labelClass} htmlFor="parkingSpots">Vagas</label>
          <input className={inputClass} id="parkingSpots" name="parkingSpots" type="number" min={0} defaultValue={initial?.parking_spots ?? ""} />
        </div>
        <div>
          <label className={labelClass} htmlFor="areaM2">Área (m²)</label>
          <input className={inputClass} id="areaM2" name="areaM2" type="number" step="0.01" defaultValue={initial?.area_m2 ?? ""} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-[var(--color-fg-muted)]">
        <input type="checkbox" name="furnished" defaultChecked={initial?.furnished} className="h-4 w-4" />
        Mobiliado
      </label>

      <div>
        <label className={labelClass} htmlFor="photos">
          {initial ? "Adicionar mais fotos" : "Fotos do imóvel"}
        </label>
        <input
          className={`${inputClass} file:mr-4 file:rounded-full file:border-0 file:bg-[var(--color-neon-soft)] file:px-4 file:py-1.5 file:text-[var(--color-neon)]`}
          id="photos"
          name="photos"
          type="file"
          accept="image/*,video/*"
          multiple
        />
      </div>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state?.success && <p className="text-sm text-emerald-400">{state.success}</p>}

      <SubmitButton>{submitLabel}</SubmitButton>
    </form>
  );
}
