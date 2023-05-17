// import { server } from ".";
// import { Server } from "socket.io";
// import { OnlineUsers } from "./model";
// import { verifyToken } from "./middleware/Auth";
// import { ChatService } from "./service";

// const {saveMessage} = new ChatService()

// const onlineUsers: OnlineUsers = {};

// const socketServer = new Server(server, {
//   cors: { origin: "*" },
//   cookie: true,
// });

// socketServer.use((socket, next) => {
//   const isVerified = verifyToken(socket.handshake.query);
//   console.log("Token = ", isVerified);

//   if (!isVerified) {
//     socket._error({ error: "Unauthorized" });
//     socket.disconnect(true);
//     return false;
//   }
//   if (typeof isVerified === "object") {
//     socket.handshake.auth = isVerified;
//   }
//   next();
// });

// socketServer.on("connection", async (socket) => {
//   console.info(`New Socket Connection ${socket.id}`);
//   const user = socket.handshake.auth
  
//   onlineUsers[user.id] = {
//     authenticated: true,
//     socketId: socket.id,
//   };
//   console.log(onlineUsers);

//   socket.on("message",  (payload) => {
//     payload.from = user.id
//     const data = saveMessage(payload)
//     console.log(data);
    
//     const toSocket = onlineUsers[payload.to]?.socketId;
//     socket.to(toSocket).emit("message", payload);
//   });

//   socket.on("disconnect", (payload) => {
//     console.log(`Reson :  ${socket.id}`);
//     delete onlineUsers[user.id];
//     console.log(onlineUsers);
//   });
// });
