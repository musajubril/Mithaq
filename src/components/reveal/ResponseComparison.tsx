"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Props {
  userAnswer: string | number | null;
  partnerAnswer: string | number | null;
  isRevealed: boolean;
}

export default function ResponseComparison({ userAnswer, partnerAnswer, isRevealed }: Props) {
  const isLongText = (val: any) => typeof val === 'string' && val.length > 3;

  const renderValue = (val: string | number | null, label: string, isPartner = false) => {
    const showValue = !isPartner || isRevealed;
    const long = isLongText(val);

    return (
      <div className="space-y-4 text-center flex flex-col items-center w-full">
        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{label}</span>
        <div className="relative w-full flex justify-center">
          <motion.div 
            className={cn(
              "flex items-center justify-center transition-all duration-700",
              long 
                ? "w-full max-w-xs min-h-[100px] rounded-[2rem] p-6 text-sm leading-relaxed text-left bg-surface-container-high" 
                : "w-16 h-16 rounded-full text-2xl font-editorial",
              showValue 
                ? isPartner ? "bg-primary-container text-on-primary-container editorial-shadow" : "bg-primary text-on-primary editorial-shadow"
                : "bg-surface-container-high text-on-surface-variant/20 blur-sm"
            )}
            animate={showValue ? { filter: "blur(0px)", scale: 1 } : { filter: "blur(8px)", scale: 0.95 }}
          >
            {showValue ? (val || "?") : "?"}
          </motion.div>
          
          {isPartner && !isRevealed && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40 animate-pulse">
                Locked
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-12 w-full max-w-3xl mx-auto pt-12 border-t border-outline/5 justify-center items-start">
      {renderValue(userAnswer, "Your Perspective")}
      {renderValue(partnerAnswer, "Partner's Response", true)}
    </div>
  );
}
