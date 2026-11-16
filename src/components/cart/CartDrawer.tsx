import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "./CartContext";
import { Minus, Plus, X } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice } from "@/lib/price";
import { useAdmin } from "@/contexts/AdminContext";
import { calculateDiscount } from "@/lib/discount";

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, subtotal, totalItems } = useCart();
  const { siteSettings, adminProducts } = useAdmin();

  // Available stock for a cart line (undefined = no stock limit configured).
  const stockFor = (productId: string, colorName: string, size: string): number | undefined => {
    const product = adminProducts.find((p) => p.id === productId);
    const color = product?.colors.find((c) => c.name === colorName);
    return color?.sizeStock?.[size];
  };
  const discount = calculateDiscount(subtotal, siteSettings.offerDiscountPercent, siteSettings.gstPercent);
  const deliveryFee = siteSettings.deliveryFee ?? 0;
  const grandTotal = discount.total + deliveryFee;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="w-full max-w-md bg-background p-0 flex flex-col">
        <SheetTitle className="sr-only">Shopping Bag</SheetTitle>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h2 className="text-sm font-semibold tracking-[0.15em] uppercase">
            Your Bag ({totalItems})
          </h2>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-sm text-muted-foreground mb-6">Your bag is empty</p>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold tracking-[0.15em] uppercase border border-foreground px-8 py-3 hover:bg-foreground hover:text-background transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => {
                const stock = stockFor(item.productId, item.color, item.size);
                const atMax = stock != null && item.quantity >= stock;
                return (
                <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4">
                  <img src={item.image} alt={item.name} className="w-20 h-24 object-cover bg-secondary" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-tight">{item.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.color} / {item.size}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId, item.size, item.color)}
                        className="min-w-11 min-h-11 flex items-center justify-center -m-2 text-muted-foreground hover:text-foreground touch-manipulation"
                        aria-label="Remove from bag"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                          className="min-w-11 min-h-11 p-2.5 flex items-center justify-center hover:bg-secondary transition-colors touch-manipulation"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-medium w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => { if (!atMax) updateQuantity(item.productId, item.size, item.color, item.quantity + 1); }}
                          disabled={atMax}
                          className="min-w-11 min-h-11 p-2.5 flex items-center justify-center hover:bg-secondary transition-colors touch-manipulation disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                    {atMax && (
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-destructive/80 mt-1.5">
                        Max available: {stock}
                      </p>
                    )}
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border px-6 py-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold uppercase tracking-[0.1em]">Subtotal</span>
              <span className="text-sm font-semibold">{formatPrice(subtotal)}</span>
            </div>
            {discount.discountAmount > 0 && (
              <div className="flex justify-between items-center text-sm text-green-700">
                <span className="font-semibold uppercase tracking-[0.1em]">Offer ({discount.discountPercent}% off)</span>
                <span className="font-semibold">-{formatPrice(discount.discountAmount)}</span>
              </div>
            )}
            {discount.gstAmount > 0 && (
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span className="font-semibold uppercase tracking-[0.1em]">GST ({discount.gstPercent}%)</span>
                <span className="font-semibold">{formatPrice(discount.gstAmount)}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span className="font-semibold uppercase tracking-[0.1em]">Delivery</span>
              <span className="font-semibold">{deliveryFee > 0 ? formatPrice(deliveryFee) : "Free"}</span>
            </div>
            <div className="flex justify-between items-center border-t border-border pt-3">
              <span className="text-sm font-semibold uppercase tracking-[0.1em]">Total</span>
              <span className="text-sm font-semibold">{formatPrice(grandTotal)}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#0e1c2a] border border-[#1b2f42] flex items-center gap-2.5 text-[11px] text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-[#00d796] shrink-0" />
              <span>100% Live Arrival Guarantee on all livestock shipments</span>
            </div>
            <Link 
              to="/checkout"
              onClick={() => setIsOpen(false)}
              className="block w-full bg-[#00c8f8] hover:bg-cyan-300 text-slate-950 font-bold py-3.5 text-center text-xs uppercase tracking-wider rounded-full transition-all shadow-md shadow-cyan-500/20"
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/shop"
              onClick={() => setIsOpen(false)}
              className="block text-center text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
