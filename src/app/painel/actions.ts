"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { propertySchema, profileSchema } from "@/lib/validations";
import type { PropertyType, PropertyStatus } from "@/lib/supabase/types";

export type ActionState = { error?: string; success?: string } | undefined;

function parsePropertyForm(formData: FormData) {
  return propertySchema.safeParse({
    type: formData.get("type"),
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    price: formData.get("price") || undefined,
    condoFee: formData.get("condoFee") || undefined,
    iptu: formData.get("iptu") || undefined,
    street: formData.get("street") || undefined,
    neighborhood: formData.get("neighborhood") || undefined,
    city: formData.get("city"),
    state: formData.get("state") || undefined,
    zip: formData.get("zip") || undefined,
    bedrooms: formData.get("bedrooms") || undefined,
    bathrooms: formData.get("bathrooms") || undefined,
    parkingSpots: formData.get("parkingSpots") || undefined,
    areaM2: formData.get("areaM2") || undefined,
    furnished: formData.get("furnished") === "on",
    status: formData.get("status"),
  });
}

async function uploadPhotos(
  supabase: Awaited<ReturnType<typeof createClient>>,
  propertyId: string,
  files: File[]
) {
  for (const file of files) {
    if (!file || file.size === 0) continue;

    const path = `${propertyId}/${crypto.randomUUID()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("property-photos")
      .upload(path, file, { contentType: file.type });

    if (uploadError) continue;

    const { data: publicUrl } = supabase.storage.from("property-photos").getPublicUrl(path);

    await supabase.from("property_photos").insert({
      property_id: propertyId,
      storage_path: path,
      url: publicUrl.publicUrl,
      is_video: file.type.startsWith("video/"),
    });
  }
}

export async function createPropertyAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = parsePropertyForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { data: property, error } = await supabase
    .from("properties")
    .insert({
      broker_id: user!.id,
      type: parsed.data.type as PropertyType,
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      price: parsed.data.price ?? null,
      condo_fee: parsed.data.condoFee ?? null,
      iptu: parsed.data.iptu ?? null,
      street: parsed.data.street ?? null,
      neighborhood: parsed.data.neighborhood ?? null,
      city: parsed.data.city,
      state: parsed.data.state ?? null,
      zip: parsed.data.zip ?? null,
      bedrooms: parsed.data.bedrooms ?? null,
      bathrooms: parsed.data.bathrooms ?? null,
      parking_spots: parsed.data.parkingSpots ?? null,
      area_m2: parsed.data.areaM2 ?? null,
      furnished: parsed.data.furnished ?? false,
      status: parsed.data.status as PropertyStatus,
    })
    .select()
    .single();

  if (error || !property) {
    return { error: error?.message ?? "Não foi possível criar o imóvel." };
  }

  const files = formData.getAll("photos") as File[];
  await uploadPhotos(supabase, property.id, files);

  revalidatePath("/painel");
  redirect("/painel");
}

export async function updatePropertyAction(
  propertyId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = parsePropertyForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { error } = await supabase
    .from("properties")
    .update({
      type: parsed.data.type as PropertyType,
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      price: parsed.data.price ?? null,
      condo_fee: parsed.data.condoFee ?? null,
      iptu: parsed.data.iptu ?? null,
      street: parsed.data.street ?? null,
      neighborhood: parsed.data.neighborhood ?? null,
      city: parsed.data.city,
      state: parsed.data.state ?? null,
      zip: parsed.data.zip ?? null,
      bedrooms: parsed.data.bedrooms ?? null,
      bathrooms: parsed.data.bathrooms ?? null,
      parking_spots: parsed.data.parkingSpots ?? null,
      area_m2: parsed.data.areaM2 ?? null,
      furnished: parsed.data.furnished ?? false,
      status: parsed.data.status as PropertyStatus,
    })
    .eq("id", propertyId);

  if (error) {
    return { error: error.message };
  }

  const files = (formData.getAll("photos") as File[]).filter((f) => f.size > 0);
  if (files.length > 0) {
    await uploadPhotos(supabase, propertyId, files);
  }

  revalidatePath("/painel");
  revalidatePath(`/painel/imoveis/${propertyId}/editar`);
  return { success: "Imóvel atualizado." };
}

export async function deletePropertyPhotoAction(photoId: string, propertyId: string) {
  const supabase = await createClient();

  const { data: photo } = await supabase
    .from("property_photos")
    .select("storage_path")
    .eq("id", photoId)
    .single();

  if (photo) {
    await supabase.storage.from("property-photos").remove([photo.storage_path]);
  }
  await supabase.from("property_photos").delete().eq("id", photoId);

  revalidatePath(`/painel/imoveis/${propertyId}/editar`);
}

export async function deletePropertyAction(propertyId: string) {
  const supabase = await createClient();

  const { data: photos } = await supabase
    .from("property_photos")
    .select("storage_path")
    .eq("property_id", propertyId);

  if (photos && photos.length > 0) {
    await supabase.storage.from("property-photos").remove(photos.map((p) => p.storage_path));
  }

  await supabase.from("properties").delete().eq("id", propertyId);
  revalidatePath("/painel");
}

export async function updateProfileAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = profileSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone") || undefined,
    whatsapp: formData.get("whatsapp") || undefined,
    creci: formData.get("creci") || undefined,
    bio: formData.get("bio") || undefined,
    instagram: formData.get("instagram") || undefined,
    region: formData.get("region") || undefined,
    specialties: formData.get("specialties") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const avatar = formData.get("avatar") as File | null;
  let avatarUrl: string | undefined;

  if (avatar && avatar.size > 0) {
    const path = `${user!.id}/${crypto.randomUUID()}-${avatar.name}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, avatar, { contentType: avatar.type });
    if (!uploadError) {
      const { data: publicUrl } = supabase.storage.from("avatars").getPublicUrl(path);
      avatarUrl = publicUrl.publicUrl;
    }
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName,
      phone: parsed.data.phone ?? null,
      whatsapp: parsed.data.whatsapp ?? null,
      creci: parsed.data.creci ?? null,
      bio: parsed.data.bio ?? null,
      instagram: parsed.data.instagram ?? null,
      region: parsed.data.region ?? null,
      specialties: parsed.data.specialties
        ? parsed.data.specialties.split(",").map((s) => s.trim()).filter(Boolean)
        : null,
      ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
    })
    .eq("id", user!.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/painel/perfil");
  revalidatePath("/", "layout");
  return { success: "Perfil atualizado." };
}
