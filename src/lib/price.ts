export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price || 0);
}

export function formatPriceInputValue(price: number) {
  return price === 0 ? "" : String(price);
}

export function parsePriceInput(value: string) {
  return value.trim() === "" ? 0 : Number(value);
}
