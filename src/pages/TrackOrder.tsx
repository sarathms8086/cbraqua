import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/price";

interface TrackedOrder {
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  shippingStatus: string;
  customerEmail: string;
  address: string;
  items: string;
  createdAt: string;
}

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOrder(null);
    setLoading(true);
    try {
      const result = await api.orders.track(orderId.trim(), email.trim());
      setOrder(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Order not found.");
    } finally {
      setLoading(false);
    }
  };

  const items = order ? JSON.parse(order.items) : [];

  return (
    <Layout>
      <div className="pt-[102px] md:pt-32 px-4 md:px-8 pb-16">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl md:text-4xl font-heading tracking-tight mb-2 text-center">
            Track Order
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-12">
            Enter your Order ID and the email used at checkout.
          </p>

          {error && (
            <div className="mb-6 bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold tracking-[0.1em] uppercase mb-2">Order ID</label>
              <input
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="order_xxxxxxxxxxxx"
                className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-[0.1em] uppercase mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-foreground text-background py-4 text-xs font-semibold tracking-[0.2em] uppercase hover:bg-foreground/90 transition-colors disabled:opacity-50"
            >
              {loading ? "SEARCHING..." : "TRACK ORDER"}
            </button>
          </form>

          {order && (
            <div className="mt-12 border-t border-border pt-8 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Order ID</p>
                  <p className="text-sm font-mono break-all">{order.orderId}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Placed</p>
                  <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-widest px-3 py-1.5 bg-secondary rounded-full">
                  Payment: {order.status}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest px-3 py-1.5 bg-secondary rounded-full">
                  Shipping: {order.shippingStatus}
                </span>
              </div>

              <div className="space-y-3">
                {items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm gap-4">
                    <span className="min-w-0">
                      {item.name}
                      {item.color && ` / ${item.color}`}
                      {item.size && ` / ${item.size}`} x{item.quantity}
                    </span>
                    <span className="font-mono shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-base font-heading tracking-tight border-t border-border pt-4">
                <span>TOTAL</span>
                <span>{formatPrice(order.amount)}</span>
              </div>

              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Shipping Address</p>
                <p className="text-sm">{order.address}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TrackOrder;
