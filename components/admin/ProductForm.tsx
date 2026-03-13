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
    const name = formData.get("name") as string;
    const price = formData.get("price") as string;

    try {
      // 1. Subir imagen al Bucket 'products'
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      // 3. Insertar en tabla 'products'
      const { error: insertError } = await supabase.from("products").insert({
        name,
        price: parseFloat(price),
        image_url: publicUrl,
      });

      if (insertError) throw insertError;
      alert("Producto creado exitosamente");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error al subir el producto");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/60 p-6 rounded-2xl border border-white/50 space-y-4">
      <input name="name" placeholder="Nombre del producto" className="w-full p-2 rounded-lg border" required />
      <input name="price" type="number" step="0.01" placeholder="Precio" className="w-full p-2 rounded-lg border" required />
      <input name="image" type="file" accept="image/*" className="w-full" required />
      <button disabled={loading} className="bg-mf-charcoal text-white px-6 py-2 rounded-full">
        {loading ? "Subiendo..." : "Publicar Producto"}
      </button>
    </form>
  );
}