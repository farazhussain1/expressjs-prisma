import { Server } from "socket.io";
import { OnlineUsers } from "./model";
import { verifyToken } from "./middleware/Auth";
import { ChatService } from "./service";
import { httpServer } from ".";


export const onlineUsers: OnlineUsers = {};
const socketServer = new Server(httpServer, { cors: { origin: "*" } });
const { saveMessage } = new ChatService();

socketServer.use((socket, next) => {
  const isVerified = verifyToken(socket.handshake.query);
  if (!isVerified) {
    socket._error({ error: "Unauthorized" });
    socket.disconnect(true);
    return false;
  }
  if (typeof isVerified === "object") {
    socket.handshake.auth = isVerified;
    next();
  }
});

socketServer.on("connection", async (socket) => {
  console.info(`New Socket Connection ${socket.id}`);
  const user = socket.handshake.auth;

  onlineUsers[user.id] = {
    authenticated: true,
    socketId: socket.id,
    socket
  };
  console.table(onlineUsers);

  socket.on("message", (payload) => {
    payload.from = user.id;
    const data = saveMessage(payload);
    console.log(data);
    const toSocket = onlineUsers[payload.to]?.socketId;
    socket.to(toSocket).emit("message", payload);
  });

  socket.on("disconnect", (payload) => {
    console.log(`Socket : ${socket.id} disconnected.`);
    delete onlineUsers[user.id];
    console.table(onlineUsers);
  });
});
