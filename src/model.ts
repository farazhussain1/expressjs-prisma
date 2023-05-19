import { Socket } from "socket.io";

export interface Config {
  NODE_ENV: string;
  SECRET_KEY: string;
  PORT: string;
  DATABASE_URL: string;
}

export interface OnlineUsers {
  [userId: number]: {
    authenticated: boolean;
    socketId: string;
    socket?: Socket;
  };
}

export interface CattleAlert {
  userId: number;
  message: string;
  cattleId: number;
  cattleName: string;
  dateTime: string;
}

declare module "express-serve-static-core" {
  interface Request {
    userId: number;
  }
}
