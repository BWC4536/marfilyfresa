import { createClient } from "@/utils/supabase/server";
import ProductForm from "@/components/Admin/ProductForm";
import ProductTable from "@/components/Admin/ProductTable";

export const revalidate = 0;

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { count: ordersCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
  const { data: ordersData } = await supabase.from('orders').select('total_amount');
  const totalRevenue = (ordersData || []).reduce((acc, order) => acc + Number(order.total_amount || 0), 0);
  const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  const { data: products } = await supabase.from('products').select('*');
  const { data: wishlistData } = await supabase.from('wishlist').select('product_name, products(price, image_url)');

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
      <h1 className="text-4xl font-bold mb-12 font-serif">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/70 p-8 rounded-3xl border border-[#FADADD]"><h3 className="text-sm uppercase text-gray-500">Orders</h3><p className="text-4xl font-bold">{ordersCount || 0}</p></div>
        <div className="bg-white/70 p-8 rounded-3xl border border-[#FADADD]"><h3 className="text-sm uppercase text-gray-500">Revenue</h3><p className="text-4xl font-bold">${totalRevenue.toFixed(2)}</p></div>
        <div className="bg-white/70 p-8 rounded-3xl border border-[#FADADD]"><h3 className="text-sm uppercase text-gray-500">Users</h3><p className="text-4xl font-bold">{usersCount || 0}</p></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-12"><ProductTable products={products || []} /><ProductForm /></div>
        <div className="bg-white/70 p-8 rounded-3xl border border-[#FADADD] h-fit">
          <h2 className="text-2xl font-bold mb-6 font-serif">Wishlist Stats</h2>
          {Object.entries(stats || {}).map(([name, d]: any) => (
            <div key={name} className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-[#E6E6FA] mb-3">
              <div className="flex items-center gap-3"><img src={d.image} className="w-10 h-10 rounded-lg object-cover" /><div><p className="font-semibold text-sm">{name}</p><p className="text-xs text-gray-500">${d.price}</p></div></div>
              <span className="bg-[#FADADD] px-3 py-1 rounded-full text-xs font-bold">{d.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}