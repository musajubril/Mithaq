"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/app/actions/auth";
import { Eye, EyeOff } from "lucide-react";
import LoadingDots from "@/components/ui/LoadingDots";

export default function SignUpPage() {
  const [name, setName] = useState("");
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
    const result = await signUp(formData);

    if (result?.error) {
      setError(result.error);
      setIsPending(false);
    } else {
      router.push("/login?success=account-created");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-12 transition-colors duration-500">
      <div className="w-full max-w-md space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-editorial tracking-tight text-on-surface italic">
            Mithaq <span className="text-2xl font-sans not-italic opacity-40">مِيثَاق</span>
          </h1>
          <div className="space-y-1">
            <h2 className="text-2xl font-editorial text-primary">
              Begin Your Journey
            </h2>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
              ابدأ رحلتك
            </p>
          </div>
        </div>

        <div className="bg-surface-container-low p-8 md:p-10 rounded-[2.5rem] editorial-shadow border-none transition-all">
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  className="block w-full rounded-xl bg-surface-container-highest border-none px-4 py-3 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full rounded-xl bg-surface-container-highest border-none px-4 py-3 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
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
                    className="block w-full rounded-xl bg-surface-container-highest border-none px-4 py-3 pr-12 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
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
              {isPending ? <LoadingDots color="white" /> : "Create Account"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-on-surface-variant font-sans">
          Already part of the sanctuary?{" "}
          <Link href="/login" className="font-bold text-primary hover:text-primary/80 transition-colors underline decoration-primary/30 underline-offset-4">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
