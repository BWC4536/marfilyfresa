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
    <form className="bg-[#FADADD]/30 p-8 rounded-3xl border border-[#E6E6FA] space-y-4">
  {/* Inputs con borde más suave */}
  <input name="name" className="w-full p-3 rounded-xl border border-[#E6E6FA] bg-white/50" />
  {/* Botón */}
  <button className="bg-[#333333] text-[#FFFFF0] px-8 py-3 rounded-full hover:bg-[#FADADD] hover:text-black transition-all">
    Publicar
  </button>
</form>
  );
}