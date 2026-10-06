import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/contexts/AdminContext";
import { Package, FolderOpen, Users, ShoppingBag, IndianRupee, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { api } from "@/lib/api";

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-500/10 text-yellow-600",
  Processing: "bg-blue-500/10 text-blue-600",
  Shipped: "bg-purple-500/10 text-purple-600",
  Delivered: "bg-green-500/10 text-green-600",
  Cancelled: "bg-red-500/10 text-red-600",
};

export default function AdminDashboard() {
  const { adminProducts, adminCollections, adminOrders, adminCustomers } = useAdmin();
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    api.analytics.get().then(setAnalytics).catch(console.error);
  }, []);

  const stats = [
    { label: "Products", value: adminProducts.length, icon: Package, link: "/admin/products", color: "text-blue-500" },
    { label: "Collections", value: adminCollections.length, icon: FolderOpen, link: "/admin/collections", color: "text-purple-500" },
    { label: "Orders", value: adminOrders.length, icon: ShoppingBag, link: "/admin/orders", color: "text-orange-500" },
    { label: "Customers", value: adminCustomers.length, icon: Users, link: "/admin/customers", color: "text-green-500" },
  ];

  const totalRevenue = analytics?.totalRevenue ?? 0;
  const paidOrders = analytics?.paidOrders ?? 0;
  const recentOrders: any[] = analytics?.recentOrders ?? [];

  return (
    <AdminLayout>
      <h2 className="text-2xl font-heading tracking-tight mb-8">Dashboard</h2>

      {/* Revenue highlight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-1 bg-primary text-primary-foreground rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <IndianRupee className="h-5 w-5 opacity-70" />
            <span className="text-xs font-semibold tracking-widest uppercase opacity-70">Total Revenue</span>
          </div>
          <p className="text-3xl font-heading">₹{totalRevenue.toLocaleString()}</p>
          <p className="text-xs mt-1 opacity-60">{paidOrders} paid order{paidOrders !== 1 ? "s" : ""}</p>
        </div>

        <div className="bg-background border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Pending</span>
          </div>
          <p className="text-3xl font-heading">{analytics?.statusCounts?.Pending ?? 0}</p>
          <p className="text-xs mt-1 text-muted-foreground">orders to ship</p>
        </div>

        <div className="bg-background border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Delivered</span>
          </div>
          <p className="text-3xl font-heading">{analytics?.statusCounts?.Delivered ?? 0}</p>
          <p className="text-xs mt-1 text-muted-foreground">orders fulfilled</p>
        </div>
      </div>

      {/* Count stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <a key={stat.label} href={stat.link} className="bg-background border border-border rounded-lg p-6 hover:border-foreground/20 transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <stat.icon className={`h-5 w-5 ${stat.color} opacity-70`} />
              <span className="text-xs font-semibold tracking-[0.1em] uppercase text-muted-foreground group-hover:text-foreground transition-colors">{stat.label}</span>
            </div>
            <p className="text-3xl font-heading">{stat.value}</p>
          </a>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-background border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold tracking-[0.1em] uppercase flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" /> Recent Orders
            </h3>
            <a href="/admin/orders" className="text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest">View all →</a>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">₹{order.amount.toLocaleString()}</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${statusColors[order.shippingStatus] || "bg-secondary"}`}>
                      {order.shippingStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-background border border-border rounded-lg p-6">
          <h3 className="text-sm font-semibold tracking-[0.1em] uppercase mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-2">
            <a href="/admin/products" className="border border-border rounded-md px-4 py-3 text-[10px] uppercase font-bold tracking-widest hover:bg-secondary transition-colors text-center">Add Product</a>
            <a href="/admin/collections" className="border border-border rounded-md px-4 py-3 text-[10px] uppercase font-bold tracking-widest hover:bg-secondary transition-colors text-center">Add Collection</a>
            <a href="/admin/orders" className="border border-border rounded-md px-4 py-3 text-[10px] uppercase font-bold tracking-widest hover:bg-secondary transition-colors text-center">Manage Orders</a>
            <a href="/admin/media" className="border border-border rounded-md px-4 py-3 text-[10px] uppercase font-bold tracking-widest hover:bg-secondary transition-colors text-center">Upload Media</a>
            <a href="/admin/homepage" className="border border-border rounded-md px-4 py-3 text-[10px] uppercase font-bold tracking-widest hover:bg-secondary transition-colors text-center">Edit Homepage</a>
            <a href="/admin/settings" className="border border-border rounded-md px-4 py-3 text-[10px] uppercase font-bold tracking-widest hover:bg-secondary transition-colors text-center">Site Settings</a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
