"use client";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function ProductTable({ products }: { products: any[] }) {
  const supabase = createClient();

  const updateProduct = async (id: string, field: string, value: any) => {
    await supabase.from("products").update({ [field]: value }).eq("id", id);
    window.location.reload(); // Recarga para ver cambios
  };

  const deleteProduct = async (id: string) => {
    if (confirm("¿Estás seguro?")) {
      await supabase.from("products").delete().eq("id", id);
      window.location.reload();
    }
  };

  return (
    <div className="bg-[#1a1a1a] text-white p-6 rounded-2xl overflow-x-auto shadow-xl">
      <table className="w-full text-sm">
        <thead className="text-gray-400 border-b border-gray-700">
          <tr>
            <th className="p-3 text-left">PRODUCTO</th>
            <th className="p-3">DESTACADO</th>
            <th className="p-3">OFERTA</th>
            <th className="p-3">STOCK</th>
            <th className="p-3">ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-gray-800 hover:bg-white/5">
              <td className="p-3 flex items-center gap-3">{p.name}</td>
              <td className="p-3 text-center">
                <input type="checkbox" checked={p.is_featured} onChange={(e) => updateProduct(p.id, "is_featured", e.target.checked)} className="cursor-pointer" />
              </td>
              <td className="p-3 text-center">
                <input type="checkbox" checked={p.is_on_sale} onChange={(e) => updateProduct(p.id, "is_on_sale", e.target.checked)} className="cursor-pointer" />
              </td>
              <td className="p-3 flex items-center justify-center gap-3">
                <button onClick={() => updateProduct(p.id, "stock", Math.max(0, p.stock - 1))} className="bg-red-900 px-2 rounded">-</button>
                {p.stock}
                <button onClick={() => updateProduct(p.id, "stock", p.stock + 1)} className="bg-green-900 px-2 rounded">+</button>
              </td>
              <td className="p-3 text-center">
                <button onClick={() => deleteProduct(p.id)} className="text-red-400 hover:text-red-300">🗑️ Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}