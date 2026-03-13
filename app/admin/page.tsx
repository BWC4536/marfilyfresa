import { createClient } from "@/utils/supabase/server";
import ProductForm from "@/components/Admin/ProductForm";

export const revalidate = 0;

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Si no hay usuario, evitar error
  if (!user) return null;

  // 1. Contar total de pedidos con tipado seguro
  const { count: ordersCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  // 2. Calcular ingresos
  const { data: ordersData } = await supabase
    .from('orders')
    .select('total_amount');
    
  // Forzar que ordersData sea un array aunque venga null
  const totalRevenue = (ordersData || []).reduce((acc: number, order: any) => acc + Number(order.total_amount || 0), 0);

  // 3. Contar total de usuarios
  const { count: usersCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-12">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/70 p-8 rounded-3xl border">
          <h3 className="text-lg">Total Orders</h3>
          <p className="text-4xl font-bold">{ordersCount || 0}</p>
        </div>
        <div className="bg-white/70 p-8 rounded-3xl border">
          <h3 className="text-lg">Total Revenue</h3>
          <p className="text-4xl font-bold">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white/70 p-8 rounded-3xl border">
          <h3 className="text-lg">Active Users</h3>
          <p className="text-4xl font-bold">{usersCount || 0}</p>
        </div>
      </div>
      <ProductForm />
    </div>
  );
} 