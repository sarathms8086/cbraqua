type RazorpayEnv = {
  RAZORPAY_KEY_ID?: string;
  RAZORPAY_KEY_SECRET?: string;
};

function isMissingOrPlaceholder(value?: string) {
  return !value || value.includes("placeholder");
}

export function getRazorpayConfig(env: RazorpayEnv) {
  const key_id = env.RAZORPAY_KEY_ID;
  const key_secret = env.RAZORPAY_KEY_SECRET;

  if (isMissingOrPlaceholder(key_id) || isMissingOrPlaceholder(key_secret)) {
    throw new Error("Razorpay server keys are not configured");
  }

  return { key_id: key_id as string, key_secret: key_secret as string };
}
