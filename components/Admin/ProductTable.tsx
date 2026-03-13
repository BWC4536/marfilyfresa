"use client";
import { createClient } from "@/utils/supabase/client";

export default function ProductTable({ products }: { products: any[] }) {
  const supabase = createClient();

  const updateProduct = async (id: string, field: string, value: any) => {
    await supabase.from("products").update({ [field]: value }).eq("id", id);
    window.location.reload();
  };

  const deleteProduct = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      await supabase.from("products").delete().eq("id", id);
      window.location.reload();
    }
  };

  return (
    <div className="bg-[#FADADD]/20 text-[#333333] p-6 rounded-3xl overflow-x-auto shadow-sm border border-[#E6E6FA]">
      <table className="w-full text-sm">
        <thead className="text-gray-600 border-b border-[#FADADD]">
          <tr>
            <th className="p-3 text-left">PRODUCTO</th>
            <th className="p-3">DEST</th>
            <th className="p-3">OFER</th>
            <th className="p-3">STOCK</th>
            <th className="p-3">ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-[#E6E6FA]/50 hover:bg-white/50">
              <td className="p-3 flex items-center gap-3 font-medium">{p.name}</td>
              <td className="p-3 text-center">
                <input type="checkbox" checked={p.is_featured} onChange={(e) => updateProduct(p.id, "is_featured", e.target.checked)} className="accent-[#FADADD] cursor-pointer" />
              </td>
              <td className="p-3 text-center">
                <input type="checkbox" checked={p.is_on_sale} onChange={(e) => updateProduct(p.id, "is_on_sale", e.target.checked)} className="accent-[#FADADD] cursor-pointer" />
              </td>
              <td className="p-3 flex items-center justify-center gap-3">
                <button onClick={() => updateProduct(p.id, "stock", Math.max(0, p.stock - 1))} className="bg-[#E6E6FA] px-2 rounded-full">-</button>
                {p.stock}
                <button onClick={() => updateProduct(p.id, "stock", p.stock + 1)} className="bg-[#E6E6FA] px-2 rounded-full">+</button>
              </td>
              <td className="p-3 text-center">
                <button onClick={() => deleteProduct(p.id)} className="text-red-400 hover:text-red-600">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}