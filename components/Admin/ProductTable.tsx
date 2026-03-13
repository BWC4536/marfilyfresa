"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import EditModal from "./EditModal";

export default function ProductTable({ products }: { products: any[] }) {
  const [editing, setEditing] = useState<any>(null);
  const supabase = createClient();

  const updateProduct = async (id: string, field: string, value: any) => {
    await supabase.from("products").update({ [field]: value }).eq("id", id);
  };

  const deleteProduct = async (id: string) => {
    if (confirm("¿Eliminar producto permanentemente?")) {
      await supabase.from("products").delete().eq("id", id);
      window.location.reload();
    }
  };

  return (
    <div className="bg-white/70 p-6 rounded-3xl border border-[#FADADD] overflow-x-auto shadow-sm">
      {editing && <EditModal product={editing} onClose={() => setEditing(null)} />}
      <table className="w-full text-sm">
        <thead className="text-[#333333] border-b border-[#FADADD]">
          <tr>
            <th className="p-3 text-left">FOTO</th>
            <th className="p-3">NOMBRE</th>
            <th className="p-3">PRECIO</th>
            <th className="p-3">STOCK</th>
            <th className="p-3">DEST/OFER</th>
            <th className="p-3">ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-[#E6E6FA]/50">
              <td className="p-3"><img src={p.image_url} className="w-12 h-12 rounded-lg object-cover" /></td>
              <td className="p-3">
                <input defaultValue={p.name} onBlur={(e) => updateProduct(p.id, "name", e.target.value)} className="bg-transparent border-b border-transparent hover:border-[#FADADD] focus:border-[#FADADD] outline-none" />
              </td>
              <td className="p-3">
                <input type="number" defaultValue={p.price} onBlur={(e) => updateProduct(p.id, "price", parseFloat(e.target.value))} className="w-16 bg-transparent border-b border-transparent hover:border-[#FADADD] outline-none" />
              </td>
              <td className="p-3 flex items-center gap-2">
                <button onClick={() => updateProduct(p.id, "stock", Math.max(0, p.stock - 1))}>-</button>
                {p.stock}
                <button onClick={() => updateProduct(p.id, "stock", p.stock + 1)}>+</button>
              </td>
              <td className="p-3 text-center">
                <input type="checkbox" checked={p.is_featured} onChange={(e) => updateProduct(p.id, "is_featured", e.target.checked)} className="mr-2 accent-[#FADADD]" />
                <input type="checkbox" checked={p.is_on_sale} onChange={(e) => updateProduct(p.id, "is_on_sale", e.target.checked)} className="accent-[#FADADD]" />
              </td>
              <td className="p-3 text-center flex gap-2">
                <button onClick={() => setEditing(p)} className="text-blue-500 hover:text-blue-700">✏️</button>
                <button onClick={() => deleteProduct(p.id)} className="text-red-400 hover:text-red-600">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}