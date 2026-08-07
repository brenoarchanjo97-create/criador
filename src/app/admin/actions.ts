"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { BrokerStatus } from "@/lib/supabase/types";

export async function setBrokerStatusAction(brokerId: string, status: BrokerStatus) {
  const supabase = await createClient();
  await supabase.from("profiles").update({ status }).eq("id", brokerId);
  revalidatePath("/admin/corretores");
}

export async function setPropertyVisibilityAction(propertyId: string, visible: boolean) {
  const supabase = await createClient();
  await supabase.from("properties").update({ visible }).eq("id", propertyId);
  revalidatePath("/admin/imoveis");
  revalidatePath("/imoveis");
}

export async function deletePropertyAdminAction(propertyId: string) {
  const supabase = await createClient();

  const { data: photos } = await supabase
    .from("property_photos")
    .select("storage_path")
    .eq("property_id", propertyId);

  if (photos && photos.length > 0) {
    await supabase.storage.from("property-photos").remove(photos.map((p) => p.storage_path));
  }

  await supabase.from("properties").delete().eq("id", propertyId);
  revalidatePath("/admin/imoveis");
  revalidatePath("/imoveis");
}

export async function setTestimonialApprovedAction(testimonialId: string, approved: boolean) {
  const supabase = await createClient();
  await supabase.from("testimonials").update({ approved }).eq("id", testimonialId);
  revalidatePath("/admin/depoimentos");
  revalidatePath("/");
}

export async function deleteTestimonialAction(testimonialId: string) {
  const supabase = await createClient();
  await supabase.from("testimonials").delete().eq("id", testimonialId);
  revalidatePath("/admin/depoimentos");
  revalidatePath("/");
}
