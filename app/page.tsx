"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  stock: number;
}

function ProductCard({ product }: { product: Product }) {
  const [isZoomed, setIsZoomed] = useState(false);
  const supabase = createClient();

  const addToWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Por favor, inicia sesión para añadir a deseos.");
    
    await supabase.from("wishlist").insert({ 
      user_id: user.id, 
      product_id: product.id, 
      product_name: product.name 
    });
    alert("¡Añadido a tu lista de deseos!");
  };

  return (
    <>
      {/* Overlay para desenfocar el resto al hacer zoom */}
      {isZoomed && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setIsZoomed(false)} />}
      
      <div 
        onClick={() => setIsZoomed(!isZoomed)}
        className={`group/item transition-all duration-500 cursor-pointer ${isZoomed ? "fixed inset-0 z-50 m-auto w-[90vw] md:w-[600px] h-fit bg-white p-8 rounded-3xl shadow-2xl" : "bg-white/60 backdrop-blur-md border border-white/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:scale-105"}`}
      >
        <div className="relative w-full h-80 overflow-hidden bg-mf-secondary/10 flex items-center justify-center">
          {product.image_url ? (
            <Image src={product.image_url} alt={product.name} fill className="object-cover" sizes="100vw" />
          ) : <span className="text-mf-charcoal/40 font-serif italic">No image</span>}
        </div>
        
        <div className="p-6 text-center">
          <h3 className="font-serif text-xl font-semibold mb-2 text-mf-charcoal">{product.name}</h3>
          <p className="text-mf-charcoal/70 font-medium">${product.price.toFixed(2)}</p>
          
          {isZoomed && (
            <div className="mt-6 text-left border-t pt-4 animate-in fade-in zoom-in duration-300">
              <p className="text-mf-charcoal mb-4">{product.description || "Sin descripción disponible."}</p>
              <button onClick={addToWishlist} className="w-full bg-mf-primary hover:bg-pink-300 text-mf-charcoal font-semibold py-3 rounded-full transition-all">
                ❤ Añadir a Deseos
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase.from('products').select('*').gt('stock', 0);
      if (data) setProducts(data);
    }
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <section className="w-full py-32 bg-mf-secondary/20 text-center">
        <h1 className="font-serif text-5xl font-bold mb-6">Elegance in Every Detail</h1>
        <Link href="/login" className="bg-mf-charcoal text-mf-background py-4 px-10 rounded-full">Shop Now</Link>
      </section>

      <section className="w-full max-w-7xl py-24 px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => <ProductCard key={product.id} product={product} />)}
      </section>
    </div>
  );
}