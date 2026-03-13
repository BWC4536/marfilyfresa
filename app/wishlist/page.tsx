import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 0;

export default async function WishlistPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Hacemos Join con la tabla products para traer su imagen y precio real
  const { data: wishlistItems, error } = await supabase
    .from('wishlist')
    .select(`
      id,
      product_name,
      products (
        id,
        name,
        price,
        image_url
      )
    `)
    .eq('user_id', user?.id);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 min-h-[70vh]">
      <h1 className="font-serif text-4xl font-bold text-mf-charcoal mb-4">Your Wishlist</h1>
      <p className="text-mf-charcoal/70 mb-12">Curated pieces you have saved for later.</p>

      {(!wishlistItems || wishlistItems.length === 0) ? (
        <div className="bg-white/60 backdrop-blur-md border border-white/50 rounded-3xl p-12 text-center shadow-sm">
          <p className="text-lg text-mf-charcoal/60 font-medium mb-6">Your wishlist is currently empty.</p>
          <Link href="/" className="inline-block bg-mf-primary text-mf-charcoal font-semibold py-3 px-8 rounded-full hover:bg-pink-300 transition-all">
            Explore Collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
           {wishlistItems.map((item: any) => {
              const product = item.products;
              
              return (
                <div key={item.id} className="bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
                  <div className="relative w-full h-64 bg-mf-secondary/20 flex items-center justify-center">
                    {product?.image_url ? (
                      <Image 
                        src={product.image_url} 
                        alt={product.name || item.product_name} 
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-mf-charcoal/40 font-serif italic text-sm">Image not available</span>
                    )}
                  </div>
                  <div className="p-5 text-center flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif font-semibold text-lg text-mf-charcoal mb-1">
                        {product ? product.name : item.product_name}
                      </h3>
                      {product && (
                        <p className="text-mf-charcoal/70 font-medium">${product.price.toFixed(2)}</p>
                      )}
                    </div>
                    <button className="mt-4 w-full border border-mf-charcoal text-mf-charcoal hover:bg-mf-charcoal hover:text-white font-medium py-2 rounded-full transition-all text-sm">
                      Remove
                    </button>
                  </div>
                </div>
              );
           })}
        </div>
      )}
    </div>
  );
}