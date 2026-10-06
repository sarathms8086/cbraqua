export function createClientId(source: Pick<Window, "crypto"> = window) {
  if (typeof source.crypto?.randomUUID === "function") {
    return source.crypto.randomUUID();
  }

  return `client-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
