import { createClient } from "@/utils/supabase/server";
import ProductForm from "@/components/Admin/ProductForm";
import ProductTable from "@/components/Admin/ProductTable";

export const revalidate = 0;

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // 1. Métricas base
  const { count: ordersCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  const { data: ordersData } = await supabase
    .from('orders')
    .select('total_amount');
    
  const totalRevenue = (ordersData || []).reduce((acc: number, order: any) => acc + Number(order.total_amount || 0), 0);

  const { count: usersCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  // 2. Consulta de productos para la tabla
  const { data: products } = await supabase.from('products').select('*');

  // 3. Consulta de lista de deseos mejorada (con JOIN)
  const { data: wishlistData } = await supabase
    .from('wishlist')
    .select('product_name, products(price, image_url)');

  const stats = wishlistData?.reduce((acc: any, item: any) => {
    acc[item.product_name] = {
      count: (acc[item.product_name]?.count || 0) + 1,
      price: item.products?.price || 0,
      image: item.products?.image_url || ""
    };
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 bg-[#FFFFF0] min-h-screen text-[#333333]">
      <h1 className="text-4xl font-bold mb-12 font-serif text-[#333333]">Admin Dashboard</h1>
      
      {/* Estadísticas - Estilo MarfilYFresa */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/70 p-8 rounded-3xl border border-[#FADADD] shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Orders</h3>
          <p className="text-4xl font-bold mt-2">{ordersCount || 0}</p>
        </div>
        <div className="bg-white/70 p-8 rounded-3xl border border-[#FADADD] shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Revenue</h3>
          <p className="text-4xl font-bold mt-2">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white/70 p-8 rounded-3xl border border-[#FADADD] shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Users</h3>
          <p className="text-4xl font-bold mt-2">{usersCount || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna izquierda: Tabla y Formulario */}
        <div className="lg:col-span-2 space-y-12">
          <div>
            <h2 className="text-2xl font-bold mb-6 font-serif">Inventory Management</h2>
            <ProductTable products={products || []} />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6 font-serif">Add New Product</h2>
            <ProductForm />
          </div>
        </div>

        {/* Columna derecha: Wishlist Stats */}
        <div className="bg-white/70 p-8 rounded-3xl border border-[#FADADD] shadow-sm h-fit">
          <h2 className="text-2xl font-bold mb-6 font-serif">Wishlist Stats</h2>
          <div className="space-y-4">
            {!stats || Object.keys(stats).length === 0 ? (
              <p className="text-gray-500 italic">No items in wishlists yet.</p>
            ) : (
              Object.entries(stats).map(([name, data]: any) => (
                <div key={name} className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-[#E6E6FA]">
                  <div className="flex items-center gap-3">
                    <img src={data.image} alt={name} className="w-12 h-12 rounded-lg object-cover border border-[#FADADD]" />
                    <div>
                      <p className="font-semibold text-sm">{name}</p>
                      <p className="text-xs text-gray-500">${data.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <span className="bg-[#FADADD] text-black px-3 py-1 rounded-full text-xs font-bold">
                    {data.count} {data.count === 1 ? 'user' : 'users'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}