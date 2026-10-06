import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/contexts/AdminContext";
import { Eye, X, FileDown } from "lucide-react";
import { formatPrice } from "@/lib/price";
import { downloadInvoice } from "@/lib/generateInvoice";
import { exportGSTCsv } from "@/lib/exportGST";

const shippingStatusColors = {
  Pending: "bg-yellow-500/10 text-yellow-600",
  Processing: "bg-blue-500/10 text-blue-600",
  Shipped: "bg-purple-500/10 text-purple-600",
  Delivered: "bg-green-500/10 text-green-600",
  Cancelled: "bg-red-500/10 text-red-600",
};

const paymentBadge: Record<string, { label: string; className: string }> = {
  paid: { label: "Paid", className: "bg-green-500/10 text-green-700 border border-green-200" },
  failed: { label: "Failed", className: "bg-red-500/10 text-red-700 border border-red-200" },
  created: { label: "Awaiting Payment", className: "bg-yellow-500/10 text-yellow-700 border border-yellow-200" },
};

export default function AdminOrders() {
  const { adminOrders, updateOrderStatus, siteSettings } = useAdmin();
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-heading tracking-tight">Orders</h2>
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
            Total: {adminOrders.length}
          </span>
          <button
            onClick={() => exportGSTCsv(adminOrders, siteSettings)}
            className="flex items-center gap-2 border border-border px-4 py-2 text-xs font-semibold tracking-widest uppercase hover:bg-secondary transition-colors"
          >
            <FileDown className="h-3.5 w-3.5" />
            Export GST
          </button>
        </div>
      </div>

      <div className="bg-background border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-4 py-3 text-xs font-semibold tracking-[0.1em] uppercase text-muted-foreground">Order ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold tracking-[0.1em] uppercase text-muted-foreground">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-semibold tracking-[0.1em] uppercase text-muted-foreground">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold tracking-[0.1em] uppercase text-muted-foreground">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-semibold tracking-[0.1em] uppercase text-muted-foreground">Payment</th>
                <th className="text-left px-4 py-3 text-xs font-semibold tracking-[0.1em] uppercase text-muted-foreground">Shipping</th>
                <th className="text-right px-4 py-3 text-xs font-semibold tracking-[0.1em] uppercase text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminOrders.map((order) => (
                <tr key={order.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-[10px] uppercase">{order.orderId}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium">{order.customerName}</span>
                      <span className="text-[10px] text-muted-foreground uppercase">{order.customerEmail}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 font-medium">₹{order.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    {(() => {
                      const badge = paymentBadge[order.status] ?? paymentBadge.created;
                      return (
                        <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full ${badge.className}`}>
                          {badge.label}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.shippingStatus || "Pending"}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`text-[10px] uppercase font-bold px-2 py-1 rounded border-none focus:ring-1 focus:ring-foreground cursor-pointer ${shippingStatusColors[order.shippingStatus as keyof typeof shippingStatusColors] || "bg-secondary"}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => downloadInvoice(order, siteSettings)}
                        title="Download Invoice"
                        className="p-1.5 hover:bg-secondary rounded transition-colors"
                      >
                        <FileDown className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        title="View Order"
                        className="p-1.5 hover:bg-secondary rounded transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {adminOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground italic">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
          <div className="bg-background border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
              <div>
                <h3 className="text-lg font-heading uppercase tracking-tight">Order Details</h3>
                <p className="text-[10px] font-mono text-muted-foreground uppercase">{selectedOrder.orderId}</p>
                {(() => {
                  const badge = paymentBadge[selectedOrder.status] ?? paymentBadge.created;
                  return (
                    <span className={`inline-block mt-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${badge.className}`}>
                      {badge.label}
                    </span>
                  );
                })()}
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-secondary rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Customer Information</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="text-muted-foreground">Name:</span> {selectedOrder.customerName}</p>
                  <p><span className="text-muted-foreground">Email:</span> {selectedOrder.customerEmail}</p>
                  <p><span className="text-muted-foreground">Phone:</span> {selectedOrder.customerPhone}</p>
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Shipping Address</h4>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{selectedOrder.address}</p>
                {selectedOrder.billingAddress && (
                  <div className="mt-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Billing Address</h4>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{selectedOrder.billingAddress}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Order Items</h4>
              <div className="border border-border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50 border-b border-border">
                    <tr>
                      <th className="text-left px-3 py-2 text-[10px] uppercase font-bold">Item</th>
                      <th className="text-center px-3 py-2 text-[10px] uppercase font-bold">Qty</th>
                      <th className="text-right px-3 py-2 text-[10px] uppercase font-bold">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {JSON.parse(selectedOrder.items || "[]").map((item: any, idx: number) => (
                      <tr key={idx} className="border-b border-border last:border-0">
                        <td className="px-3 py-3">
                          <div className="flex flex-col">
                            <span className="font-medium">{item.name}</span>
                            <span className="text-[10px] text-muted-foreground uppercase">{item.color} / {item.size}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center">{item.quantity}</td>
                        <td className="px-3 py-3 text-right">{formatPrice(item.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-secondary/20">
                    <tr>
                      <td colSpan={2} className="px-3 py-3 text-right font-bold uppercase text-[10px]">Total</td>
                      <td className="px-3 py-3 text-right font-bold text-lg">₹{selectedOrder.amount.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={() => downloadInvoice(selectedOrder, siteSettings)}
                className="flex items-center gap-2 border border-border px-6 py-2.5 text-xs font-semibold tracking-widest uppercase hover:bg-secondary transition-colors"
              >
                <FileDown className="h-3.5 w-3.5" />
                Download Invoice
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-primary text-primary-foreground px-8 py-2.5 text-xs font-semibold tracking-widest uppercase rounded-md hover:bg-primary/90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
