"use client";

import { useEffect, useState } from "react";
import { getDailyPrompt } from "@/app/actions/ai";

export default function DailyPrompt() {
  const [prompt, setPrompt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrompt() {
      const result = await getDailyPrompt();
      setPrompt(result);
      setLoading(false);
    }
    fetchPrompt();
  }, []);

  return (
    <div className="flex flex-col justify-between h-full space-y-8">
      <div className="space-y-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Daily Reflection</span>
        <div className="min-h-[140px] flex items-center">
          {loading ? (
            <div className="w-full space-y-3">
              <div className="h-4 bg-primary/5 animate-pulse rounded-full w-full" />
              <div className="h-4 bg-primary/5 animate-pulse rounded-full w-2/3" />
              <div className="h-4 bg-primary/5 animate-pulse rounded-full w-1/2" />
            </div>
          ) : (
            <p className="text-2xl font-editorial italic text-on-surface leading-snug">
              "{prompt || "What is one thing your partner did this week that made you feel truly respected?"}"
            </p>
          )}
        </div>
      </div>
      
      <button className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-5 rounded-[2rem] font-bold uppercase tracking-[0.2em] text-[10px] hover:scale-[1.02] active:scale-95 transition-all duration-500 shadow-xl shadow-primary/20">
        {loading ? "Preparing..." : "Respond with Intent"}
      </button>
    </div>
  );
}
