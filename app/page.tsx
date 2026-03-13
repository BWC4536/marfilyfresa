"use client";

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

// Componente individual para manejar el estado del efecto y el click
function ProductCard({ product }: { product: Product }) {
  const supabase = createClient();

  const addToWishlist = async () => {
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
    <div className="group relative bg-white/60 backdrop-blur-md border border-white/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 ease-in-out flex flex-col hover:scale-105 hover:z-10">
      {/* El efecto de desenfoque se aplica a los hermanos cuando el padre (la grid) tiene group-hover */}
      <div className="relative w-full h-80 overflow-hidden bg-mf-secondary/10 flex items-center justify-center">
        {product.image_url ? (
          <Image 
            src={product.image_url} 
            alt={product.name} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
          />
        ) : (
          <span className="text-mf-charcoal/40 font-serif italic">No image</span>
        )}
      </div>
      <div className="p-6 text-center flex-grow flex flex-col justify-end">
        <h3 className="font-serif text-xl font-semibold mb-2 text-mf-charcoal">{product.name}</h3>
        <p className="text-mf-charcoal/70 font-medium mb-4">${product.price.toFixed(2)}</p>
        <button 
          onClick={addToWishlist}
          className="bg-mf-primary hover:bg-pink-300 text-mf-charcoal font-semibold py-2 px-4 rounded-full transition-all duration-300 shadow-sm"
        >
          ❤ Añadir a Deseos
        </button>
      </div>
    </div>
  );
}

export default async function Home() {
  const supabase = createClient();
  
  // Filtramos stock > 0 para que no aparezcan agotados
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .gt('stock', 0)
    .order('created_at', { ascending: false });

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <section className="w-full relative py-32 px-6 flex items-center justify-center bg-mf-secondary/20 overflow-hidden">
        <div className="relative z-10 max-w-4xl text-center flex flex-col items-center">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-mf-charcoal mb-6">Elegance in Every Detail</h1>
          <Link href="/login" className="bg-mf-charcoal text-mf-background font-semibold py-4 px-10 rounded-full hover:bg-gray-800 transition-all transform hover:-translate-y-1">
            Shop the Collection
          </Link>
        </div>
      </section>

      <section className="w-full max-w-7xl mx-auto py-24 px-6">
        <h2 className="font-serif text-3xl font-bold text-center mb-16 text-mf-charcoal">Featured Pieces</h2>
        
        {/* El contenedor padre tiene group-hover:blur para desenfocar a los hermanos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 group/grid">
          {products?.map((product: Product) => (
            <div key={product.id} className="group/item transition-all duration-500 group-hover/grid:blur-[2px] hover:!blur-none">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}