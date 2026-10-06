const API_URL = "/api";

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    let message = res.statusText || "Request failed";
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // Keep the HTTP status text when the response body is not JSON.
    }
    throw new Error(message);
  }
  if (res.status === 204) return {} as T;
  return res.json();
}

export const api = {
  products: {
    getAll: () => apiFetch<any[]>("/products"),
    getOne: (id: string) => apiFetch<any>(`/products/${id}`),
    create: (data: any) => apiFetch("/products", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiFetch(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => apiFetch(`/products/${id}`, { method: "DELETE" }),
  },
  collections: {
    getAll: () => apiFetch<any[]>("/collections"),
    create: (data: any) => apiFetch("/collections", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiFetch(`/collections/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => apiFetch(`/collections/${id}`, { method: "DELETE" }),
  },
  mosaic: {
    getAll: () => apiFetch<any[]>("/mosaic"),
    create: (data: any) => apiFetch("/mosaic", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiFetch(`/mosaic/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => apiFetch(`/mosaic/${id}`, { method: "DELETE" }),
  },
  settings: {
    get: () => apiFetch<any>("/settings"),
    update: (data: any) => apiFetch("/settings", { method: "PUT", body: JSON.stringify(data) }),
  },
  analytics: {
    get: () => apiFetch<any>("/analytics"),
  },
  orders: {
    getAll: (params?: { status?: string; search?: string }) => {
      const qs = new URLSearchParams();
      if (params?.status) qs.set("status", params.status);
      if (params?.search) qs.set("search", params.search);
      const q = qs.toString();
      return apiFetch<any[]>(`/orders${q ? "?" + q : ""}`);
    },
    getOne: (id: string) => apiFetch<any>(`/orders/${id}`),
    getByUser: (userId: string) => apiFetch<any[]>(`/orders/user/${userId}`),
    track: (orderId: string, email: string) =>
      apiFetch<any>(`/orders/track?orderId=${encodeURIComponent(orderId)}&email=${encodeURIComponent(email)}`),
    create: (data: any) => apiFetch<any>("/orders/create", { method: "POST", body: JSON.stringify(data) }),
    verify: (data: any) => apiFetch<any>("/orders/verify", { method: "POST", body: JSON.stringify(data) }),
    updateStatus: (id: string, shippingStatus: string) =>
      apiFetch(`/orders/${id}/status`, { method: "PUT", body: JSON.stringify({ shippingStatus }) }),
  },
  customers: {
    getAll: () => apiFetch<any[]>("/customers"),
    getOne: (id: string) => apiFetch<any>(`/customers/${id}`),
  },
  media: {
    getAll: () => apiFetch<any[]>("/media"),
    delete: (filename: string) => apiFetch(`/media/${encodeURIComponent(filename)}`, { method: "DELETE" }),
  },
  upload: async (files: File[]): Promise<{ url: string; name: string }[]> => {
    const formData = new FormData();
    files.forEach(file => formData.append("files", file));
    const res = await fetch(`${API_URL}/upload`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error(`Upload failed: ${res.status} ${res.statusText}`);
    return res.json();
  },
  auth: {
    login: (data: any) => apiFetch("/auth/login", { method: "POST", body: JSON.stringify(data) }),
    signup: (data: any) => apiFetch("/auth/signup", { method: "POST", body: JSON.stringify(data) }),
    updateProfile: (data: any) => apiFetch("/auth/profile", { method: "PUT", body: JSON.stringify(data) }),
    addAddress: (userId: string, address: any) => apiFetch("/auth/address", { method: "POST", body: JSON.stringify({ userId, address }) }),
  },
  search: (q: string) => apiFetch<any>(`/search?q=${encodeURIComponent(q)}`),
  post: (path: string, data: any) => apiFetch(path, { method: "POST", body: JSON.stringify(data) }),
};
