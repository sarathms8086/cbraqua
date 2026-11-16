import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/components/cart/CartContext";
import Layout from "@/components/layout/Layout";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { formatPrice } from "@/lib/price";
import { getRazorpayCheckout, getRazorpayKeyId } from "@/lib/razorpay";
import { useAdmin } from "@/contexts/AdminContext";
import { calculateDiscount } from "@/lib/discount";

const emptyAddress = { address: "", city: "", state: "", pincode: "", country: "India" };

// India first so it's the default; others let a non-Indian customer pick their
// country honestly and see why checkout is blocked.
const COUNTRIES = [
  "India",
  "Australia", "Bangladesh", "Canada", "China", "France", "Germany", "Indonesia",
  "Italy", "Japan", "Malaysia", "Nepal", "Netherlands", "New Zealand", "Pakistan",
  "Philippines", "Qatar", "Saudi Arabia", "Singapore", "South Africa", "South Korea",
  "Spain", "Sri Lanka", "Sweden", "Switzerland", "Thailand", "United Arab Emirates",
  "United Kingdom", "United States", "Vietnam", "Other",
];

const inputClass =
  "w-full border-b border-border bg-transparent py-2 text-sm focus:outline-none focus:border-foreground transition-colors";
const labelClass =
  "text-[10px] font-semibold tracking-[0.1em] uppercase text-muted-foreground";

function AddressFields({
  prefix,
  values,
  onChange,
  lockCountry = false,
}: {
  prefix: string;
  values: typeof emptyAddress;
  onChange: (field: string, value: string) => void;
  lockCountry?: boolean;
}) {
  return (
    <>
      <div className="space-y-1.5">
        <label className={labelClass}>Country</label>
        {lockCountry ? (
          <>
            <input
              readOnly
              name={`${prefix}_country`}
              value="India"
              autoComplete="off"
              className={`${inputClass} cursor-default`}
            />
            <p className="text-[11px] text-muted-foreground">
              We currently ship within India only. Shipping from outside India?{" "}
              <Link to="/contact" className="underline text-foreground">Contact us</Link>.
            </p>
          </>
        ) : (
        <select
          required
          name={`${prefix}_country`}
          value={values.country}
          onChange={(e) => onChange("country", e.target.value)}
          className={inputClass}
        >
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        )}
      </div>
      <div className="space-y-1.5">
        <label className={labelClass}>Street / Building / Flat No.</label>
        <textarea
          required
          name={`${prefix}_address`}
          value={values.address}
          onChange={(e) => onChange("address", e.target.value)}
          rows={2}
          className={`${inputClass} resize-none`}
          placeholder="Street, Building, Flat No."
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className={labelClass}>City</label>
          <input required name={`${prefix}_city`} value={values.city} onChange={(e) => onChange("city", e.target.value)} className={inputClass} />
        </div>
        <div className="space-y-1.5">
          <label className={labelClass}>State</label>
          <input required name={`${prefix}_state`} value={values.state} onChange={(e) => onChange("state", e.target.value)} className={inputClass} />
        </div>
        <div className="space-y-1.5 col-span-2 md:col-span-1">
          <label className={labelClass}>Pincode</label>
          <input required name={`${prefix}_pincode`} value={values.pincode} onChange={(e) => onChange("pincode", e.target.value)} className={inputClass} />
        </div>
      </div>
    </>
  );
}

const Checkout = () => {
  const { items, subtotal: total, clearCart } = useCart();
  const { siteSettings } = useAdmin();
  const { user, isAuthenticated, isLoading: authLoading, signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [diffBilling, setDiffBilling] = useState(false);
  const [createAccount, setCreateAccount] = useState(false);
  const [accountPassword, setAccountPassword] = useState("");

  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [shipping, setShipping] = useState(emptyAddress);
  const [billing, setBilling] = useState(emptyAddress);

  const discount = calculateDiscount(total, siteSettings.offerDiscountPercent, siteSettings.gstPercent);
  const deliveryFee = siteSettings.deliveryFee ?? 0;
  const grandTotal = discount.total + deliveryFee;

  useEffect(() => {
    if (isAuthenticated && user) {
      const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setContact({
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone || "",
      });
      setShipping({
        address: defaultAddr?.line1 || "",
        city: defaultAddr?.city || "",
        state: defaultAddr?.state || "",
        pincode: defaultAddr?.zip || "",
        country: "India", // shipping is India-only; never pre-fill another country
      });
    }
  }, [isAuthenticated, user]);

  const formatAddr = (a: typeof emptyAddress) =>
    `${a.address}, ${a.city}, ${a.state} - ${a.pincode}, ${a.country}`;

  // We currently ship only within India.
  const shipsToIndia = shipping.country === "India";

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (!shipsToIndia) {
      toast({
        title: "We currently ship only within India",
        description: "International shipping is coming soon.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Optional account creation for guests
      let userId = user?.id || null;
      if (!isAuthenticated && createAccount && accountPassword) {
        const nameParts = contact.name.trim().split(" ");
        const result = await signup({
          email: contact.email,
          password: accountPassword,
          firstName: nameParts[0] || contact.name,
          lastName: nameParts.slice(1).join(" ") || "",
        });
        if (!result.success) {
          toast({ title: "Account creation failed", description: result.error, variant: "destructive" });
        }
      }

      const billingAddr = diffBilling ? formatAddr(billing) : null;

      const orderData = {
        amount: grandTotal,
        currency: "INR",
        shippingCountry: shipping.country,
        customer: {
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          address: formatAddr(shipping),
        },
        billingAddress: billingAddr,
        userId,
        items: items.map((item) => ({
          id: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          color: item.color,
          size: item.size,
        })),
        discount: {
          percent: discount.discountPercent,
          amount: discount.discountAmount,
          subtotal: total,
        },
      };

      const order = await api.orders.create(orderData);

      const options = {
        key: getRazorpayKeyId(),
        amount: order.amount,
        currency: order.currency,
        name: "DANYWENS",
        description: "Contemporary Streetwear Archive",
        order_id: order.id,
        handler: async (response: any) => {
          try {
            await api.orders.verify(response);
            toast({ title: "Order Successful", description: "Your order has been placed successfully." });
            clearCart();
            navigate(isAuthenticated ? "/account" : "/");
          } catch {
            toast({ title: "Verification Failed", description: "Could not verify payment.", variant: "destructive" });
          }
        },
        prefill: { name: contact.name, email: contact.email, contact: contact.phone },
        theme: { color: "#000000" },
      };

      const RazorpayCheckout = getRazorpayCheckout();
      const rzp = new RazorpayCheckout(options);
      rzp.open();
    } catch (err) {
      toast({
        title: "Payment Error",
        description: err instanceof Error ? err.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-heading mb-4">YOUR BAG IS EMPTY</h1>
          <Link to="/shop" className="text-xs font-semibold tracking-widest uppercase border-b border-foreground pb-1">
            Return to Shop
          </Link>
        </div>
      </Layout>
    );
  }

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-24 md:pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Form */}
          <div className="order-2 lg:order-1">
            <h1 className="text-3xl font-heading tracking-tight mb-8">CHECKOUT</h1>

            {/* Guest sign-in nudge */}
            {!isAuthenticated && (
              <p className="text-xs text-muted-foreground mb-6">
                Already have an account?{" "}
                <Link to="/login" state={{ from: "/checkout" }} className="underline text-foreground">
                  Sign in
                </Link>{" "}
                to pre-fill your details.
              </p>
            )}

            <form onSubmit={handlePayment} className="space-y-6">
              {/* Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>Full Name</label>
                  <input
                    required
                    value={contact.name}
                    onChange={(e) => setContact((p) => ({ ...p, name: e.target.value }))}
                    className={inputClass}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className={labelClass}>Email Address</label>
                  <input
                    required
                    type="email"
                    value={contact.email}
                    onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))}
                    className={inputClass}
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Phone Number</label>
                <input
                  required
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => setContact((p) => ({ ...p, phone: e.target.value }))}
                  className={inputClass}
                  placeholder="+91 98765 43210"
                />
              </div>

              {/* Shipping address */}
              <div>
                <p className="text-xs font-semibold tracking-[0.1em] uppercase mb-3">Shipping Address</p>
                <div className="space-y-4">
                  <AddressFields
                    prefix="shipping"
                    lockCountry
                    values={shipping}
                    onChange={(field, value) => setShipping((p) => ({ ...p, [field]: value }))}
                  />
                </div>
              </div>

              {/* Billing address toggle */}
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={diffBilling}
                  onChange={(e) => setDiffBilling(e.target.checked)}
                  className="w-4 h-4 accent-foreground"
                />
                <span className="text-xs font-medium">Use a different billing address</span>
              </label>

              {diffBilling && (
                <div>
                  <p className="text-xs font-semibold tracking-[0.1em] uppercase mb-3">Billing Address</p>
                  <div className="space-y-4">
                    <AddressFields
                      prefix="billing"
                      values={billing}
                      onChange={(field, value) => setBilling((p) => ({ ...p, [field]: value }))}
                    />
                  </div>
                </div>
              )}

              {/* Optional account creation for guests */}
              {!isAuthenticated && (
                <div className="border border-border rounded-lg p-4 space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={createAccount}
                      onChange={(e) => setCreateAccount(e.target.checked)}
                      className="w-4 h-4 accent-foreground"
                    />
                    <span className="text-xs font-medium">Save my details &amp; create an account for order tracking</span>
                  </label>
                  {createAccount && (
                    <div className="space-y-1.5">
                      <label className={labelClass}>Choose a Password</label>
                      <input
                        type="password"
                        required={createAccount}
                        minLength={6}
                        value={accountPassword}
                        onChange={(e) => setAccountPassword(e.target.value)}
                        className={inputClass}
                        placeholder="Min. 6 characters"
                      />
                    </div>
                  )}
                </div>
              )}

              {!shipsToIndia && (
                <div className="border border-destructive/40 bg-destructive/5 rounded-lg p-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-destructive">
                    We currently ship only within India
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    International shipping is coming soon. Please select India to continue.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !shipsToIndia}
                className="w-full bg-[#00c8f8] hover:bg-cyan-300 text-slate-950 font-bold py-4 text-xs tracking-[0.2em] uppercase rounded-full transition-all shadow-lg shadow-cyan-500/25 mt-8 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "PROCESSING..." : !shipsToIndia ? "UNAVAILABLE FOR YOUR COUNTRY" : "PAY NOW"}
              </button>
            </form>
          </div>

          {/* Summary */}
          <div className="order-1 lg:order-2">
            <div className="bg-secondary/30 p-8 rounded-sm sticky top-32">
              <h2 className="text-xl font-heading tracking-tight mb-6">ORDER SUMMARY</h2>
              <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.color}-${item.size}`} className="flex gap-4">
                    <div className="w-16 h-20 bg-secondary flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-semibold uppercase truncate">{item.name}</h3>
                      <p className="text-[10px] text-muted-foreground mt-1 uppercase">
                        {item.color} / {item.size}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-[10px] text-muted-foreground uppercase">Qty: {item.quantity}</p>
                        <p className="text-xs font-mono font-medium">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-border pt-6">
                <div className="flex justify-between text-xs text-muted-foreground uppercase tracking-wider">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                {discount.discountAmount > 0 && (
                  <div className="flex justify-between text-xs uppercase tracking-wider text-green-700">
                    <span>Offer ({discount.discountPercent}% off)</span>
                    <span>-{formatPrice(discount.discountAmount)}</span>
                  </div>
                )}
                {discount.gstAmount > 0 && (
                  <div className="flex justify-between text-xs text-muted-foreground uppercase tracking-wider">
                    <span>GST ({discount.gstPercent}%)</span>
                    <span>{formatPrice(discount.gstAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-muted-foreground uppercase tracking-wider">
                  <span>Delivery</span>
                  <span>{deliveryFee > 0 ? formatPrice(deliveryFee) : "Free"}</span>
                </div>
                <div className="flex justify-between text-base font-heading tracking-tight border-t border-border pt-4 mt-2">
                  <span>TOTAL</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <p className="text-[10px] text-muted-foreground mt-8 text-center italic">
                Secure checkout powered by Razorpay.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
