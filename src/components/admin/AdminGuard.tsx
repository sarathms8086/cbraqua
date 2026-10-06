import { ReactNode } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import AdminLogin from "@/pages/admin/AdminLogin";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const { isAdmin } = useAdmin();
  if (!isAdmin) return <AdminLogin />;
  return <>{children}</>;
}
