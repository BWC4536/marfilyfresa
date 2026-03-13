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

  // 3. Consulta de lista de deseos
  const { data: wishlistStats } = await supabase
    .from('wishlist')
    .select('product_name');

  const stats = wishlistStats?.reduce((acc: any, item: any) => {
    acc[item.product_name] = (acc[item.product_name] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 bg-[#0f0f0f] min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-12">Admin Dashboard</h1>
      
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-gray-800 shadow-sm">
          <h3 className="text-gray-400">Total Orders</h3>
          <p className="text-4xl font-bold">{ordersCount || 0}</p>
        </div>
        <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-gray-800 shadow-sm">
          <h3 className="text-gray-400">Total Revenue</h3>
          <p className="text-4xl font-bold">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-gray-800 shadow-sm">
          <h3 className="text-gray-400">Active Users</h3>
          <p className="text-4xl font-bold">{usersCount || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna izquierda: Tabla y Formulario */}
        <div className="lg:col-span-2 space-y-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Inventory Management</h2>
            <ProductTable products={products || []} />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
            <ProductForm />
          </div>
        </div>

        {/* Columna derecha: Wishlist Stats */}
        <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-gray-800 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Wishlist Stats</h2>
          <div className="space-y-4">
            {!stats || Object.keys(stats).length === 0 ? (
              <p className="text-gray-500">No items in wishlists yet.</p>
            ) : (
              Object.entries(stats).map(([name, count]: any) => (
                <div key={name} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-gray-800">
                  <span className="font-medium text-sm">{name}</span>
                  <span className="bg-mf-primary text-black px-3 py-1 rounded-full text-xs font-bold">
                    {count} {count === 1 ? 'user' : 'users'}
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