"use client";

import { useSocket } from "@/components/providers/SocketProvider";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface Props {
  isPartnerLinked: boolean;
}

export default function PresenceIndicator({ isPartnerLinked }: Props) {
  const { partnerOnline, partnerTyping } = useSocket();
  
  if (!isPartnerLinked) return null;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn(
        "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-label font-bold uppercase tracking-widest transition-all duration-500",
        partnerOnline 
          ? "bg-tertiary/10 text-tertiary" 
          : "bg-surface-container-high text-on-surface-variant/40"
      )}>
        <span className="relative flex h-2 w-2">
          {partnerOnline && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
          )}
          <span className={cn(
            "relative inline-flex rounded-full h-2 w-2",
            partnerOnline ? "bg-tertiary" : "bg-on-surface-variant/20"
          )}></span>
        </span>
        <span>
          {partnerOnline ? "Partner Online" : "Partner Offline"}
        </span>
      </div>
      {partnerTyping && (
        <span className="text-[9px] font-label font-bold tracking-widest text-primary uppercase animate-pulse">
          Reflecting...
        </span>
      )}
    </div>
  );
}
