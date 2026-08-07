import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updatePropertyAction, deletePropertyPhotoAction } from "@/app/painel/actions";
import { PropertyForm } from "@/components/PropertyForm";
import { dangerButtonClass } from "@/components/ui/styles";

export default async function EditarImovelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: property } = await supabase.from("properties").select("*").eq("id", id).single();
  if (!property) notFound();

  const { data: photos } = await supabase
    .from("property_photos")
    .select("*")
    .eq("property_id", id)
    .order("sort_order", { ascending: true });

  const boundUpdate = updatePropertyAction.bind(null, id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-3xl">Editar imóvel</h1>

      {photos && photos.length > 0 && (
        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative aspect-square overflow-hidden rounded-xl">
              {photo.is_video ? (
                <video src={photo.url} className="h-full w-full object-cover" muted />
              ) : (
                <Image src={photo.url} alt="" fill className="object-cover" />
              )}
              <form
                action={deletePropertyPhotoAction.bind(null, photo.id, id)}
                className="absolute inset-x-0 bottom-0 bg-black/60 p-1"
              >
                <button type="submit" className={`${dangerButtonClass} w-full py-0.5 text-xs`}>
                  Remover
                </button>
              </form>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <PropertyForm action={boundUpdate} initial={property} submitLabel="Salvar alterações" />
      </div>
    </div>
  );
}
