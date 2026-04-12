"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/app/actions/auth";
import { useSession } from "next-auth/react";
import UserDropdown from "@/components/dashboard/UserDropdown";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import LoadingDots from "@/components/ui/LoadingDots";

export default function LoginPage() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError("");

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setIsPending(false);
    } else if (result?.success) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface transition-colors duration-500">
      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-primary/5">
        <nav className="flex justify-between items-center px-6 h-20 w-full max-w-screen-xl mx-auto">
          <Link href="/" className="font-editorial font-bold text-2xl text-primary tracking-tighter italic">
            Mithaq <span className="font-sans ml-1 text-sm opacity-30 not-italic">مِيثَاق</span>
          </Link>

          {session?.user && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <UserDropdown user={session.user as any} />
            </motion.div>
          )}
        </nav>
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-12 pt-32">
      <div className="w-full max-w-md space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-editorial tracking-tight text-on-surface italic">
            Mithaq <span className="text-2xl font-sans not-italic opacity-40">مِيثَاق</span>
          </h1>
          <div className="space-y-1">
            <h2 className="text-2xl font-editorial text-primary">
              Welcome Back
            </h2>
            <p className="text-sm text-on-surface-variant font-sans tracking-wide uppercase">
              مرحباً بك مرة أخرى
            </p>
          </div>
        </div>

        <div className="bg-surface-container-low p-8 md:p-10 rounded-[2rem] editorial-shadow border-none transition-all">
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full rounded-xl bg-surface-container-highest border-none px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                  Password
                </label>
                <div className="relative group">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="block w-full rounded-xl bg-surface-container-highest border-none px-4 py-3 pr-12 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-on-surface-variant/50 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {error && <p className="text-sm text-error font-sans">{error}</p>}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 rounded-full font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all editorial-shadow disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-h-[60px]"
            >
              {isPending ? <LoadingDots color="white" /> : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-on-surface-variant font-sans">
          New to the sanctuary?{" "}
          <Link href="/signup" className="font-bold text-primary hover:text-primary/80 transition-colors underline decoration-primary/30 underline-offset-4">
            Create an account
          </Link>
        </p>
      </div>
    </div>
    </div>
  );
}
