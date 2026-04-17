"use client";

import { useActionState } from "react";
import { linkPartner } from "@/app/actions/partner";
import { useSocket } from "@/components/providers/SocketProvider";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import LoadingDots from "@/components/ui/LoadingDots";

type FormState = {
  error?: string;
  success?: boolean;
  partnerId?: string;
  partnerName?: string;
} | null;

export default function PartnerSyncForm({ userCode }: { userCode: string }) {
  const { data: session, update } = useSession();
  // @ts-ignore - Next.js action types mismatch in some versions
  const [state, formAction, isPending] = useActionState<FormState, FormData>(linkPartner, null);
  const { socket } = useSocket();

  useEffect(() => {
    const handleSuccess = async () => {
      if (state?.success && socket && session?.user) {
        // Update the JWT session on the frontend
        await update({ partnerId: state.partnerId });

        /* Temporarily disabled socket emission
        socket.emit("partnerLinked", { 
          userId: (session.user as any).id, 
          partnerId: state.partnerId, 
          partnerName: state.partnerName,
          userName: session.user.name
        });
        */
        
        // Give time for socket emission and toast before hard refresh
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    };

    handleSuccess();
  }, [state?.success, socket, session?.user]);

  return (
    <div className="bg-surface-container-low p-8 rounded-[2rem] editorial-shadow border border-primary/10 space-y-8">
      <div className="space-y-2">
        <h3 className="text-xl font-editorial italic text-primary tracking-tight">Partner Sync</h3>
        <p className="text-sm text-on-surface-variant leading-relaxed">Connect with your partner to reveal answers together.</p>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 bg-surface-container-highest rounded-2xl text-center space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.2rem] text-on-surface-variant">Your Code</span>
          <p className="text-3xl font-editorial tracking-[0.3em] text-primary select-all">{userCode}</p>
        </div>

        <form action={formAction} className="space-y-3">
          <input 
            name="partnerCode"
            placeholder="ENTER PARTNER'S CODE"
            className="w-full bg-surface-container-lowest border-none rounded-xl px-4 py-4 text-sm font-bold tracking-widest uppercase text-center placeholder:text-on-surface-variant/30 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            required
          />
          <button 
            type="submit"
            disabled={isPending}
            className="w-full bg-primary/10 text-primary py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-primary hover:text-on-primary transition-all disabled:opacity-50 min-h-[52px] flex items-center justify-center"
          >
            {isPending ? <LoadingDots color="currentColor" /> : "Link Partner"}
          </button>
          
          {state?.error && (
            <p className="text-xs text-red-500 font-bold uppercase tracking-widest text-center mt-2">
              {state.error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
