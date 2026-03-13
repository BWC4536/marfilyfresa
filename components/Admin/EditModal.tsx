"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function EditModal({ product, onClose }: { product: any; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    let imageUrl = product.image_url;

    const file = formData.get("image") as File;
    if (file && file.size > 0) {
      const { data } = await supabase.storage.from("products").upload(`${Math.random()}.jpg`, file);
      const { data: { publicUrl } } = supabase.storage.from("products").getPublicUrl(data!.path);
      imageUrl = publicUrl;
    }

    await supabase.from("products").update({
      description: formData.get("description"),
      image_url: imageUrl
    }).eq("id", product.id);

    setLoading(false);
    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <form onSubmit={save} className="bg-[#FFFFF0] p-8 rounded-3xl w-full max-w-lg border border-[#FADADD] shadow-2xl space-y-4">
        <h2 className="text-xl font-bold font-serif text-[#333333]">Editar: {product.name}</h2>
        <textarea name="description" defaultValue={product.description} className="w-full p-3 rounded-xl border border-[#E6E6FA] bg-white" placeholder="Descripción..." rows={4} />
        <div className="space-y-1">
          <label className="text-xs text-gray-500">Cambiar Foto:</label>
          <input name="image" type="file" className="w-full" />
        </div>
        <div className="flex gap-4 pt-4">
          <button type="button" onClick={onClose} className="w-full py-3 rounded-full border border-gray-300">Cancelar</button>
          <button disabled={loading} className="w-full py-3 rounded-full bg-[#333333] text-[#FFFFF0]">{loading ? "Guardando..." : "Guardar"}</button>
        </div>
      </form>
    </div>
  );
}