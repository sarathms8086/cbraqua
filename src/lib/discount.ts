export function normalizeDiscountPercent(value: unknown) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.min(90, Math.max(0, Math.round(parsed)));
}

export function normalizeGstPercent(value: unknown) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.min(100, Math.max(0, Math.round(parsed * 100) / 100));
}

export function calculateDiscount(subtotal: number, percent: unknown, gstPercent: unknown = 0) {
  const discountPercent = normalizeDiscountPercent(percent);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const taxableAmount = Math.max(0, subtotal - discountAmount);

  const normalizedGstPercent = normalizeGstPercent(gstPercent);
  // Inclusive/reverse GST: tax is already inside the price, not added on top
  const gstAmount = normalizedGstPercent > 0
    ? Math.round(taxableAmount * normalizedGstPercent / (100 + normalizedGstPercent))
    : 0;

  return {
    discountPercent,
    discountAmount,
    gstPercent: normalizedGstPercent,
    gstAmount,
    total: taxableAmount,
  };
}
