"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface SocketContextType {
  socket: Socket | null;
  partnerOnline: boolean;
  partnerTyping: string | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [partnerOnline, setPartnerOnline] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      const userId = session.user.id;
      const partnerId = (session.user as any).partnerId;
      const newSocket = io(); // Connects to same host/port by default
      
      newSocket.on("connect", () => {
        console.log(`[CLIENT] Socket connected! Joining as ${userId} with partner ${partnerId}`);
        newSocket.emit("join", { userId, partnerId });
      });

      newSocket.on("connect_error", (err) => {
        console.error(`[CLIENT] Socket connection error: ${err.message}`);
      });

      newSocket.on("partnerStatus", ({ online }: { online: boolean }) => {
        console.log(`[CLIENT] Received partnerStatus: ${online ? "Online" : "Offline"}`);
        setPartnerOnline(online);
      });

      newSocket.on("notification", ({ title, message }: { title: string; message: string }) => {
        toast.success(
          <div className="flex flex-col gap-1">
            <p className="font-bold text-sm tracking-tight">{title}</p>
            <p className="text-xs opacity-70">{message}</p>
          </div>,
          {
            icon: "💍",
            duration: 6000
          }
        );
      });

      newSocket.on("partnerTyping", ({ category }: { category: string }) => {
        setPartnerTyping(category || "something");
        setTimeout(() => setPartnerTyping(null), 3000);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [session?.user?.id, (session?.user as any)?.partnerId]);

  return (
    <SocketContext.Provider value={{ socket, partnerOnline, partnerTyping }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
