import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { adminLogin } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(password)) {
      navigate("/admin");
    } else {
      setError("Invalid password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4">
      <div className="w-full max-w-sm bg-background border border-border rounded-lg p-8">
        <h1 className="text-2xl font-heading tracking-tight mb-2 text-center">Admin Access</h1>
        <p className="text-sm text-muted-foreground text-center mb-8">Enter the admin password to continue.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold tracking-[0.1em] uppercase mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              className="w-full border border-border bg-transparent px-3 py-2.5 text-sm rounded-md focus:outline-none focus:border-foreground"
              placeholder="Enter admin password"
            />
            {error && <p className="text-xs text-destructive mt-1">{error}</p>}
          </div>
          <button type="submit" className="w-full bg-primary text-primary-foreground py-2.5 text-xs font-semibold tracking-[0.1em] uppercase rounded-md hover:bg-primary/90 transition-colors">
            Sign In
          </button>
        </form>
        {import.meta.env.DEV && (
          <p className="text-xs text-muted-foreground text-center mt-6">
            Dev default: admin123 (set VITE_ADMIN_PASSWORD to override)
          </p>
        )}
      </div>
    </div>
  );
}
