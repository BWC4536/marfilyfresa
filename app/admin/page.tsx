import { createClient } from "@/utils/supabase/server";
import ProductForm from "@/components/Admin/ProductForm";

export const revalidate = 0;

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Contar total de pedidos
  const { count: ordersCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  // 2. Calcular ingresos totales
  const { data: ordersData } = await supabase
    .from('orders')
    .select('total_amount');
    
  const totalRevenue = ordersData?.reduce((acc, order) => acc + Number(order.total_amount), 0) || 0;

  // 3. Contar total de usuarios
  const { count: usersCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="font-serif text-4xl font-bold text-mf-charcoal mb-2">Admin Dashboard</h1>
          <p className="text-mf-charcoal/70">Welcome back, {user?.email}. Manage your elegant store.</p>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/70 backdrop-blur-md border border-white/50 rounded-3xl p-8 shadow-sm">
          <h3 className="font-medium text-lg mb-2 text-mf-charcoal/70">Total Orders</h3>
          <p className="text-4xl font-serif text-mf-charcoal font-bold">{ordersCount || 0}</p>
        </div>
        <div className="bg-white/70 backdrop-blur-md border border-white/50 rounded-3xl p-8 shadow-sm">
          <h3 className="font-medium text-lg mb-2 text-mf-charcoal/70">Total Revenue</h3>
          <p className="text-4xl font-serif text-mf-charcoal font-bold">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white/70 backdrop-blur-md border border-white/50 rounded-3xl p-8 shadow-sm">
          <h3 className="font-medium text-lg mb-2 text-mf-charcoal/70">Active Users</h3>
          <p className="text-4xl font-serif text-mf-charcoal font-bold">{usersCount || 0}</p>
        </div>
      </div>

      {/* Gestión de Productos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/70 backdrop-blur-md border border-white/50 rounded-3xl p-8 shadow-sm">
          <h3 className="font-serif text-2xl font-bold text-mf-charcoal mb-6">Add New Product</h3>
          <ProductForm />
        </div>
        
        <div className="bg-white/70 backdrop-blur-md border border-white/50 rounded-3xl p-8 shadow-sm">
          <h3 className="font-serif text-2xl font-bold text-mf-charcoal mb-6">Quick Actions</h3>
          <p className="text-mf-charcoal/70 mb-6">Use the form to upload products directly to the store and storage bucket.</p>
          <button className="w-full border border-mf-charcoal text-mf-charcoal font-semibold py-3 px-6 rounded-full hover:bg-mf-charcoal hover:text-white transition-all">
            View Recent Orders
          </button>
        </div>
      </div>
    </div>
  );
}