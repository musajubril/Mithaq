"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ReflectionProps {
  userAnswer: string | number | null;
  partnerAnswer: string | number | null;
  userName: string;
  partnerName: string;
  isRevealed: boolean;
}

export default function ReflectionComparison({ 
  userAnswer, 
  partnerAnswer, 
  userName, 
  partnerName, 
  isRevealed 
}: ReflectionProps) {
  
  const renderReflection = (name: string, content: string | number | null, isPartner: boolean) => {
    const initial = name.charAt(0).toUpperCase();
    const showContent = !isPartner || isRevealed;

    return (
      <div className="space-y-6 flex-1">
        <div className="flex items-center gap-3 mb-2">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center font-label text-xs font-bold",
            isPartner 
              ? "bg-secondary-container text-on-secondary-container" 
              : "bg-primary-container/20 text-primary"
          )}>
            {initial}
          </div>
          <span className="font-label text-sm uppercase tracking-widest text-on-surface-variant">
            {name}&apos;s Reflection
          </span>
        </div>
        
        <div className="relative">
          <motion.p 
            initial={isPartner && !isRevealed ? { filter: "blur(12px)", opacity: 0.3 } : { filter: "blur(0px)", opacity: 1 }}
            animate={isPartner && !isRevealed ? { filter: "blur(12px)", opacity: 0.3 } : { filter: "blur(0px)", opacity: 1 }}
            className={cn(
              "font-body text-lg leading-relaxed text-on-surface italic",
              !showContent && "select-none"
            )}
          >
            {showContent ? (
              content ? `"${content}"` : "Still processing this reflection..."
            ) : (
              "Waiting for the hearts to align before revealing this sacred reflection..."
            )}
          </motion.p>
          
          {isPartner && !isRevealed && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-surface-container-high px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary/60 border border-primary/10">
                Awaiting Reveal
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 grid md:grid-cols-2 gap-12 relative overflow-hidden">
      {/* Vertical Divider */}
      <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-[1px] bg-outline-variant/20" />
      
      {renderReflection(userName, userAnswer, false)}
      {renderReflection(partnerName, partnerAnswer, true)}
    </div>
  );
}
