type RazorpayEnv = {
  VITE_RAZORPAY_KEY_ID?: string;
};

export function isPlaceholderRazorpayKey(keyId?: string) {
  return !keyId || keyId.includes("placeholder");
}

export function getRazorpayKeyId(env: RazorpayEnv = import.meta.env) {
  const keyId = env.VITE_RAZORPAY_KEY_ID;

  if (isPlaceholderRazorpayKey(keyId)) {
    throw new Error("Razorpay key is not configured");
  }

  return keyId;
}

export function getRazorpayCheckout(win: Window = window) {
  const RazorpayCheckout = (win as Window & { Razorpay?: unknown }).Razorpay;

  if (typeof RazorpayCheckout !== "function") {
    throw new Error("Razorpay checkout script is not loaded");
  }

  return RazorpayCheckout as new (options: Record<string, unknown>) => { open: () => void };
}
