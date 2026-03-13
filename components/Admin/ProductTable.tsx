"use client";
import { createClient } from "@/utils/supabase/client";

export default function ProductTable({ products }: { products: any[] }) {
  const supabase = createClient();

  const updateProduct = async (id: string, field: string, value: any) => {
    await supabase.from("products").update({ [field]: value }).eq("id", id);
    window.location.reload();
  };

  return (
    <div className="w-full bg-[#1a1a1a] text-white p-6 rounded-2xl overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-400 text-sm border-b border-gray-700">
            <th className="p-3">PRODUCTO</th>
            <th className="p-3">DESTACADO</th>
            <th className="p-3">OFERTA</th>
            <th className="p-3">STOCK</th>
            <th className="p-3">ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-gray-800">
              <td className="p-3 flex items-center gap-3">
                <img src={p.image_url} className="w-10 h-10 rounded-full object-cover" />
                {p.name}
              </td>
              <td className="p-3">
                <input type="checkbox" checked={p.is_featured} onChange={(e) => updateProduct(p.id, "is_featured", e.target.checked)} />
              </td>
              <td className="p-3">
                <input type="checkbox" checked={p.is_on_sale} onChange={(e) => updateProduct(p.id, "is_on_sale", e.target.checked)} />
              </td>
              <td className="p-3 flex items-center gap-2">
                <button onClick={() => updateProduct(p.id, "stock", Math.max(0, p.stock - 1))}>-</button>
                {p.stock}
                <button onClick={() => updateProduct(p.id, "stock", p.stock + 1)}>+</button>
              </td>
              <td className="p-3">
                <button onClick={async() => { await supabase.from('products').delete().eq('id', p.id); window.location.reload(); }}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}