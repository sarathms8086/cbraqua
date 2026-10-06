import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const [isSignup, setIsSignup] = useState(location.pathname === "/signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");

  // Sync form mode with URL when navigating between /login and /signup
  useEffect(() => {
    setIsSignup(location.pathname === "/signup");
    setError("");
  }, [location.pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const from = (location.state as { from?: string } | null)?.from || "/account";

    if (isSignup) {
      if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
      if (password !== confirmPassword) { setError("Passwords do not match."); return; }
      if (!firstName.trim() || !lastName.trim()) { setError("First and last name are required."); return; }
      const result = await signup({ email, password, firstName: firstName.trim(), lastName: lastName.trim() });
      if (result.success) navigate(from);
      else setError(result.error || "Signup failed.");
    } else {
      const result = await login(email, password);
      if (result.success) navigate(from);
      else setError(result.error || "Login failed.");
    }
  };

  return (
    <Layout>
      <div className="pt-[102px] md:pt-32 px-4 md:px-8 pb-16">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl md:text-4xl font-heading tracking-tight mb-2 text-center">
            {isSignup ? "Create Account" : "Sign In"}
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-12">
            {isSignup ? "Join the DANYWENS community." : "Welcome back."}
          </p>

          {error && (
            <div className="mb-6 bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignup && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold tracking-[0.1em] uppercase mb-2">First Name</label>
                  <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-[0.1em] uppercase mb-2">Last Name</label>
                  <input required value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors" />
                </div>
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold tracking-[0.1em] uppercase mb-2">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-[0.1em] uppercase mb-2">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors" />
            </div>
            {isSignup && (
              <div>
                <label className="block text-xs font-semibold tracking-[0.1em] uppercase mb-2">Confirm Password</label>
                <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors" />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-foreground text-background py-4 text-xs font-semibold tracking-[0.2em] uppercase hover:bg-foreground/90 transition-colors"
            >
              {isSignup ? "Create Account" : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => {
                setError("");
                if (isSignup) {
                  navigate("/login");
                } else {
                  navigate("/signup");
                }
              }}
              className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
            >
              {isSignup ? "Already have an account? Sign in" : "Don't have an account? Create one"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
