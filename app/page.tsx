import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export const revalidate = 0; // Evita que la página cachee productos viejos

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  stock: number;
}

export default async function Home() {
  const supabase = await createClient();
  
  // Obtenemos los productos reales de la base de datos
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Hero Section */}
      <section className="w-full relative py-32 px-6 flex items-center justify-center bg-mf-secondary/20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-multiply bg-gradient-to-r from-mf-primary to-mf-accent blur-3xl rounded-full scale-150 transform -translate-y-1/4"></div>
        <div className="relative z-10 max-w-4xl text-center flex flex-col items-center">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-mf-charcoal mb-6 drop-shadow-sm">
            Elegance in Every Detail
          </h1>
          <p className="text-lg md:text-xl max-w-2xl text-mf-charcoal/80 mb-10 font-light leading-relaxed">
            Discover our exclusive collection of minimalist jewelry. Crafted with precision, designed for timeless beauty.
          </p>
          <Link 
            href="/login" 
            className="bg-mf-charcoal text-mf-background font-semibold py-4 px-10 rounded-full hover:bg-gray-800 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Shop the Collection
          </Link>
        </div>
      </section>

      {/* Product Grid */}
      <section className="w-full max-w-7xl mx-auto py-24 px-6">
        <h2 className="font-serif text-3xl font-bold text-center mb-16 text-mf-charcoal">
          Featured Pieces
        </h2>
        
        {!products || products.length === 0 ? (
          <div className="text-center text-mf-charcoal/60 bg-white/50 backdrop-blur-md p-10 rounded-3xl border border-white/50">
            <p className="text-lg font-medium">Our collection is currently being updated. Please check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product: Product) => (
              <div key={product.id} className="group bg-white/60 backdrop-blur-md border border-white/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 ease-in-out flex flex-col">
                <div className="relative w-full h-80 overflow-hidden bg-mf-secondary/10 flex items-center justify-center">
                  {product.image_url ? (
                    <Image 
                      src={product.image_url} 
                      alt={product.name} 
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    />
                  ) : (
                    <span className="text-mf-charcoal/40 font-serif italic">No image</span>
                  )}
                </div>
                <div className="p-6 text-center flex-grow flex flex-col justify-end">
                  <h3 className="font-serif text-xl font-semibold mb-2 text-mf-charcoal">{product.name}</h3>
                  <p className="text-mf-charcoal/70 font-medium">${product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}