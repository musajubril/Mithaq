"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, LogOut, Sparkles, Palette, Check, UserPlus, LogIn } from "lucide-react";
import { logout } from "@/app/actions/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";

const themes = [
  { id: "serene", name: "Sage", primary: "#635f40", surface: "#faf9f4" },
  { id: "heritage", name: "Heritage", primary: "#9f393b", surface: "#fef8f4" },
  { id: "rose", name: "Rose", primary: "#7B5455", surface: "#FFF8F1" },
  { id: "midnight", name: "Midnight", primary: "#f2ca50", surface: "#131313" },
  { id: "editorial", name: "Editorial", primary: "#486173", surface: "#faf9f7" },
];

interface UserDropdownProps {
  user?: {
    fullName?: string;
    email?: string;
  } | null;
}

export default function UserDropdown({ user }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-container-high hover:bg-primary/10 text-primary transition-all duration-500 group relative overflow-hidden ring-1 ring-primary/5 hover:ring-primary/20 shadow-sm"
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative z-10"
        >
          <Settings size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
        </motion.div>
        
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full right-0 mt-4 w-72 bg-surface-container-lowest border border-primary/10 rounded-[2.5rem] shadow-[0px_25px_80px_rgba(0,0,0,0.15)] z-[999] overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-outline/5 bg-surface-container-lowest">
              {user ? (
                <>
                  <p className="font-editorial text-lg text-on-surface italic">{user.fullName}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">
                    {user.email}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-editorial text-lg text-on-surface italic">Mithaq Sanctuary</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">
                    Personalize your experience
                  </p>
                </>
              )}
            </div>

            {/* Themes Section */}
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-[0.2em] text-[10px]">
                <Palette className="w-3 h-3" />
                <span>Atmosphere</span>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id as any)}
                    className="group relative flex flex-col items-center gap-1.5"
                    title={t.name}
                  >
                    <div 
                      className={cn(
                        "w-full aspect-square rounded-full border-2 transition-all duration-300",
                        theme === t.id ? "border-primary scale-110 shadow-sm" : "border-outline/10 hover:border-primary/30"
                      )}
                      style={{ backgroundColor: t.surface }}
                    >
                      <div 
                        className="absolute bottom-0 right-0 w-1/2 h-1/2 rounded-tl-full"
                        style={{ backgroundColor: t.primary }}
                      />
                      {theme === t.id && (
                        <div className="absolute inset-0 flex items-center justify-center text-primary">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="px-4 pb-4 space-y-2">
              {/* Dashboard Link (Authenticated) */}
              {user && pathname !== "/dashboard" && (
                <Link 
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center gap-3 py-3 px-4 rounded-2xl text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-all duration-300 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Sparkles size={16} className="text-primary" />
                  </div>
                  <span className="font-bold uppercase tracking-widest text-[10px]">Your Sanctuary</span>
                </Link>
              )}

              {/* Login/Signup (Unauthenticated) */}
              {!user && (
                <>
                  <Link 
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center gap-3 py-3 px-4 rounded-2xl text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <LogIn size={16} className="text-primary" />
                    </div>
                    <span className="font-bold uppercase tracking-widest text-[10px]">Sign In</span>
                  </Link>
                  <Link 
                    href="/signup"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center gap-3 py-3 px-4 rounded-2xl text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <UserPlus size={16} className="text-primary" />
                    </div>
                    <span className="font-bold uppercase tracking-widest text-[10px]">Join the Sanctuary</span>
                  </Link>
                </>
              )}
            </div>

            {/* Logout (Authenticated) */}
            {user && (
              <div className="p-4 bg-surface-container-low/50">
                <form action={logout}>
                  <button 
                    className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl text-on-surface-variant hover:text-primary hover:bg-surface-container-highest transition-all duration-300"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-bold uppercase tracking-widest text-[10px]">End Journey</span>
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
