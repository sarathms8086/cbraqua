import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/contexts/AdminContext";
import { Mail, Phone, MapPin, Calendar, ShoppingBag } from "lucide-react";

export default function AdminCustomers() {
  const { adminCustomers } = useAdmin();

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-heading tracking-tight">Customers</h2>
        <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
          Total: {adminCustomers.length}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminCustomers.map((customer) => (
          <div key={customer.id} className="bg-background border border-border rounded-lg p-6 hover:border-foreground/20 transition-colors">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg font-heading tracking-tight">{customer.firstName} {customer.lastName}</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">{customer.id.split('-')[0]}</p>
              </div>
              <div className="bg-secondary p-2 rounded-full">
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{customer.email}</span>
              </div>
              {customer.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {new Date(customer.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="pt-6 border-t border-border flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Orders</span>
                <span className="text-xl font-heading">{customer._count.orders}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Addresses</span>
                <span className="text-xl font-heading">{customer.addresses.length}</span>
              </div>
            </div>

            {customer.addresses.length > 0 && (
              <div className="mt-4 pt-4 border-t border-dashed border-border">
                <div className="flex items-start gap-2 text-[10px] text-muted-foreground">
                  <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span className="uppercase">
                    {customer.addresses[0].city}, {customer.addresses[0].country}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
        {adminCustomers.length === 0 && (
          <div className="col-span-full py-20 text-center border border-dashed border-border rounded-lg bg-secondary/10">
            <p className="text-muted-foreground italic">No customers registered yet.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
