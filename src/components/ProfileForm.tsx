"use client";

import { useActionState } from "react";
import Image from "next/image";
import { updateProfileAction } from "@/app/painel/actions";
import { inputClass, labelClass, cardClass } from "@/components/ui/styles";
import { SubmitButton } from "@/components/ui/SubmitButton";
import type { Profile } from "@/lib/supabase/types";

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction] = useActionState(updateProfileAction, undefined);

  return (
    <form action={formAction} className={`${cardClass} space-y-5`}>
      {profile.avatar_url && (
        <Image
          src={profile.avatar_url}
          alt={profile.full_name}
          width={80}
          height={80}
          className="rounded-full object-cover"
        />
      )}

      <div>
        <label className={labelClass} htmlFor="avatar">Foto de perfil</label>
        <input
          className={`${inputClass} file:mr-4 file:rounded-full file:border-0 file:bg-[var(--color-neon-soft)] file:px-4 file:py-1.5 file:text-[var(--color-neon)]`}
          id="avatar"
          name="avatar"
          type="file"
          accept="image/*"
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="fullName">Nome</label>
        <input className={inputClass} id="fullName" name="fullName" defaultValue={profile.full_name} required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="phone">Telefone</label>
          <input className={inputClass} id="phone" name="phone" defaultValue={profile.phone ?? ""} />
        </div>
        <div>
          <label className={labelClass} htmlFor="whatsapp">WhatsApp (com DDI, só números)</label>
          <input className={inputClass} id="whatsapp" name="whatsapp" placeholder="5512988904211" defaultValue={profile.whatsapp ?? ""} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="creci">CRECI</label>
          <input className={inputClass} id="creci" name="creci" defaultValue={profile.creci ?? ""} />
        </div>
        <div>
          <label className={labelClass} htmlFor="instagram">Instagram</label>
          <input className={inputClass} id="instagram" name="instagram" defaultValue={profile.instagram ?? ""} />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="region">Região de atuação</label>
        <input className={inputClass} id="region" name="region" defaultValue={profile.region ?? ""} />
      </div>

      <div>
        <label className={labelClass} htmlFor="specialties">Especialidades (separadas por vírgula)</label>
        <input className={inputClass} id="specialties" name="specialties" defaultValue={profile.specialties?.join(", ") ?? ""} />
      </div>

      <div>
        <label className={labelClass} htmlFor="bio">Bio</label>
        <textarea className={inputClass} id="bio" name="bio" rows={3} defaultValue={profile.bio ?? ""} />
      </div>

      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state?.success && <p className="text-sm text-emerald-400">{state.success}</p>}

      <SubmitButton>Salvar perfil</SubmitButton>
    </form>
  );
}
