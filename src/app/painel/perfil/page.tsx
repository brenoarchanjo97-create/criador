import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/ProfileForm";

export default async function PerfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-3xl">Meu perfil</h1>
      <p className="mt-1 text-sm text-[var(--color-fg-muted)]">
        Essas informações aparecem para quem entra em contato pelos seus imóveis.
      </p>
      <div className="mt-8">
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
}
