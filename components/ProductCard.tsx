"use client";
import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

export default function ProductCard({ product }: { product: any }) {
  const [isZoomed, setIsZoomed] = useState(false);
  const supabase = createClient();

  const addToWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Inicia sesión para añadir a deseos.");
    
    await supabase.from("wishlist").insert({ 
      user_id: user.id, 
      product_id: product.id, 
      product_name: product.name 
    });
    alert("Producto añadido a tu lista de deseos");
  };

  return (
    <div className="relative z-10">
      {/* Overlay desenfoque al hacer zoom */}
      {isZoomed && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setIsZoomed(false)} />}
      
      <div 
        className={`bg-white/80 p-4 rounded-2xl shadow-lg transition-all duration-500 cursor-pointer 
        ${isZoomed ? "fixed inset-0 m-auto w-[90vw] md:w-[600px] h-fit z-50 p-8" : "w-full h-full hover:scale-105"}`}
        onClick={() => setIsZoomed(!isZoomed)}
      >
        <div className="relative w-full h-64 overflow-hidden rounded-xl">
          <Image src={product.image_url} alt={product.name} fill className="object-cover" />
        </div>
        <h3 className="text-2xl font-serif mt-4">{product.name}</h3>
        <p className="text-lg font-bold">${product.price}</p>
        
        {isZoomed && (
          <div className="mt-4 animate-in fade-in duration-700">
            <p className="text-gray-600 mb-4">{product.description || "Sin descripción disponible."}</p>
            <button onClick={addToWishlist} className="bg-mf-primary px-6 py-2 rounded-full font-bold">
              Añadir a Deseos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}