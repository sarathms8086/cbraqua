import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/lib/api";

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  addresses: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  addAddress: (address: Omit<Address, "id">) => Promise<void>;
  removeAddress: (id: string) => void;
  updateAddress: (id: string, updates: Partial<Address>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = "danywens_session";

function normalizeUser(profile: any): UserProfile {
  return { ...profile, addresses: Array.isArray(profile?.addresses) ? profile.addresses : [] };
}

function persistUser(profile: any): UserProfile {
  const normalized = normalizeUser(profile);
  localStorage.setItem(SESSION_KEY, JSON.stringify(normalized));
  return normalized;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        setUser(normalizeUser(JSON.parse(session)));
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const profile = await api.auth.login({ email, password });
      setUser(persistUser(profile));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Invalid credentials" };
    }
  };

  const signup = async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    try {
      const profile = await api.auth.signup(data);
      setUser(persistUser(profile));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Signup failed" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const profile = await api.auth.updateProfile({ ...updates, email: user.email });
      setUser(persistUser(profile));
    } catch (err) {
      console.error("Profile update failed:", err);
    }
  };

  const addAddress = async (address: Omit<Address, "id">) => {
    if (!user) return;
    try {
      const profile = await api.auth.addAddress(user.id, address);
      setUser(persistUser(profile));
    } catch (err) {
      console.error("Failed to add address:", err);
    }
  };

  const removeAddress = (id: string) => {
    if (!user) return;
    updateProfile({ addresses: user.addresses.filter((a) => a.id !== id) });
  };

  const updateAddress = (id: string, updates: Partial<Address>) => {
    if (!user) return;
    updateProfile({
      addresses: user.addresses.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, signup, logout, updateProfile, addAddress, removeAddress, updateAddress }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
