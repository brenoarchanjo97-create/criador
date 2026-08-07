"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { testimonialSchema } from "@/lib/validations";

export type PublicActionState = { error?: string; success?: string } | undefined;

export async function submitTestimonialAction(
  _prevState: PublicActionState,
  formData: FormData
): Promise<PublicActionState> {
  const parsed = testimonialSchema.safeParse({
    name: formData.get("name"),
    quote: formData.get("quote"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").insert({
    name: parsed.data.name,
    quote: parsed.data.quote,
    approved: false,
  });

  if (error) {
    return { error: "Não foi possível enviar seu depoimento agora." };
  }

  revalidatePath("/");
  return { success: "Obrigado! Seu depoimento será exibido após aprovação." };
}

export async function incrementPropertyViewAction(propertyId: string) {
  const supabase = await createClient();
  await supabase.rpc("increment_property_view", { property_id: propertyId });
}
