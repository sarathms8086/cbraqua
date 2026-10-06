import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/contexts/AdminContext";
import { api } from "@/lib/api";
import { downloadInvoice } from "@/lib/generateInvoice";

type Tab = "orders" | "addresses" | "details";

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-500/10 text-yellow-600",
  Processing: "bg-blue-500/10 text-blue-600",
  Shipped: "bg-purple-500/10 text-purple-600",
  Delivered: "bg-green-500/10 text-green-600",
  Cancelled: "bg-red-500/10 text-red-600",
};

const Account = () => {
  const { user, isAuthenticated, isLoading, logout, updateProfile } = useAuth();
  const { siteSettings } = useAdmin();
  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const [editFirst, setEditFirst] = useState("");
  const [editLast, setEditLast] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editing, setEditing] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setOrdersLoading(true);
    api.orders.getByUser(user.id)
      .then(setOrders)
      .catch(console.error)
      .finally(() => setOrdersLoading(false));
  }, [user?.id]);

  if (isLoading) return <Layout><div className="min-h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" /></div></Layout>;

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  const startEdit = () => {
    setEditFirst(user.firstName);
    setEditLast(user.lastName);
    setEditPhone(user.phone || "");
    setEditing(true);
  };

  const saveEdit = () => {
    updateProfile({ firstName: editFirst, lastName: editLast, phone: editPhone });
    setEditing(false);
  };

  const tabs: { label: string; value: Tab }[] = [
    { label: "Orders", value: "orders" },
    { label: "Addresses", value: "addresses" },
    { label: "Account Details", value: "details" },
  ];

  return (
    <Layout>
      <div className="pt-[102px] md:pt-32 px-4 md:px-8 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-heading tracking-tight mb-1">
            Welcome, {user.firstName}
          </h1>
          <p className="text-sm text-muted-foreground mb-12">{user.email}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`block w-full text-left text-sm py-2.5 px-3 transition-colors ${activeTab === tab.value ? "bg-secondary font-medium" : "hover:bg-secondary"}`}
                >
                  {tab.label}
                </button>
              ))}
              <button
                onClick={logout}
                className="block w-full text-left text-sm py-2.5 px-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign Out
              </button>
            </div>

            {/* Content */}
            <div className="md:col-span-2">
              {activeTab === "orders" && (
                <>
                  <h2 className="text-sm font-semibold tracking-[0.15em] uppercase mb-6">Order History</h2>
                  {ordersLoading ? (
                    <p className="text-sm text-muted-foreground">Loading orders…</p>
                  ) : orders.length === 0 ? (
                    <div className="border border-border p-8 text-center">
                      <p className="text-sm text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                      <Link
                        to="/shop"
                        className="inline-block border border-foreground px-8 py-3 text-xs font-semibold tracking-[0.2em] uppercase hover:bg-foreground hover:text-background transition-colors"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => {
                        const items = JSON.parse(order.items || "[]");
                        return (
                          <div key={order.id} className="border border-border p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <p className="text-[10px] font-mono text-muted-foreground uppercase">{order.orderId}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${statusColors[order.shippingStatus] || "bg-secondary"}`}>
                                  {order.shippingStatus}
                                </span>
                                <span className="text-sm font-semibold">₹{order.amount.toLocaleString()}</span>
                              </div>
                            </div>
                            <div className="space-y-1">
                              {items.map((item: any, i: number) => (
                                <div key={i} className="flex justify-between text-sm text-muted-foreground">
                                  <span>{item.name} <span className="text-[10px] uppercase">× {item.quantity}</span></span>
                                  <span className="text-[10px] uppercase">{item.color} / {item.size}</span>
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 pt-3 border-t border-border">
                              <button
                                onClick={() => downloadInvoice(order, siteSettings)}
                                className="text-[10px] font-semibold tracking-[0.15em] uppercase border border-border px-4 py-1.5 hover:bg-secondary transition-colors"
                              >
                                Download Invoice
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {activeTab === "addresses" && (
                <>
                  <h2 className="text-sm font-semibold tracking-[0.15em] uppercase mb-6">Saved Addresses</h2>
                  {user.addresses.length === 0 ? (
                    <div className="border border-border p-8 text-center">
                      <p className="text-sm text-muted-foreground">No saved addresses yet.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {user.addresses.map((addr) => (
                        <div key={addr.id} className="border border-border p-4">
                          <p className="text-sm font-medium">{addr.label}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}<br />
                            {addr.city}, {addr.state} {addr.zip}<br />
                            {addr.country}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {activeTab === "details" && (
                <>
                  <h2 className="text-sm font-semibold tracking-[0.15em] uppercase mb-6">Account Details</h2>
                  {!editing ? (
                    <div className="border border-border p-6 space-y-3">
                      <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Name</span>
                        <p className="text-sm">{user.firstName} {user.lastName}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Email</span>
                        <p className="text-sm">{user.email}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Phone</span>
                        <p className="text-sm">{user.phone || "Not set"}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Member Since</span>
                        <p className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                      <button
                        onClick={startEdit}
                        className="mt-4 border border-foreground px-6 py-2.5 text-xs font-semibold tracking-[0.2em] uppercase hover:bg-foreground hover:text-background transition-colors"
                      >
                        Edit Details
                      </button>
                    </div>
                  ) : (
                    <div className="border border-border p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold tracking-[0.1em] uppercase mb-1.5">First Name</label>
                          <input value={editFirst} onChange={(e) => setEditFirst(e.target.value)} className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-foreground" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold tracking-[0.1em] uppercase mb-1.5">Last Name</label>
                          <input value={editLast} onChange={(e) => setEditLast(e.target.value)} className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-foreground" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold tracking-[0.1em] uppercase mb-1.5">Phone</label>
                        <input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="w-full border border-border bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-foreground" />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button onClick={saveEdit} className="bg-foreground text-background px-6 py-2.5 text-xs font-semibold tracking-[0.2em] uppercase hover:bg-foreground/90 transition-colors">
                          Save
                        </button>
                        <button onClick={() => setEditing(false)} className="border border-border px-6 py-2.5 text-xs font-semibold tracking-[0.2em] uppercase hover:bg-secondary transition-colors">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Account;
