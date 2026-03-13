"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function ProductForm() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const file = formData.get("image") as File;
    const { data: uploadData } = await supabase.storage.from("products").upload(`${Math.random()}.jpg`, file);
    const { data: { publicUrl } } = supabase.storage.from("products").getPublicUrl(uploadData!.path);

    await supabase.from("products").insert({
      name: formData.get("name"),
      price: parseFloat(formData.get("price") as string),
      description: formData.get("description"),
      is_featured: formData.get("is_featured") === "on",
      is_on_sale: formData.get("is_on_sale") === "on",
      image_url: publicUrl,
    });
    setLoading(false);
    window.location.reload();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#FADADD]/30 p-8 rounded-3xl border border-[#E6E6FA] shadow-sm space-y-4">
      <input name="name" placeholder="Nombre" className="w-full p-3 rounded-xl border border-[#E6E6FA] bg-white/50" required />
      <input name="price" type="number" placeholder="Precio" className="w-full p-3 rounded-xl border border-[#E6E6FA] bg-white/50" required />
      <textarea name="description" placeholder="Descripción" className="w-full p-3 rounded-xl border border-[#E6E6FA] bg-white/50" />
      <div className="flex gap-4 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" name="is_featured" className="accent-[#FADADD]" /> Destacado</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="is_on_sale" className="accent-[#FADADD]" /> En Oferta</label>
      </div>
      <input name="image" type="file" className="w-full" required />
      <button className="bg-[#333333] text-[#FFFFF0] px-8 py-3 rounded-full hover:bg-[#FADADD] hover:text-black transition-all">
        {loading ? "Publicando..." : "Publicar Producto"}
      </button>
    </form>
  );
}