import { createServer } from "node:http";
import { parse } from "node:url";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const activeUsers = new Map(); // userId -> socketId
const userPartners = new Map(); // userId -> partnerId

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url || "", true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("[SOCKET] User connected:", socket.id);

    socket.on("join", ({ userId, partnerId }) => {
      if (!userId) return;
      activeUsers.set(userId, socket.id);
      if (partnerId) userPartners.set(userId, partnerId);
      
      socket.join(userId);
      console.log(`[SOCKET] User ${userId} joined. Partner: ${partnerId}`);
      
      // 1. Notify partner that user is online
      if (partnerId && activeUsers.has(partnerId)) {
        const partnerSocketId = activeUsers.get(partnerId);
        io.to(partnerSocketId).emit("partnerStatus", { online: true });
        
        // 2. Notify user that partner is already online
        socket.emit("partnerStatus", { online: true });
      }
    });

    socket.on("partnerLinked", ({ userId, partnerId, partnerName }) => {
      if (activeUsers.has(userId)) {
        io.to(activeUsers.get(userId)).emit("notification", { 
          title: "Successfully Linked!", 
          message: `You are now connected with ${partnerName}.` 
        });
      }
      if (partnerId && activeUsers.has(partnerId)) {
        io.to(activeUsers.get(partnerId)).emit("notification", { 
          title: "Partner Linked!", 
          message: "Your partner has successfully connected with you." 
        });
        io.to(activeUsers.get(partnerId)).emit("partnerStatus", { online: true });
        if (activeUsers.has(userId)) {
          io.to(activeUsers.get(userId)).emit("partnerStatus", { online: true });
        }
      }
    });

    socket.on("typing", ({ userId, partnerId, category }) => {
      if (partnerId && activeUsers.has(partnerId)) {
        io.to(activeUsers.get(partnerId)).emit("partnerTyping", { category });
      }
    });

    socket.on("disconnect", () => {
      let disconnectedUserId = null;
      for (const [uid, sid] of activeUsers.entries()) {
        if (sid === socket.id) {
          disconnectedUserId = uid;
          activeUsers.delete(uid);
          break;
        }
      }

      if (disconnectedUserId) {
        const partnerId = userPartners.get(disconnectedUserId);
        if (partnerId && activeUsers.has(partnerId)) {
          io.to(activeUsers.get(partnerId)).emit("partnerStatus", { online: false });
        }
      }
      console.log("[SOCKET] User disconnected:", socket.id);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
